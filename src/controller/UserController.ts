import { response, controller, httpGet, httpPost, httpDelete, httpPut, request } from "inversify-express-utils";
import * as express from "express";
import jwt = require("jsonwebtoken");
import {Constants} from "../config/constant/Constants";
import { TYPES } from "../config/constant/types";
import { inject } from "inversify";
import { UserRepository } from "../app/repository/user.repository";
import { UserService } from "../app/services/UserService";
import { IUser, IUserModel } from "../app/model/User";
import passport from 'passport';
import { delimiter } from "path";

@controller("/api/v1/user")
export class UserController {

    private userRepository: UserRepository;
    private userService: UserService;
    private passport: any;

    constructor(@inject(TYPES.UserRepository) repository: UserRepository, @inject(TYPES.UserService) service: UserService) {
        this.userRepository = repository
        this.userService = service;
        this.passport = passport;
    }

    @httpGet("/")//, passport.authenticate('jwt', {session: false}))
    public async get(@request() req: express.Request, @response() res: express.Response) {
        console.log("Get request of user controller");
        try {
            const userList = await this.userRepository.retrieve();
            res.json(userList);
        } catch (error) {
            res.status(500).send(error.message);
        }
    }

    @httpGet("/:id")
    public async getById(@request() req: express.Request, @response() res: express.Response) {
        console.log("Get request of user controller");
        try {
            const userList = await this.userRepository.findById(req.params.id);
            res.json(userList);
        } catch (error) {
            res.status(500).send(error.message);
        }
    }

    @httpPost("/")
    public async post(@request() req: express.Request, @response() res: express.Response) {
        console.log("Post request of user controller");
        try {
            const userData = req.body as IUserModel;
            delete userData._id;
            userData.pic = "";
            userData.password = await this.userService.hashPass(userData.password);
            const user = await this.userRepository.create(userData);
            res.json(user);
        } catch (error) {
            res.status(500).send(error.message);
        }
    }

    @httpPost("/login")
    public async login(@request() req: express.Request, @response() res: express.Response) {
        console.log("Post request of user controller");
        try {
            const email: string = req.body.mail;
            const password: string = req.body.password;
            const user = await this.userRepository.findByEmail(email);
              if (!user) {
                throw new Error("User not found");
              }
            const isMatch = await user.comparePassword(password, user.password);
              if (isMatch) {
                user.password = "";
                let token = jwt.sign(user.toObject(), Constants.JWT_SECRET, { expiresIn: Constants.JWT_EXPAIRE_TIME });
                res.json({token: "JWT " + token, user: user});
              } else {
                return { success: false, info: "Password does not match" };
              }
        } catch (error) {
            res.status(500).send(error.message);
        }
    }

    @httpPut("/:id")
    public async put(@request() req: express.Request, @response() res: express.Response) {
        console.log("Put request of user controller");
        try {
            const userData = req.body as IUserModel;
            delete userData._id;
            delete userData.password;
            userData.pic = "";
            const user = await this.userRepository.update(req.params.id, userData);
            res.json(user);
        } catch (error) {
            res.status(500).send(error.message);
        }
    }

    @httpDelete("/:id")
    public async delete(@request() req: express.Request, @response() res: express.Response) {
        console.log("Delete request of user controller");
        try {
            const user = await this.userRepository.delete(req.params.id);
            res.json(user);
        } catch (error) {
            res.status(500).send(error.message);
        }
    }

}