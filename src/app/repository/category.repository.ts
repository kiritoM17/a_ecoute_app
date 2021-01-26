import { CategoryModel, ICategoryModel } from '../model/Category';
import { RepositoryBase } from './base/repository.base';
import { injectable } from "inversify";

@injectable()
export class CategoryRepository extends RepositoryBase<ICategoryModel>{
    constructor() {
        super(CategoryModel)
    }
}