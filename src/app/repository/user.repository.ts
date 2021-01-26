import { UserModel, IUserModel } from '../model/User';
import { RepositoryBase } from './base/repository.base';
import { injectable } from "inversify";

@injectable()
export class UserRepository extends RepositoryBase<IUserModel>{
  constructor() {
    super(UserModel)
  }

  findByEmail(email: string): Promise<IUserModel> {
    return this._model.findOne({ "mail": email });
  }
}