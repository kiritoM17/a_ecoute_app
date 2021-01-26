import { CountryModel, ICountryModel } from '../model/Country';
import { RepositoryBase } from './base/repository.base';
import { injectable } from "inversify";

@injectable()
export class CountryRepository extends RepositoryBase<ICountryModel>{
    constructor() {
        super(CountryModel)
    }
}