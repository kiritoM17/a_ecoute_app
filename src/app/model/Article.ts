import { ITranslate } from "./ITranslate";
import { Schema, Document, Model, model, SchemaType, SchemaTypes, Types } from "mongoose";
import { Seo } from "./seo";
import { ArticleType } from "./Enum/AritcleType";
import { BindingType } from "./Enum/BindingType";
import { ICity } from "./City";
import { IRegion } from "./Region";

export interface IArticle {
    header: ITranslate;
    slogan: ITranslate;
    shitFromLeft: ITranslate;
    text: ITranslate;
    pic: String;
    showInList: boolean;
    showOnHomePage: boolean;
    articleType: ArticleType;
    binding: {
        bindingType: BindingType,
        object: String | ICity | IRegion;
    };
    seo: Seo;
}

export interface IArticleModel extends IArticle, Document {

}

export var ArticleSchema: Schema = new Schema({
    header: {
        en: String,
        heb: String
    },
    slogan: {
        en: String,
        heb: String
    },
    shitFromLeft: {
        en: String,
        heb: String
    },
    text: {
        en: String,
        heb: String
    },
    pic: String,
    showInList: Boolean,
    showOnHomePage: Boolean,
    articleType: String,
    binding: {
        bindingType: { type: String, enum: ['City', 'Region'] },
        object: { type: SchemaTypes.ObjectId, refPath: 'bindingType' }
    },
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
}, { timestamps: true });

export const ArticleModel: Model<IArticleModel> = model<IArticleModel>("Article", ArticleSchema);
