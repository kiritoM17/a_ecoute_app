import passportJWT from "passport-jwt";
import passportFacebook from "passport-facebook-token";
let passportGoogle = require("passport-google-token").Strategy;
import { Constants } from "./Constants";
import { IUserModel } from "../../app/model/User";
// import { UserService } from '../service/UserService';
import { UserRepository } from "../../app/repository/user.repository";
import { UserProvider } from "../../app/model/Enum/UserProvider";
// import IRepository = require('../app/repository/interfaces/IUserRepository');

const LocalStrategy = passportJWT.Strategy;
const ExtractJwt = passportJWT.ExtractJwt;

const params: passportJWT.StrategyOptions = {
  secretOrKey: Constants.JWT_SECRET,
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("jwt")
};

export = function getPassport(passport: any) {
  passport.use(
    new LocalStrategy(params, (jwt_payload, done) => {
      let repository: UserRepository = new UserRepository();
      repository
        .findById(jwt_payload._id)
        .then((user: IUserModel) => {
          if (jwt_payload) {
            done(null, jwt_payload);
          }
        })
        .catch((err: any) => {
          done(null, false);
        });
    })
  );

  passport.use(
    new passportFacebook({
      clientID: Constants.FACEBOOK.APP_ID,
      clientSecret: Constants.FACEBOOK.APP_SECRET
    }, async (accessToken, refreshToken, profile, done) => {
      console.log(accessToken);
      console.log(refreshToken);
      console.log(profile);
      try{
        let userRepo = new UserRepository();
        let user = await userRepo.findByEmail(profile.emails[0].value);
        if (!user) {
          let userTmp = await userRepo.create({
            fullName: profile.displayName,
            mail: profile.emails[0].value,
            provider: UserProvider.Facebook,
            pic: profile.photos?profile.photos[0].value:"",
            providerData: {
              providerID: profile.id,
              providerToken1: accessToken,
              providerToken2: refreshToken,
            },
            password: profile.id
          } as IUserModel);
          done(null, userTmp);
        } else {
          if (user.provider === UserProvider.Google) {
            throw new Error("messages.registeredWithGoogleProvider");
          } else if (user.provider === UserProvider.Local) {
            throw new Error("messages.registeredWithLocalProvider");
          } else if (user.provider === UserProvider.Facebook) {
            done(null, user);
          }
          throw new Error("messages.unautoraized");
        }
      }catch(error){
        done(error, null);
      }
    })
  );

  passport.use(
    new passportGoogle({
      clientID: Constants.GOOGLE.APP_ID
    }, async (accessToken: any, refreshToken: any, profile: any, done: any) => {
      console.log(accessToken);
      console.log(refreshToken);
      console.log(profile);
      try{
        let userRepo = new UserRepository();
        let user = await userRepo.findByEmail(profile.emails[0].value);
        if (!user) {
          let userTmp = await userRepo.create({
            fullName: profile.displayName,
            mail: profile.emails[0].value,
            provider: UserProvider.Google,
            pic: profile.photos?profile.photos[0].value:"",
            providerData: {
              providerID: profile.id,
              providerToken1: accessToken,
              providerToken2: refreshToken,
            },
            password: profile.id
          } as IUserModel);
          done(null, userTmp);
        } else {
          if (user.provider === UserProvider.Facebook) {
            throw new Error("messages.registeredWithFacebookProvider");
          } else if (user.provider === UserProvider.Local) {
            throw new Error("messages.registeredWithLocalProvider");
          } else if (user.provider === UserProvider.Google) {
            done(null, user);
          }
          throw new Error("messages.unautoraized");
        }
      }catch(error){
        done(error, null);
      }
      
    })
  );
};
