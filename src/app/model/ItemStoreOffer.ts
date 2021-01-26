import {IItem} from "./Item"
export class ItemStoreOffer {
    public item: IItem | String;
    public price: Number;
    public discount: Number; // скидка магазина после улучшения цены
}