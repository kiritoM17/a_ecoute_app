import { response, controller, httpGet, httpPost, httpDelete, httpPut, request } from "inversify-express-utils";
import {Types} from "mongoose";
import express from "express";
import { TYPES } from "../config/constant/types";
import { inject } from "inversify";
import { CategoryRepository } from "../app/repository/category.repository";
import { ICategoryModel } from "../app/model/Category";

@controller("/api/v1/category")
export class CategoryController {

    private categoryRepository: CategoryRepository;

    constructor(@inject(TYPES.CategoryRepository) repository: CategoryRepository) {
        this.categoryRepository = repository
    }

    @httpGet("/")
    public async get(@request() req: express.Request, @response() res: express.Response) {
        console.log("Get request of category controller");
        try {
            //let output = await this.cityRepository.retrieve();
            let output = await new Promise(async (resolve, reject) => {
                (this.categoryRepository.retrieve() as any).populate("country").populate("region").exec((error: any, data: any) => {
                    if (error) {
                        reject(error);
                    }
                    resolve(data);
                });
            });
            return res.json(output);
        } catch (error) {
            return res.status(500).send(error.message);
        };
    }

    @httpGet("/:id")
    public async getById(@request() req: express.Request, @response() res: express.Response) {
        console.log("Get request of category controller");
        try {
            const category = await this.categoryRepository.findById(req.params.id);
            res.json(category);
        } catch (error) {
            res.status(500).send(error.message);
        }
    }

    @httpPost("/")
    public async post(@request() req: express.Request, @response() res: express.Response) {
        console.log("Post request of category controller");
        try {
//            region.country = Types.ObjectId(city.country);
            const category = req.body as ICategoryModel;
            delete category._id;
            const newCategory = await this.categoryRepository.create(category);
            res.json(newCategory);
        } catch (error) {
            res.status(500).send(error.message);
        }
    }

    @httpPut("/:id")
    public async put(@request() req: express.Request, @response() res: express.Response) {
        console.log("Put request of category controller");
        try {
            const category = await this.categoryRepository.update(req.params.id, req.body);
            res.json(category);
        } catch (error) {
            res.status(500).send(error.message);
        }
    }

    @httpDelete("/:id")
    public async delete(@request() req: express.Request, @response() res: express.Response) {
        console.log("Delete request of category controller");
        try {
            const category = await this.categoryRepository.delete(req.params.id);
            res.json(category);
        } catch (error) {
            res.status(500).send(error.message);
        }
    }

}