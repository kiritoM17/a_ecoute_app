import { IRegion } from "./Region";
import { ITranslate } from "./ITranslate";
import { Schema, Document, Model, model, SchemaType, SchemaTypes } from "mongoose";
import { Seo } from "./seo";

export interface ICountry {
    name: ITranslate;
    regions: Array<string> | Array<IRegion>;
    seo: Seo;
}

export interface ICountryModel extends ICountry, Document {
    
}

export var CountrySchema: Schema = new Schema({
    name: {
        en: String,
        heb: String
    },
    regions: [
        { type: SchemaTypes.ObjectId, ref: "Region" }
    ],
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

export const CountryModel: Model<ICountryModel> = model<ICountryModel>("Country", CountrySchema);