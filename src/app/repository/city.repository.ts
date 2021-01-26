import { CityModel, ICityModel } from '../model/City';
import { RepositoryBase } from './base/repository.base';
import { injectable } from "inversify";

//@injectable()
export class CityRepository extends RepositoryBase<ICityModel>{
    constructor() {
        super(CityModel)
    }
}