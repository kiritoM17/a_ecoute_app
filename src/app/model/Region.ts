import { IRegion } from "./Region";
import { Schema, Document, Model, model, SchemaType, SchemaTypes } from "mongoose";
import { Translate } from "./Translate";
import { Seo } from "./seo";

export interface IRegionModel extends IRegion, Document {

}

export interface IRegion {
    name: Translate;
    country: any;
    cities: Array<any>;
    pic: string;
    itemCount: number;
    averagePrice: number;
    seo: Seo;
}

export var RegionSchema: Schema = new Schema({
    name: {
        en: String,
        heb: String
    },
    cities: [
        { type: SchemaTypes.ObjectId, ref: "City" }
    ],
    country: { type: SchemaTypes.ObjectId, ref: "Country" },
    pic: String,
    itemCount: Number,
    averagePrice: Number,
    seo: {
        h1: {
            en: String,
            heb: String
        },
        title: {
            en: String,
            heb: String,
        },
        keywords: {
            en: String,
            heb: String
        },
        description: {
            en: String,
            heb: String
        }
    }
});

export const RegionModel: Model<IRegionModel> = model<IRegionModel>("Region", RegionSchema);
