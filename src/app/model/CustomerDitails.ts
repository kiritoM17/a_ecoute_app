import { DestinationType } from "./Enum/DestinationType";
import { ICity } from "./City";
import { Schema, Document, Model, model, SchemaType, SchemaTypes } from "mongoose";

export interface ICustumerDetails {
    fullName: string;
    mobile: string;
    email: string;
    invoice: boolean;
    companyName: string;
    address: string;
}

export interface ICustumerDetailsModel extends ICustumerDetails, Document {

}

export var CustumerDetailsSchema: Schema = new Schema({
    fullName: String,
    mobile: String,
    email: String,
    invoice: Boolean,
    companyName: String,
    address: String,
});

export const CustomerDetailsModel: Model<ICustumerDetailsModel> = model<ICustumerDetailsModel>("CustumerDetails", CustumerDetailsSchema);
