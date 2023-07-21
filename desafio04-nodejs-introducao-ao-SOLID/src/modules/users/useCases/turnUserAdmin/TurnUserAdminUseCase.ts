import { User } from "../../model/User";
import { IUsersRepository } from "../../repositories/IUsersRepository";

interface IRequest {
  user_id: string;
}

class TurnUserAdminUseCase {
  constructor(private usersRepository: IUsersRepository) {}

  execute({ user_id }: IRequest): User {
    let user = this.usersRepository.findById(user_id);

    if (!user) {
      throw new Error("User doesnt exists!");
    }

    user = this.usersRepository.turnAdmin(user);

    return user;
  }
}

export { TurnUserAdminUseCase };
