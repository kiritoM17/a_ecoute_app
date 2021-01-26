import express from 'express';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import cors from 'cors';
import path from 'path';
import morgan from 'morgan';
import passport from 'passport';
import fileupload = require('express-fileupload');
//import BaseRoutes = require("../../routes/base/BaseRoute"); 
import passportConfig = require('../constant/passport');

class MiddlewaresBase {
    static configuration(){
        var app = express();
        //passportConfig(passport);
        //app.use(passport.initialize());
        //app.use(passport.session());
     /*   app.use((req, res, next) => {
            (req as any).passport = passport;
            next();
        });*/
        app.use(cors({origin: "*", optionsSuccessStatus: 200}));
        app.use(helmet());
        app.use(morgan('dev'));
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({extended: true}));
        app.use(fileupload());
        app.use(express.static(path.join(__dirname, "../../public")));
        // app.use(new BaseRoutes(passport).routes);
        return app;
    }
}

Object.seal(MiddlewaresBase);
export = MiddlewaresBase;
