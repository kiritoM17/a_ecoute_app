import * as bcrypt from "bcrypt-nodejs";
import { injectable, inject } from "inversify";
import { TYPES } from "../../config/constant/types";
import { CityRepository } from "../repository/city.repository";
import { ICity, ICityModel } from "../model/City";

@injectable()
export class CityService {
  //extends ServiceBase<IUserModel>
  private cityReposetory: CityRepository;

  public constructor(@inject(TYPES.CityRepository) reposetory: CityRepository) {
    this.cityReposetory = reposetory;
  }

  getById(id: string): Promise<ICityModel> {
      return this.cityReposetory.findById(id);
  }
}
