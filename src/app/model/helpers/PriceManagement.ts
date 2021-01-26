import { StoreModel } from "../Store";

export class PriceManagement {
    private static priceCIty: any[] = [];
    private static priceIsrael: any[] = [];
    private static _instance: PriceManagement;
    private constructor() {

    }

    public static init(): void {
        PriceManagement.getStorePricesByCity();
    }

    public static getInstance(): PriceManagement {
        if (!PriceManagement._instance) {
            PriceManagement._instance = new PriceManagement();
        }
        return PriceManagement._instance;
    }

    private static async getStorePricesByCity() {
        PriceManagement.priceCIty = await StoreModel.aggregate([
            { $unwind: "$items" },
            { $unwind: "$delivery" },
            {
                $match: {
                    adminActive: true,
                    "items.price": { $gt: 60 }
                }
            },
            { $group: { _id: { "item": "$items.item", city: "$delivery.city" }, offerCount: { $sum: 1 }, minPrice: { $min: "$items.price" }, maxPrice: { $max: "$items.price" } } }
        ]);
        PriceManagement.priceIsrael = await StoreModel.aggregate([
            { $unwind: "$items" },
            { $match: { active: true } },
            { $group: { _id: "$items.item", offerCount: { $sum: 1 }, minPrice: { $min: "$items.price" }, maxPrice: { $max: "$items.price" } } }
        ]);
        console.log(PriceManagement.priceCIty);
    }

    public getPrices(){
        return PriceManagement.priceCIty;
    }

    public getOffers(cityId: string, itemId: string){
        let tmpDate = Date.now();
        console.log("start serching ", tmpDate);
        let val = PriceManagement.priceCIty.find(item => {
            let a = item._id.item.toString() === itemId;
            let b = item._id.city.toString() === cityId;
            return a && b;
        });
        console.log("end serching ", Date.now() - tmpDate);
        return {maxPrice: val.maxPrice, minPrice: val.minPrice, offerCount: val.offerCount, _id: itemId};
    }

    public getAllOffersPrice(itemId: string){
        let tmpDate = Date.now();
        console.log("start serching ", tmpDate);
        let val = PriceManagement.priceIsrael.find(item => {
            let a = item._id.toString() === itemId;
            return a;
        });
        console.log("end serching ", Date.now() - tmpDate);
        return {maxPrice: val?val.maxPrice:-1, minPrice: val?val.minPrice:-1, offerCount: val?val.offerCount:0, _id: itemId};
    }
}