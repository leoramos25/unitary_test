import request from "supertest";
import { Connection } from "typeorm";
import { app } from "../../../../app";
import { verify } from "jsonwebtoken";
import { hash } from "bcryptjs";
import authConfig from "../../../../config/auth"

import createConnection from "../../../../database/index";
import { UsersRepository } from "../../repositories/UsersRepository";

let connection: Connection;
let usersRepository: UsersRepository;

describe("Authenticate User Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  })

  beforeEach(() => {
    usersRepository = new UsersRepository();
  })

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  })

  it("Should be able to authenticate a user and return a JWT valid token", async () => {
    const user = await usersRepository.create({
      name: "test",
      email: "leoramos@supertest.com",
      password: await hash("123456", 8)
    });

    const response = await request(app).post("/api/v1/sessions").send({
      email: "leoramos@supertest.com",
      password: "123456",
    });

    expect(response.status).toBe(200);

    expect(response.body).toEqual({
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      },
      token: expect.any(String)
    })

    expect(() => {
      verify(response.body.token, authConfig.jwt.secret);
    }).not.toThrowError();
  });

  it("Should not be able to authenticate a user with wrong password", async () => {
    await usersRepository.create({
      name: "test2",
      email: "leoramos2@supertest.com",
      password: await hash("123456", 8)
    });

    const response = await request(app).post("/api/v1/sessions").send({
      email: "leoramos2@supertest.com",
      password: "incorrect",
    });

    expect(response.status).toBe(401);
    expect(response.body).toMatchObject({
      message: "Incorrect email or password"
    });
  })
})
