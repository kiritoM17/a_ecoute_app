import { injectable, inject } from "inversify";
import { TYPES } from "../../config/constant/types";
import { ItemRepository } from "../repository/item.repository";
import { IItemModel } from "../model/Item";

@injectable()
export class ItemService {
  //extends ServiceBase<IUserModel>
  private itemReposetory: ItemRepository;

  public constructor(@inject(TYPES.ItemRepository) reposetory: ItemRepository) {
    this.itemReposetory = reposetory;
  }

  getById(id: string): Promise<IItemModel> {
      return this.itemReposetory.findById(id);
  }
}
