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
      name: "get balance test",
      email: "getbalance@supertest.com",
      password: "123456"
    });
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  })

  it("Should be able to get balance a user", async () => {
    const session = await request(app).post("/api/v1/sessions").send({
      email: "getbalance@supertest.com",
      password: "123456"
    });

    const { token } = session.body;

    await request(app).post("/api/v1/statements/deposit").send({
      amount: 150.00,
      description: "test deposit"
    }).set({
      Authorization: `Bearer ${token}`
    });

    await request(app).post("/api/v1/statements/withdraw").send({
      amount: 85.00,
      description: "test withdraw"
    }).set({
      Authorization: `Bearer ${token}`
    });

    const balance = await request(app).get("/api/v1/statements/balance").set({
      Authorization: `Bearer ${token}`
    }).send();

    expect(balance.status).toBe(200);
    expect(balance.body).toHaveProperty("balance");
  });
})
