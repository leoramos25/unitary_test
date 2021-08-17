import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let showUserProfileUseCase: ShowUserProfileUseCase;
let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe("Show Profile", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository);
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it("should be able to show the user profile", async () => {
    const user = await createUserUseCase.execute({
      name: "profile test",
      email: "profile@test.com",
      password: "profiletest"
    });

    const result = await showUserProfileUseCase.execute(user.id as string);

    expect(result).toHaveProperty("id");
  })

  it("should not be able to show the user profile it not exists", () => {
    expect(async () => {
      const user = await createUserUseCase.execute({
        name: "profile test",
        email: "profile@test.com",
        password: "profiletest"
      });

      await showUserProfileUseCase.execute("incorrect id");
    }).rejects.toBeInstanceOf(AppError);
  });
});
