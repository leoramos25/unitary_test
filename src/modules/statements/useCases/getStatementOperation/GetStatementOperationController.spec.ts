import request from "supertest";
import { app } from "../../../../app";
import { Connection } from "typeorm";
import createConnection from "../../../../database/index";

let connection: Connection;

describe("Get Statement Operation Controller", () => {
  beforeAll(async () => {
    connection =  await createConnection();
    await connection.runMigrations();

    await request(app).post("/api/v1/users").send({
      name: "get statement operation",
      email: "getstatement@supertest.com",
      password: "123456"
    });
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  })

  it("Should be able to get a statement operation", async () => {
    const session = await request(app).post("/api/v1/sessions").send({
      email: "getstatement@supertest.com",
      password: "123456",
    });

    const { token } = session.body;

    const statement = await request(app).post("/api/v1/statements/deposit").send({
      amount: 150.00,
      description: "test deposit"
    }).set({
      Authorization: `Bearer ${token}`
    });

    const { id } = statement.body;

    const statementOperation = await request(app).get(`/api/v1/statements/${id}`).set({
      Authorization: `Bearer ${token}`
    });

    expect(statementOperation.status).toBe(200);
    expect(statementOperation.body).toHaveProperty("user_id");
    expect(statementOperation.body).toHaveProperty("amount");
    expect(statementOperation.body).toHaveProperty("description");
    expect(statementOperation.body).toHaveProperty("type");
  });

  it("Should not be able to get a statement operation if user not exists", async () => {
    const session = await request(app).post("/api/v1/sessions").send({
      email: "incorrect@supertest.com",
      password: "123456",
    });

    const { token } = session.body;

    const statement = await request(app).post("/api/v1/statements/deposit").send({
      amount: 150.00,
      description: "test deposit"
    }).set({
      Authorization: `Bearer ${token}`
    });

    const { id } = statement.body;

    const statementOperation = await request(app).get(`/api/v1/statements/${id}`).set({
      Authorization: `Bearer ${token}`
    });

    expect(statementOperation.status).toBe(401);
  });
})
