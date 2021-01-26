import { DestinationType } from "./Enum/DestinationType";
import { ICity } from "./City";
import { Schema, Document, Model, model, SchemaType, SchemaTypes } from "mongoose";

export interface IDeliveryAddress {
    destinationType: DestinationType;
    companyName: string;
    city: ICity | string;
    street: string;
    house: string;
    floor: number;
    apartment: number;
    instructions: string;
}

export interface IDeliveryAddressModel extends IDeliveryAddress, Document {

}

export var DeliveryAddressSchema: Schema = new Schema({
    destinationType: { type: String, enum: ['private', 'office'] },
    companyName: String,
    city: { type: SchemaTypes.ObjectId, ref: "City" },
    street: String,
    house: String,
    floor: String,
    apartment: String,
    instructions: String,
});

export const DeliveryAddressModel: Model<IDeliveryAddressModel> = model<IDeliveryAddressModel>("DeliveryAddress", DeliveryAddressSchema);
