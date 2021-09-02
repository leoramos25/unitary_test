import request from "supertest";
import { Connection } from "typeorm";
import { app } from "../../../../app";

import createConnection from "../../../../database";

let connection: Connection;

describe("Show User Profile Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    await request(app).post("/api/v1/users").send({
      name: "LeonardoTestShowProfile",
      email: "testshowprofile@email.com",
      password: "123456",
    })
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("Should be able to show profile a user", async () => {
    const session = await request(app).post("/api/v1/sessions").send({
      email: "testshowprofile@email.com",
      password: "123456"
    })

    const { token } = session.body;

    const response = await request(app).get("/api/v1/profile").send({
      email: "testshowprofile@email.com",
      password: "123456"
    }).
    set({Authorization: `Bearer ${token}`});

    expect(response.status).toBe(200);
  });

  it("Should not be able to show profile a user if incorrect password", async () => {
    const session = await request(app).post("/api/v1/sessions").send({
      email: "testshowprofile@email.com",
      password: "incorrect"
    })

    const { token } = session.body;

    const response = await request(app).get("/api/v1/profile").send({
      email: "testshowprofile@email.com",
      password: "incorrect"
    }).
    set({Authorization: `Bearer ${token}`});

    expect(response.status).toBe(401);
  });

  it("Should not be able to show profile a user if incorrect email", async () => {
    const session = await request(app).post("/api/v1/sessions").send({
      email: "faketestshowprofile@email.com",
      password: "123456"
    })

    const { token } = session.body;

    const response = await request(app).get("/api/v1/profile").send({
      email: "faketestshowprofile@email.com",
      password: "123456"
    }).
    set({Authorization: `Bearer ${token}`});

    expect(response.status).toBe(401);
  });
})
