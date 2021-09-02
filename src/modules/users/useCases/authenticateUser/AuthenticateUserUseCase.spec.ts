import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;

describe("Authenticate User", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it("should be able to authentica a user", async () => {
    const user: ICreateUserDTO = {
      name: "authtest",
      email: "authtest@test.com",
      password: "authtestpass"
    }

    await createUserUseCase.execute(user);

    const authenticated = await authenticateUserUseCase.execute({
      email: user.email,
      password: "authtestpass",
    })

    expect(authenticated).toHaveProperty("token");
  });

  it("should not be able to authenticate user with incorrect password", () => {
    expect(async () => {
      const user = await createUserUseCase.execute({
        name: "authtest",
        email: "authtest@test.com",
        password: "authtestpass"
      })

      await authenticateUserUseCase.execute({
        email: user.email,
        password: "incorrect password",
      })
    }).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to authenticate user with incorrect email", () => {
    expect(async () => {
      const user = await createUserUseCase.execute({
        name: "authtest",
        email: "authtest@test.com",
        password: "authtestpass"
      });

      await authenticateUserUseCase.execute({
        email: "incorrect email",
        password: "authtestpass",
      })
    }).rejects.toBeInstanceOf(AppError);
  });
})
