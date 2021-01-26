import { Schema, Document, Model, model, SchemaType, SchemaTypes } from "mongoose";
import { IStore } from "./Store";
import { IPackage } from "./Package";
import { ICity } from "./City";

export interface IProductOffer {
    store: IStore | String;
    city: ICity | String;
    package: IPackage | String;
    finished: boolean;
    orderNumber: number;
}

export interface IProductOfferModel extends IProductOffer, Document {

}

export var ProductOfferSchema: Schema = new Schema({
    store: { type: SchemaTypes.ObjectId, ref: "Store" },
    city: { type: SchemaTypes.ObjectId, ref: "City" },
    package: { type: SchemaTypes.ObjectId, ref: "Package" },
    finished: { type: Boolean, default: false },
    orderNumber: Number
}, { timestamps: true });

export const ProductOfferModel: Model<IProductOfferModel> = model<IProductOfferModel>("ProductOffer", ProductOfferSchema);
