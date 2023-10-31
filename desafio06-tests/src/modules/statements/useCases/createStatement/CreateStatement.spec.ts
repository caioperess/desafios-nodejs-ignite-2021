import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

let fakeUsersRepository: InMemoryUsersRepository;
let fakeStatementsRepository: InMemoryStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;
let createUserUseCase: CreateUserUseCase;

describe("Create statement", () => {
  beforeEach(() => {
    fakeStatementsRepository = new InMemoryStatementsRepository();
    fakeUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(fakeUsersRepository);
    createStatementUseCase = new CreateStatementUseCase(
      fakeUsersRepository,
      fakeStatementsRepository
    );
  });

  it("should be able to create an withdraw statement", async () => {
    const user = await createUserUseCase.execute({
      email: "test@email.com",
      name: "test",
      password: "123456",
    });

    await createStatementUseCase.execute({
      user_id: user.id!,
      amount: 2000,
      description: "Deposit test",
      type: OperationType.DEPOSIT,
    });

    const statement = await createStatementUseCase.execute({
      user_id: user.id!,
      amount: 2000,
      description: "Withdraw test",
      type: OperationType.WITHDRAW,
    });

    expect(statement.user_id).toEqual(user.id);
    expect(statement.amount).toEqual(statement.amount);
  });

  it("should be able to create an deposit statement", async () => {
    const user = await createUserUseCase.execute({
      email: "test@email.com",
      name: "test",
      password: "123456",
    });

    const statement = await createStatementUseCase.execute({
      user_id: user.id!,
      amount: 2000,
      description: "Deposit test",
      type: OperationType.DEPOSIT,
    });

    expect(statement.user_id).toEqual(user.id);
    expect(statement.amount).toEqual(statement.amount);
  });

  it("should not be able to create an withdraw statement if the user balance is less than withdraw amount", async () => {
    const user = await createUserUseCase.execute({
      email: "test@email.com",
      name: "test",
      password: "123456",
    });

    await createStatementUseCase.execute({
      user_id: user.id!,
      amount: 2000,
      description: "Deposit test",
      type: OperationType.DEPOSIT,
    });

    expect(async () => {
      await createStatementUseCase.execute({
        user_id: user.id!,
        amount: 2500,
        description: "Withdraw test",
        type: OperationType.WITHDRAW,
      });
    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
  });
});
