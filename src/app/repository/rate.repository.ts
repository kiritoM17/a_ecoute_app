import { RateModel, IRateModel } from '../model/Rate';
import { RepositoryBase } from './base/repository.base';
import { injectable } from "inversify";

@injectable()
export class RateRepository extends RepositoryBase<IRateModel>{
    constructor() {
        super(RateModel)
    }
}