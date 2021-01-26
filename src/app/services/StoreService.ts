import { injectable, inject } from "inversify";
import { TYPES } from "../../config/constant/types";
import { StoreRepository } from '../repository/store.repository';
import { IItemModel } from "../model/Item";

@injectable()
export class StoreService {
  //extends ServiceBase<IUserModel>
  private storeReposetory: StoreRepository;

  public constructor(@inject(TYPES.StoreRepository) reposetory: StoreRepository) {
    this.storeReposetory = reposetory;
  }

  /*getById(id: string): Promise<IItemModel> {
      return this.itemReposetory.findById(id);
  }*/
}
