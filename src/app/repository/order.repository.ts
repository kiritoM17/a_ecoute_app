import { OrderModel, IOrderModel } from '../model/Order';
import { RepositoryBase } from './base/repository.base';
import { injectable } from "inversify";

@injectable()
export class OrderRepository extends RepositoryBase<IOrderModel>{
    constructor() {
        super(OrderModel)
    }
}