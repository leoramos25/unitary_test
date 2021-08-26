import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "./CreateStatementUseCase";
import { OperationType } from "../../entities/Statement";
import { AppError } from "../../../../shared/errors/AppError";

let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;

describe("Create Statement", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository()
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
  });

  it("Should be able to create a new statement for user", async () => {
    const user = await createUserUseCase.execute({
      name: "create statement test",
      email: "statement@test.com.br",
      password: "123456",
    })

    const statement = await createStatementUseCase.execute({
      user_id: user.id as string,
      type: OperationType.DEPOSIT,
      amount: 100.00,
      description: "test create statement"
    })

    expect(statement).toHaveProperty("id");
  });

  it("Should not be able create a statement with user not exists", () => {
    expect(async () => {
      const user = await createUserUseCase.execute({
        name: "create statement test",
        email: "statement@test.com.br",
        password: "123456",
      });

      await createStatementUseCase.execute({
        user_id: "Incorrect id",
        type: OperationType.DEPOSIT,
        amount: 100.00,
        description: "test create statement"
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});
