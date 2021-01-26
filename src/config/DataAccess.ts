import Mongoose from "mongoose";
(<any>Mongoose).Promise = require("bluebird");
import { Constants } from "./constant/Constants";
import {RateManager} from '../app/model/helpers/RateManagement';
import { PriceManagement } from "../app/model/helpers/PriceManagement";

class DataAccess {
  static _mongooseInstance: any;

  constructor() {

  }

  static connect(): Promise<Mongoose.Connection> {
    if (DataAccess._mongooseInstance) {
      return DataAccess._mongooseInstance;
    }
    return new Promise<Mongoose.Connection>((resolve: any, reject: any) => {
      let interval = setInterval(
        function () {
          DataAccess._mongooseInstance = Mongoose.connect(Constants.DB_CONNECTION_STRING, Constants.option, error => {
            if (error) {
              console.log("App not connected tothe moongodb. Will try again after 3 seconds");
            } else {
              clearInterval(interval);
              resolve(DataAccess._mongooseInstance);
              console.log("Connected to the database");
            /*  RateManager.init();
              PriceManagement.init();*/
            }
          });
        }, 3000);
    });
  }
}

export = DataAccess;
