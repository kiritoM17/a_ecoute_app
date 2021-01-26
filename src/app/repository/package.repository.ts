import { PackageModel, IPackageModel } from '../model/Package';
import { RepositoryBase } from './base/repository.base';
import { injectable } from "inversify";

@injectable()
export class PackageRepository extends RepositoryBase<IPackageModel>{
    constructor() {
        super(PackageModel)
    }
}