import { response, controller, httpGet, httpPost, httpDelete, httpPut, request } from "inversify-express-utils";
import * as express from "express";
import { TYPES } from "../config/constant/types";
import { inject } from "inversify";
import { ItemRepository } from "../app/repository/item.repository";
import { IItemModel } from "../app/model/Item";

@controller("/api/v1/item")
export class ItemController {

    private itemRepository: ItemRepository;

    constructor(@inject(TYPES.ItemRepository) repository: ItemRepository) {
        this.itemRepository = repository
    }

    @httpGet("/")
    public async get(@request() req: express.Request, @response() res: express.Response) {
        console.log("Get request of item controller");
        try {
            const itemList = await this.itemRepository.retrieve();
            res.json(itemList);
        } catch (error) {
            res.status(500).send(error.message);
        }
    }

    @httpGet("/:id")
    public async getById(@request() req: express.Request, @response() res: express.Response) {
        console.log("Get request of item controller");
        try {
            const item = await this.itemRepository.findById(req.params.id);
            res.json(item);
        } catch (error) {
            res.status(500).send(error.message);
        }
    }

    @httpPost("/")
    public async post(@request() req: express.Request, @response() res: express.Response) {
        console.log("Post request of item controller");
        try {
            const item = req.body as IItemModel;
            delete item._id;
            const newItem = await this.itemRepository.create(item);
            res.json(newItem);
        } catch (error) {
            res.status(500).send(error.message);
        }
    }

    @httpPut("/:id")
    public async put(@request() req: express.Request, @response() res: express.Response) {
        console.log("Put request of item controller");
        try {
            const item = await this.itemRepository.update(req.params.id, req.body);
            res.json(item);
        } catch (error) {
            res.status(500).send(error.message);
        }
    }

    @httpDelete("/:id")
    public async delete(@request() req: express.Request, @response() res: express.Response) {
        console.log("Delete request of item controller");
        try {
            const item = await this.itemRepository.delete(req.params.id);
            res.json(item);
        } catch (error) {
            res.status(500).send(error.message);
        }
    }

}