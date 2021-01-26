import { response, controller, httpGet, httpPost, httpDelete, httpPut, request } from "inversify-express-utils";
import * as express from "express";
import { TYPES } from "../config/constant/types";
import { inject } from "inversify";
import { StoreRepository } from "../app/repository/store.repository";
import { IStoreModel } from "../app/model/Store";
import {Types} from "mongoose";

@controller("/api/v1/store")
export class StoreController {

    private storeRepository: StoreRepository;

    constructor(@inject(TYPES.StoreRepository) repository: StoreRepository) {
        this.storeRepository = repository
    }

    @httpGet("/")
    public async get(@request() req: express.Request, @response() res: express.Response) {
        console.log("Get request of store controller");
        try {
            const itemList = await this.storeRepository.retrieve();
            res.json(itemList);
        } catch (error) {
            res.status(500).send(error.message);
        }
    }

    @httpGet("/:id")
    public async getById(@request() req: express.Request, @response() res: express.Response) {
        console.log("Get request of store controller");
        try {
            const item = await this.storeRepository.findById(req.params.id);
            res.json(item);
        } catch (error) {
            res.status(500).send(error.message);
        }
    }

    @httpPost("/")
    public async post(@request() req: express.Request, @response() res: express.Response) {
        console.log("Post request of store controller");
        try {
            const item = req.body as IStoreModel;
            delete item._id;
            const newItem = await this.storeRepository.create(item);
            res.json(newItem);
        } catch (error) {
            res.status(500).send(error.message);
        }
    }

    @httpPut("/:id")
    public async put(@request() req: express.Request, @response() res: express.Response) {
        console.log("Put request of store controller");
        try {
            for (let i = 0; i < req.body.items.length; i++) {
                req.body.item = Types.ObjectId(req.body.items[i].item as string);
            }
            const item = await this.storeRepository.update(req.params.id, req.body);
            res.json(item);
        } catch (error) {
            res.status(500).send(error.message);
        }
    }

    @httpDelete("/:id")
    public async delete(@request() req: express.Request, @response() res: express.Response) {
        console.log("Delete request of store controller");
        try {
            const item = await this.storeRepository.delete(req.params.id);
            res.json(item);
        } catch (error) {
            res.status(500).send(error.message);
        }
    }

}