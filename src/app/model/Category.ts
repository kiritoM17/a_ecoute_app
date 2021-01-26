import { IItem } from "./Item";
import { ITranslate } from "./ITranslate";
import { injectable } from 'inversify';
import { Schema, Document, Model, model, SchemaType, SchemaTypes } from "mongoose";
import { Seo } from "./seo";

export interface ICategory {
    name: ITranslate;
    tagline: ITranslate;
    pic: string;
    description: ITranslate;
    renderOnHomePage: boolean;
    toTopMenu: boolean;
    toFooterMenu: boolean;
    count: number;
    avgPrice: number;
    subcategory: Array<ICategory> | Array<string>;
    items: Array<IItem>;
    seo: Seo;
}

export interface ICategoryModel extends ICategory, Document {

}

export var CategorySchema: Schema = new Schema({
    name: {
        en: String,
        heb: String
    },
    tagline: {
        en: String,
        heb: String
    },
    pic: String,
    toTopMenu: Boolean,
    toFooterMenu: Boolean,
    subcategory: [{ type: SchemaTypes.ObjectId, ref: "Category" }],
    description: {
        en: String,
        heb: String
    },
    count: Number,
    avgPrice: Number,
    renderOnHomePage: Boolean,
    items: [
        { type: SchemaTypes.ObjectId, ref: "Item" }
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

export const CategoryModel: Model<ICategoryModel> = model<ICategoryModel>("Category", CategorySchema);
