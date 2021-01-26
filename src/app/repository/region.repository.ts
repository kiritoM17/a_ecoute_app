import { RegionModel, IRegionModel } from '../model/Region';
import { RepositoryBase } from './base/repository.base';
import {Types} from 'mongoose';
import { injectable } from "inversify";

@injectable()
export class RegionRepository extends RepositoryBase<IRegionModel>{
    constructor() {
        super(RegionModel)
    }

    public findByCityId(cityID: string): Promise<IRegionModel>{
        let id = new Types.ObjectId(cityID);
        return this._model.findOne({cities: id});
    }
}