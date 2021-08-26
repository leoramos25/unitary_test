import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

import { OperationType } from "../../entities/Statement";
import { AppError } from "../../../../shared/errors/AppError";

let getStatementOperationUseCase: GetStatementOperationUseCase;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;

describe("Get Statement Operation", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
    getStatementOperationUseCase = new GetStatementOperationUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
  });

  it("Should be able a get statement operation", async () => {
    const user = await createUserUseCase.execute({
      name: "test get statement operation",
      email: "test@teststatementoperation.com",
      password: "testoperation",
    });

    const statement = await createStatementUseCase.execute({
      user_id: user.id as string,
      type: OperationType.DEPOSIT,
      amount: 520.00,
      description: "statement operation test",
    });

    const statementOperation = await getStatementOperationUseCase.execute({
      user_id: user.id as string,
      statement_id: statement.id as string,
    });

    console.log(statementOperation);

    expect(statementOperation).toHaveProperty("id");
    expect(statementOperation).toHaveProperty("user_id");
  });

  it("Should not be able a get statement operation if user does not exists", () => {
    expect(async () => {
      const user = await createUserUseCase.execute({
        name: "test get statement operation",
        email: "test@teststatementoperation.com",
        password: "testoperation",
      });

      const statement = await createStatementUseCase.execute({
        user_id: user.id as string,
        type: OperationType.DEPOSIT,
        amount: 520.00,
        description: "statement operation test",
      });

      await getStatementOperationUseCase.execute({
        user_id: "Incorrect id",
        statement_id: statement.id as string,
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("Should not be able a get balance with non exists statement operation", () => {
    expect(async () => {
      const user = await createUserUseCase.execute({
        name: "test get statement operation",
        email: "test@teststatementoperation.com",
        password: "testoperation",
      });

      await createStatementUseCase.execute({
        user_id: user.id as string,
        type: OperationType.DEPOSIT,
        amount: 520.00,
        description: "statement operation test",
      });

      await getStatementOperationUseCase.execute({
        user_id: "incorrect id",
        statement_id: "incorret statement id"
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});
