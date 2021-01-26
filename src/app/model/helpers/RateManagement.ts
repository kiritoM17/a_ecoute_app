import { RateModel } from "../Rate";
import { StoreModel } from "../Store";
import { Aggregate } from "mongoose";
import { ItemModel } from "../Item";

class RateStatsRepository{
    public _id: string;
    public sumOfRates: number;
    public count: number;
    public rate: number;

    constructor(item: RateStatsRepository){
        this._id = item._id;
        this.sumOfRates = item.sumOfRates;
        this.count = item.count;
        this.rate = item.rate;
    }
}


export class RateManager {
    private static instance: RateManager;
    private static storeRates: RateStatsRepository[] = [];
    private static bouquetRates: RateStatsRepository[] = [];

    private constructor() {
        
    }

    public static init(): void {
        RateManager.getBouquetStats().then(data => {
            data.map(item => new RateStatsRepository(item));
            RateManager.bouquetRates = data;
            console.log("Bouquets stat data reseived");
        })
        RateManager.getStoreStats().then(data => {
            data.map(item => new RateStatsRepository(item));
            RateManager.storeRates = data;
            console.log("Store stat data received");
        })
    }

    public static getInstance(): RateManager{
        if(!RateManager.instance){
            RateManager.instance = new RateManager();
        }

        return RateManager.instance;
    }

    private static getBouquetStats(): Aggregate<RateStatsRepository[]>{
        return RateModel.aggregate([
            { $group: { _id: "$item", sumOfRates: { $sum: "$rate" }, count: { $sum: 1 } } },
            { $project: { sumOfRates: 1, count: 1, rate: { $divide: ["$sumOfRates", "$count"] } } }
        ]);
    }

    private static getStoreStats(): Aggregate<RateStatsRepository[]>{
        return StoreModel.aggregate([
            {
                $unwind: "$rate"
            },
            {
                $lookup: {
                    from: "rates",
                    localField: "rate",
                    foreignField: "_id",
                    as: "f"
                }
            },
            {
                $project: { rate: 0 }
            },
            {
                $replaceRoot: { newRoot: { $mergeObjects: [{ $arrayElemAt: ["$f", 0] }, "$$ROOT"] } }
            },
            {
                $project: { f: 0 }
            },
            {
                $group: { _id: "$_id", sumOfRates: { $sum: "$rate" }, count: { $sum: 1 } }
            },
            {
                $project: { sumOfRates: 1, count: 1, rate: { $divide: ["$sumOfRates", "$count"] } }
            }
        ]);
    }

    public findBouquetRate(_id: string): number {
        const tmp = RateManager.bouquetRates.find((item: any) => item._id.equals(_id));
        if(tmp){
            return +tmp.rate.toFixed(1);
        }else{
            return 0
        }
    }

    public findBouquetReviewCount(_id: string): number {
        const tmp = RateManager.bouquetRates.find((item: any) => item._id.equals(_id));
        if(tmp){
            return +tmp.count.toFixed(1);
        }else{
            return 0
        }
    }

    public findStoreRate(_id: string): number {
        const tmp = RateManager.storeRates.find((item: any) => item._id.equals(_id));
        if(tmp){
            return +tmp.rate.toFixed(1);
        }else{
            return 0
        }
    }

    public findStoreReviewCount(_id: string): number {
        const tmp = RateManager.storeRates.find((item: any) => item._id.equals(_id));
        if(tmp){
            return +tmp.count.toFixed(1);
        }else{
            return 0
        }
    }
}