import request from "supertest";
import { Connection } from "typeorm";
import { app } from "../../../../app";
import createConnection from "../../../../database/index";

let connection: Connection;

describe("Create Statement Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    await request(app).post("/api/v1/users").send({
      name: "create statement supertest",
      email: "createstatement@supertest.com",
      password: "123456"
    });
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  })

  it("Should be able to create a new deposit statement", async () => {
    const session = await request(app).post("/api/v1/sessions").send({
      email: "createstatement@supertest.com",
      password: "123456"
    });

    const { token } = session.body;

    const deposit = await request(app).post("/api/v1/statements/deposit").send({
      amount: 150.00,
      description: "test deposit"
    }).set({
      Authorization: `Bearer ${token}`
    });

    expect(deposit.status).toBe(201);
  });

  it("Should be able to create a new withdraw", async () => {
    const session = await request(app).post("/api/v1/sessions").send({
      email: "createstatement@supertest.com",
      password: "123456"
    });

    const { token } = session.body;

    const withdraw = await request(app).post("/api/v1/statements/withdraw").send({
      amount: 85.00,
      description: "test withdraw"
    }).set({
      Authorization: `Bearer ${token}`
    });

    expect(withdraw.status).toBe(201);
  });
})
