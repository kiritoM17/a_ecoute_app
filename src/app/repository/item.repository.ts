import { ItemModel, IItemModel } from '../model/Item';
import { RepositoryBase } from './base/repository.base';
import { injectable } from "inversify";

@injectable()
export class ItemRepository extends RepositoryBase<IItemModel>{
    constructor() {
        super(ItemModel)
    }
}