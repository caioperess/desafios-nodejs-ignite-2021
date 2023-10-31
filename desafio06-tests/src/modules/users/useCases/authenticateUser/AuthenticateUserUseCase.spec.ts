import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let fakeUsersRepository: InMemoryUsersRepository;
let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;

describe("Authenticate user", () => {
  beforeEach(() => {
    fakeUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(fakeUsersRepository);
    authenticateUserUseCase = new AuthenticateUserUseCase(fakeUsersRepository);
  });

  it("should be able to create a new session for an existent user", async () => {
    const user = {
      email: "test@email.com",
      name: "test",
      password: "123456",
    };

    await createUserUseCase.execute(user);

    const session = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password,
    });

    expect(session).toHaveProperty("token");
    expect(session.user.name).toEqual(user.name);
  });

  it("should not be able to create a new session for an inexistent user", async () => {
    expect(async () => {
      await authenticateUserUseCase.execute({
        email: "test@email.com",
        password: "123456",
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });

  it("should not be able to create a new session for an incorrect password", async () => {
    const user = {
      email: "test@email.com",
      name: "test",
      password: "123456",
    };

    await createUserUseCase.execute(user);

    expect(async () => {
      await authenticateUserUseCase.execute({
        email: user.email,
        password: "123",
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });
});
