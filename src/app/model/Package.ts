import { IItem } from "./Item";
import { ItemSize } from "./Enum/ItemSize";
import { Schema, Document, Model, model, SchemaType, SchemaTypes } from "mongoose";
import { ITranslate } from "./ITranslate";

export interface IPackage {
    name: ITranslate;
    color: string;
    baseItem: IItem;
    size: ItemSize;
    addItems: Array<IItem>;
    price: number;
    tmp: boolean;
}

export interface IPackageModel extends IPackage, Document {
    
}

export var PackageSchema: Schema = new Schema({
    name: {
        en: String,
        heb: String
    },
    color: String,
    baseItem: { type: SchemaTypes.ObjectId, ref: "Item" },
    size: {type: Number, default: ItemSize.normal, enum: [0, 40, 80]},
    addItems: [
        { type: SchemaTypes.ObjectId, ref: "Item" }
    ],
    price: Number,
    tmp: Boolean
});

export const PackageModel: Model<IPackageModel> = model<IPackageModel>("Package", PackageSchema);
