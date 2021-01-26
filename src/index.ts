import 'reflect-metadata';
import { InversifyExpressServer } from 'inversify-express-utils';
import {CronJob} from 'cron';
import {zooContainer} from "./app/inversify.config";
import { makeLoggerMiddleware } from 'inversify-logger-middleware';
import * as express from 'express';
import './controller/UserController';
import './controller/CountryController';
import './controller/RegionController';
import './controller/CityController';
import './controller/CategoryController';
import './controller/ItemController';
import './controller/FileUploadController';
import './controller/PackageController';
import './controller/StoreController';
import './controller/ContentController';
import './controller/OrderController';
import './controller/ArticleController';
import  dbConnect = require("./config/DataAccess");
import path from "path";
import Middlewares = require("./config/middlewares/MiddlewaresBase");
import {exec} from 'child_process';
dbConnect.connect();

// load everything needed to the Container
let container = zooContainer;

// start the server
let server = new InversifyExpressServer(container);

/*new CronJob("0 3 * * *", function(){
  exec('sudo mongodump --db hashve --out /var/backups/mongobackups/hashve/`date +"%m-%d-%y"`', (error, response) => {
    console.log(response);
  });
  console.log("Job is worked");
}, "", true);*/

server.setConfig((app) => {
  app.use(Middlewares.configuration());
  app.use(express.static(path.join(__dirname, "../public")));
});

let app = server.build();
app.listen(3000);
console.log('Server started on port 3000 :)');

exports = module.exports = app;
