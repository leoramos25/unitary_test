import request from "supertest";
import { Connection } from "typeorm";
import { app } from "../../../../app";

import createConnection from "../../../../database";

let connection: Connection;

describe("Create User Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async ()=> {
    await connection.dropDatabase();
    await connection.close();
  });

  it("Should be able to create a new User", async () => {
    const response = await request(app).post('/api/v1/users').expect(201).send({
      name: "Create User Supertest",
      email: "leoramos@supertest.com",
      password: "123testando",
    });

    expect(response.status).toBe(201);
  });

  it("Should not be able to create a new user with existing email", async () => {
    const response = await request(app).post('/api/v1/users').send({
      name: "Create User2 Supertest",
      email: "leoramos@supertest.com",
      password: "123testando2",
    });

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({
      message: "User already exists"
     });
  });
});



