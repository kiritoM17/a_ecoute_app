import { Schema, Document, Model, model, SchemaType, SchemaTypes } from "mongoose";
import { PaymentType } from "./Enum/PaymentType";
import { DeliveryType } from "./Enum/DeliveryType";
import { IRate } from "./Rate";
import { ICity } from "./City";
import { IItem } from "./Item";
import { IPackage } from "./Package";
import { Location } from "./Location";
import { WorkingHours } from "./WorkingHours";
import { ITranslate } from "./ITranslate";
import { ItemStoreOffer } from "./ItemStoreOffer";
import { PackageStoreOffer } from "./PackageStoreOffer";
import { Delivery } from "./Delivery";
import { Seo } from "./seo";

export interface IStore {
    name: ITranslate;
    pic: Array<String>;
    city: ICity | String;
    address: ITranslate;
    tel: String;
    fax: String;
    mobile: String;
    mail: String;
    description: ITranslate;
    //что это такое
    adminActive: Boolean;
    active: Boolean;
    //????
    message: String;
    adminMessage: String;
    payments: Array<PaymentType>;
    deliveryTypes: Array<DeliveryType>;
    items: Array<ItemStoreOffer>;
    delivery: Array<Delivery>;
    // deliveryPlaces: Array<Delivery>;
    packages: Array<PackageStoreOffer>;
    storeLocation: Location;
    rate: Array<IRate>;
    weekHours: WorkingHours;
    weekEndHours: WorkingHours;
    shabatHours: WorkingHours;
    seo: Seo;
    link: string;
    ind: number;
    toHomePage: boolean;
    reviewsCount: number;
    rating: number;
}

export interface IStoreModel extends IStore, Document {

}

export var StoreSchema: Schema = new Schema({
    name: {
        en: String,
        heb: String
    },
    pic: [String],
    city: { type: SchemaTypes.ObjectId, ref: "City" },
    address: {
        en: String,
        heb: String
    },
    tel: String,
    fax: String,
    mobile: String,
    mail: String,
    description: {
        en: String,
        heb: String
    },
    adminActive: Boolean,
    active: Boolean,
    message: String,
    adminMessage: String,
    payments: [{ type: String, default: PaymentType.phone, enum: [0, 1] }],
    deliveryTypes: [{ type: String, default: DeliveryType.delivery, enum: [0, 1, 2] }],
    items: [
        {
            item: { type: SchemaTypes.ObjectId, ref: "Item" },
            price: Number,
            discount: Number
        }
    ],
    delivery: [{
        city: { type: SchemaTypes.ObjectId, ref: "City" },
        price: Number,
    }],
    packages: {
        package: { type: SchemaTypes.ObjectId, ref: "Package" },
        price: Number
    },
    storeLocation: {
        lat: Number,
        lng: Number
    },
    rate: [
        { type: SchemaTypes.ObjectId, ref: "Rate" }
    ],
    weekHours: {
        active: Boolean,
        open: {
            hour: Number,
            minute: Number
        },
        close: {
            hour: Number,
            minute: Number
        },
    },
    weekEndHours: {
        active: Boolean,
        open: {
            hour: Number,
            minute: Number
        },
        close: {
            hour: Number,
            minute: Number
        },
    },
    shabatHours: {
        active: Boolean,
        open: {
            hour: Number,
            minute: Number
        },
        close: {
            hour: Number,
            minute: Number
        },
    },
    link: String,
    ind: Number,
    toHomePage: Boolean,
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

export const StoreModel: Model<IStoreModel> = model<IStoreModel>("Store", StoreSchema);

//export const StoreModel = new Store().setModelForClass(Store);