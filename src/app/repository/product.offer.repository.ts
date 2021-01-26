import { ProductOfferModel, IProductOfferModel } from '../model/ProductOffer';
import { RepositoryBase } from './base/repository.base';
import { injectable } from "inversify";

@injectable()
export class ProductOfferRepository extends RepositoryBase<IProductOfferModel>{
    constructor() {
        super(ProductOfferModel)
    }
}