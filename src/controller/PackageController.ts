import { response, controller, httpGet, httpPost, httpDelete, httpPut, request } from "inversify-express-utils";
import {Types} from "mongoose";
import express from "express";
import { TYPES } from "../config/constant/types";
import { inject } from "inversify";
import { IPackageModel } from "../app/model/Package";
import { PackageRepository } from "../app/repository/package.repository";

@controller("/api/v1/package")
export class PackageController {

    private packegeRepository: PackageRepository;

    constructor(@inject(TYPES.PackegeRepository) repository: PackageRepository) {
        this.packegeRepository = repository
    }

    @httpGet("/")
    public async get(@request() req: express.Request, @response() res: express.Response) {
        console.log("Get request of packege controller");
        try {
            let output = await new Promise(async (resolve, reject) => {
                (this.packegeRepository.retrieve() as any).populate("country").where('tmp').ne(true).populate("region").exec((error: any, data: any) => {
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

    @httpGet("/full-content")
    public async getFull(@request() req: express.Request, @response() res: express.Response) {
        console.log("Get request of packege controller");
        try {
            let output = await new Promise(async (resolve, reject) => {
                (this.packegeRepository.retrieve() as any).where("tmp").ne(true).populate("baseItem").populate("addItems").exec((error: any, data: any) => {
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
        console.log("Get request of packege controller");
        try {
            const packege = await this.packegeRepository.findById(req.params.id);
            res.json(packege);
        } catch (error) {
            res.status(500).send(error.message);
        }
    }

    @httpPost("/")
    public async post(@request() req: express.Request, @response() res: express.Response) {
        console.log("Post request of packege controller");
        try {
            const packege = req.body as IPackageModel;
            delete packege._id;
            const newPac = await this.packegeRepository.create(packege);
            res.json(newPac);
        } catch (error) {
            res.status(500).send(error.message);
        }
    }

    @httpPut("/:id")
    public async put(@request() req: express.Request, @response() res: express.Response) {
        console.log("Put request of packege controller");
        try {
            const packege = await this.packegeRepository.update(req.params.id, req.body);
            res.json(packege);
        } catch (error) {
            res.status(500).send(error.message);
        }
    }

    @httpDelete("/:id")
    public async delete(@request() req: express.Request, @response() res: express.Response) {
        console.log("Delete request of packege controller");
        try {
            const packege = await this.packegeRepository.delete(req.params.id);
            res.json(packege);
        } catch (error) {
            res.status(500).send(error.message);
        }
    }

}