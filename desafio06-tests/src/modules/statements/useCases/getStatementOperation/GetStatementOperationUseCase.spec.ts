import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let fakeUsersRepository: InMemoryUsersRepository;
let fakeStatementsRepository: InMemoryStatementsRepository;
let getStatementOperationUseCase: GetStatementOperationUseCase;
let createStatementUseCase: CreateStatementUseCase;
let createUserUseCase: CreateUserUseCase;

describe("Get statement operation", () => {
  beforeEach(() => {
    fakeStatementsRepository = new InMemoryStatementsRepository();
    fakeUsersRepository = new InMemoryUsersRepository();
    createStatementUseCase = new CreateStatementUseCase(
      fakeUsersRepository,
      fakeStatementsRepository
    );
    createUserUseCase = new CreateUserUseCase(fakeUsersRepository);
    getStatementOperationUseCase = new GetStatementOperationUseCase(
      fakeUsersRepository,
      fakeStatementsRepository
    );
  });

  it("should be able to find a statement operation", async () => {
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

    const statementOperation = await getStatementOperationUseCase.execute({
      user_id: user.id!,
      statement_id: statement.id!,
    });

    expect(statementOperation.user_id).toEqual(user.id);
    expect(statementOperation.id).toEqual(statement.id);
    expect(statementOperation.type).toEqual(statement.type);
  });

  it("should be able to find a statement operation for an inexistent user", async () => {
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

    expect(async () => {
      await getStatementOperationUseCase.execute({
        user_id: "test",
        statement_id: statement.id!,
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
  });

  it("should not be able to find an inexistent statement operation", async () => {
    const user = await createUserUseCase.execute({
      email: "test@email.com",
      name: "test",
      password: "123456",
    });

    expect(async () => {
      await getStatementOperationUseCase.execute({
        user_id: user.id!,
        statement_id: "test",
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
  });
});
