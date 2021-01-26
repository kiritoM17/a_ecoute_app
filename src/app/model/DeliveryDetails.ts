import { DestinationType } from "./Enum/DestinationType";
import { ICity } from "./City";
import { Schema, Document, Model, model, SchemaType, SchemaTypes } from "mongoose";
import { ReceiverInformation } from "./ReceiverInformation";

export interface IDeliveryDetails {
    destinationType: DestinationType;
    date: Date;
    hours: string;
    blessing: string;
    specialRequests: string;
    recipient: ReceiverInformation;
}

export interface IDeliveryDetailsModel extends IDeliveryDetails, Document {

}

export var DeliveryDetailsSchema: Schema = new Schema({
    destinationType: { type: String, enum: ['private', 'office'] },
    date: Date,
    hours: String,
    blessing: String,
    specialRequests: String,
    recipient: {
        fullName: String,
        mobile: String
    },
});

export const DeliveryDetailsModel: Model<IDeliveryDetailsModel> = model<IDeliveryDetailsModel>("DeliveryDetails", DeliveryDetailsSchema);
