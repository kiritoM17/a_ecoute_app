import { ITranslate } from "./ITranslate";
import { injectable } from 'inversify';
import {IRegion} from './Region';
import {ICountry} from './Country';
import { Schema, Document, Model, model, SchemaType, SchemaTypes } from "mongoose";
import { Seo } from "./seo";

export interface ICity {
    name: ITranslate;
    description: ITranslate;
    pic: string;
    region: string | IRegion;
    country: string | ICountry;
    inReview: boolean;
    inPopular: boolean;
    itemCount: number;
    averagePrice: number;
    seo: Seo;
}

export interface ICityModel extends ICity, Document {

}

export var CitySchema: Schema = new Schema({
    name: {
        en: String,
        heb: String
    },
    description: {
        en: String,
        heb: String
    },
    region: { type: SchemaTypes.ObjectId, ref: "Region" },
    country: { type: SchemaTypes.ObjectId, ref: "Country" },
    pic: String,
    inReview: Boolean,
    inPopular: Boolean,
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

export const CityModel: Model<ICityModel> = model<ICityModel>("City", CitySchema);