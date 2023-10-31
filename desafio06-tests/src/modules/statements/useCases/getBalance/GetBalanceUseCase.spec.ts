import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetBalanceError } from "./GetBalanceError";

import { GetBalanceUseCase } from "./GetBalanceUseCase";

let fakeUsersRepository: InMemoryUsersRepository;
let fakeStatementsRepository: InMemoryStatementsRepository;
let getBalanceUseCase: GetBalanceUseCase;
let createUserUseCase: CreateUserUseCase;

describe("Get user balance", () => {
  beforeEach(() => {
    fakeStatementsRepository = new InMemoryStatementsRepository();
    fakeUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(fakeUsersRepository);
    getBalanceUseCase = new GetBalanceUseCase(
      fakeStatementsRepository,
      fakeUsersRepository
    );
  });

  it("should be able to get an user balance", async () => {
    const user = await createUserUseCase.execute({
      email: "test@email.com",
      name: "test",
      password: "123456",
    });

    const balance = await getBalanceUseCase.execute({ user_id: user.id! });

    expect(balance.balance).toEqual(0);
  });

  it("should not be able to get an inexistent user balance", async () => {
    expect(async () => {
      await getBalanceUseCase.execute({ user_id: "test" });
    }).rejects.toBeInstanceOf(GetBalanceError);
  });
});
