import { UserType } from "./Enum/UserType";
import {IDeliveryAddress} from "./DeliveryAddress";
import {IStore} from "./Store";
import * as bcrypt from "bcrypt-nodejs";
import { Schema, SchemaTypes, Document, Model, model } from "mongoose";
import { UserProvider } from "./Enum/UserProvider";

export interface IUser {
  fullName: string;
  mobile: string;
  mail: string;
  password: string;
  pic: string;
  country: string;
  birthday: Date;
  sms: boolean;
  userType: UserType;
  active: boolean;
  token: String;
  socialToken: String;
  deliveryAddress: Array<IDeliveryAddress>;
  stores: Array<string> | Array<IStore>,
  changePassword: {
    token: String,
    creationDate: Date
  };
  provider: UserProvider;
  providerData: {
    providerID: string,
    providerToken1: string,
    providerToken2: string,
  };
  lastLogin: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserModel extends IUser, Document {
  /*gToken: string;*/
  hashPassword(password: string, salt: string): string;
  comparePassword(password: string, hash: string): Promise<boolean>;
}

export var UserSchema: Schema = new Schema(
  {
    fullName: { type: String },
    mobile: { type: String, default: null },
    mail: {
      type: String, required: true, unique: true, validate:
      {
        validator: function (val: string) {
          return isMail(val);
        }, 
        message: (props: any) => `{props.value} is not a valid email`
      }
    },
    password: { type: String, required: true, uniq: true },
    pic: { type: String, default: "" },
    country: String,
    birthday: Date,
    userType: { type: String, default: UserType.user, enum: ["Admin", "StoreAdmin", "User"] },
    active: { type: Boolean, required: true, default: false },
    provider: { type: String, enum: ["LOCAL", "facebook", "google"], default: "LOCAL" },
    providerData: {
      providerID: String,
      providerToken1: String,
      providerToken2: String,
    },
    token: String,
    deliveryAddress: [
      { type: SchemaTypes.ObjectId, ref: "DeliveryAddress" }
    ],
    changePassword: {
      token: String,
      creationDate: Date
    },
    stores: [{type: SchemaTypes.ObjectId, ref: "Store"}],
    lastLogin: Date,
  },
  {
    timestamps: true
  }
);

UserSchema.methods.comparePassword = (password: string, hash: string): Promise<boolean> => {
  let p: Promise<boolean> = new Promise<boolean>((resolve, reject) => {
    bcrypt.compare(password, hash, (err, isMatch) => {
      if (err) {
        reject(err);
      }
      resolve(isMatch);
    });
  });
  return p;
};

UserSchema.pre("save", function(next) {
  if (this.isModified("password")) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(
        (<IUserModel>this).password,
        salt,
        () => {},
        (err, hashedPassword) => {
          if (err) {
            throw err;
          }
          (<IUserModel>this).password = hashedPassword;
          next();
        }
      );
    });
  }
});

export const UserModel: Model<IUserModel> = model<IUserModel>("User", UserSchema);

function isMail(value: string): boolean {
  var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
  return emailRegex.test(value);
}