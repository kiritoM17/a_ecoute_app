import { StoreModel, IStoreModel } from '../model/Store';
import { RepositoryBase } from './base/repository.base';
import {Types} from 'mongoose';
import { injectable } from "inversify";

@injectable()
export class StoreRepository extends RepositoryBase<IStoreModel>{
    constructor() {
        super(StoreModel)
    }

    /*public findByStoreId(storeID: string): Promise<IStoreModel>{
        let id = new Types.ObjectId(storeID);
        return this._model.findOne({_id: id});
    }*/
}