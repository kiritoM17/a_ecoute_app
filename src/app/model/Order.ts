import { Schema, Document, Model, model, SchemaType, SchemaTypes } from "mongoose";
import { IStore } from "./Store";
import { IPackage } from "./Package";
import { ICity } from "./City";
import { IProductOffer } from "./ProductOffer";
import { DiscountType } from "./Enum/DiscountTypeEnum";
import { IDeliveryAddress } from "./DeliveryAddress";
import { DeliveryAddressRepository } from "../repository/delivery.adderess.repository";
import { IDeliveryDetails } from "./DeliveryDetails";
import { PaymentType } from "./Enum/PaymentType";
import { ICustumerDetails } from "./CustomerDitails";

export interface IOrder {
    productOffer: IProductOffer | string;
    price: number;
    deliveryPrice: number;
    deliveryDetails: IDeliveryDetails;
    deliveryAddress: IDeliveryAddress;
    customerDitails: ICustumerDetails;
    paymentType: PaymentType;
    phonePaymentDetails: {
        email: string,
		fullName: string,
		mobile: string,
    };
    status: string;
    typeOfDiscount: DiscountType;
}

export interface IOrderModel extends IOrder, Document {

}

export var OrderSchema: Schema = new Schema({
    productOffer: { type: SchemaTypes.ObjectId, ref: "ProductOffer" },
    typeOfDiscount: { type: String, enum: ['NO', 'DISCOUNT', 'DAILY_DEAL', 'PRICE_IMPROVE', 'PACKAGE'] },
    customerDitails: { type: SchemaTypes.ObjectId, ref: "CustumerDetails" },
    deliveryAddress: { type: SchemaTypes.ObjectId, ref: "DeliveryAddress" },
    deliveryDetails: { type: SchemaTypes.ObjectId, ref: "DeliveryDetails" },
    paymentType: { type: String, enum: [0, 1] },
    phonePaymentDetails: {
        email: String,
		fullName: String,
		mobile: String,
    },
    status: { type: String },
    price: Number,
    deliveryPrice: Number,
}, { timestamps: true });

export const OrderModel: Model<IOrderModel> = model<IOrderModel>("Order", OrderSchema);
