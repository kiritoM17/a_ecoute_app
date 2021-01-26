import * as bcrypt from "bcrypt-nodejs";
import { injectable, inject } from "inversify";
import { TYPES } from "../../config/constant/types";
import { UserRepository } from "../repository/user.repository";

@injectable()
export class UserService {
  //extends ServiceBase<IUserModel>
  private userReposetory: UserRepository;

  public constructor(@inject(TYPES.UserRepository) reposetory: UserRepository){
    this.userReposetory = reposetory;
  }

  public hashPass(password: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      bcrypt.genSalt(10, (err: any, salt: string) => {
        bcrypt.hash(password, salt, () => {}, (err, hashedPassword) => {
            if (err) {
              reject(err);
            }
            resolve(hashedPassword);
        });
      });
    });
  }
}
