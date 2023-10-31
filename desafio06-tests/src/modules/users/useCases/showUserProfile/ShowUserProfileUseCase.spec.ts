import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let fakeUsersRepository: InMemoryUsersRepository;
let showUserProfileUseCase: ShowUserProfileUseCase;

describe("Show user profile", () => {
  beforeEach(() => {
    fakeUsersRepository = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(fakeUsersRepository);
  });

  it("should be able to show user profile", async () => {
    const user = await fakeUsersRepository.create({
      email: "test@email.com",
      name: "test name",
      password: "123456",
    });

    const profile = await showUserProfileUseCase.execute(user.id!);

    expect(profile?.id).toEqual(user.id);
  });

  it("should not be able to show user profile if user not exists", async () => {
    expect(async () => {
      await showUserProfileUseCase.execute("test");
    }).rejects.toBeInstanceOf(ShowUserProfileError);
  });
});
