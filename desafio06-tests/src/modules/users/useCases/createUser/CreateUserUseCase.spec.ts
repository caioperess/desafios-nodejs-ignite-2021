import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";

let fakeUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Create user", () => {
  beforeEach(() => {
    fakeUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(fakeUsersRepository);
  });

  it("should be able to create a new user", async () => {
    const user = await createUserUseCase.execute({
      email: "test@email.com",
      name: "test",
      password: "123456",
    });

    expect(user).toHaveProperty("id");
  });

  it("should not be able to create a new user with same email", async () => {
    await createUserUseCase.execute({
      email: "test@email.com",
      name: "test",
      password: "123456",
    });

    expect(async () => {
      await createUserUseCase.execute({
        email: "test@email.com",
        name: "test",
        password: "123456",
      });
    }).rejects.toBeInstanceOf(CreateUserError);
  });
});
