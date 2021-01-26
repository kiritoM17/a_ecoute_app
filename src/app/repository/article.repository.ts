import { ArticleModel, IArticleModel } from '../model/Article';
import { RepositoryBase } from './base/repository.base';
import { injectable } from "inversify";

@injectable()
export class ArticleRepository extends RepositoryBase<IArticleModel>{
    constructor() {
        super(ArticleModel)
    }
}