import { Schema, Document, Model, model, SchemaType, SchemaTypes } from "mongoose";
import {IItemModel} from "./Item";
import { ICityModel } from "./City";

export interface IRate{
    fullName: string;
    rate: number;
    feedback: string;
    approved: boolean;
    city: string | ICityModel;
    city_name: string;
    createdAt: Date;
    item: string | IItemModel;
}

export interface IRateModel extends IRate, Document {

}

export var RateSchema: Schema = new Schema({
    fullName: String,
    rate: Number,
    feedback: String,
    approved: Boolean,
    item: { type: SchemaTypes.ObjectId, ref: "Item" },
    city: { type: SchemaTypes.ObjectId, ref: "City" },
    city_name: String
}, { timestamps: true });

export const RateModel: Model<IRateModel> = model<IRateModel>("Rate", RateSchema);