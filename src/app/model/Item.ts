import {IRate} from "./Rate";
import {ITranslate} from "./ITranslate";
import { ICategory } from "./Category";
import { Schema, Document, Model, model, SchemaType, SchemaTypes } from "mongoose";
import { injectable } from "inversify";
import { Seo } from "./seo";

export interface IItem{
    name: ITranslate;
    code: string;
    picture: string;
    description: ITranslate;
    additional: boolean;
    rate: Array<IRate> | Array<string>;
    category: Array<ICategory>;
    dayDeal: boolean;
    recommended: boolean;
    price: number; // цена на товар если диль йоми истина
    reviewsCount: number;
    rating: number;
    seo: Seo;
    minPrice: number;
    maxPrice: number;
    offerCount: number;
}

export interface IItemModel extends IItem, Document {
    
}

export var ItemSchema: Schema = new Schema({
    name: {
        en: String,
        heb: String
    },
    code: String,
    picture: String,
    description: {
        en: String,
        heb: String
    },
    additional: Boolean,
    recommended: Boolean,
    rate: [
        { type: SchemaTypes.ObjectId, ref: "Rate" }
    ],
    category: [{ type: SchemaTypes.ObjectId, ref: "Category" }],
    dayDeal: Boolean, 
    price: Number,
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

export const ItemModel: Model<IItemModel> = model<IItemModel>("Item", ItemSchema);
