import { DeliveryAddressModel, IDeliveryAddressModel } from '../model/DeliveryAddress';
import { RepositoryBase } from './base/repository.base';
import { injectable } from "inversify";

@injectable()
export class DeliveryAddressRepository extends RepositoryBase<IDeliveryAddressModel>{
    constructor() {
        super(DeliveryAddressModel)
    }
}