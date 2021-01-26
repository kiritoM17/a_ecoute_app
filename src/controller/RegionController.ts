import { response, controller, httpGet, httpPost, httpDelete, httpPut, request } from "inversify-express-utils";
import {Types} from "mongoose";
import * as express from "express";
import { TYPES } from "../config/constant/types";
import { inject } from "inversify";
import { RegionRepository } from "../app/repository/region.repository";
import { RegionModel } from "../app/model/Region";
import { resolve } from "path";
import { IRegionModel } from "../app/model/Region";
import { CountryRepository } from "../app/repository/country.repository";

@controller("/api/v1/region")
export class RegionController {

    private regionRepository: RegionRepository;
    private countryRepository: CountryRepository

    constructor(
        @inject(TYPES.RegionRepository) repository: RegionRepository,
        @inject(TYPES.CountryRepository) countryRep: CountryRepository
        ) {
        this.regionRepository = repository
        this.countryRepository = countryRep;
    }

    @httpGet("/")
    public async get(@request() req: express.Request, @response() res: express.Response) {
        console.log("Get request of region controller");
        try {
            //let output = await this.regionRepository.retrieve();
            let output = await new Promise(async (resolve, reject) => {
                this.regionRepository.retrieve().then((data: any) => {
                    resolve(data);
                }).catch(err => {
                    reject(err);
                });
            });
            return res.json(output);
        } catch (error) {
            return res.status(500).send(error.message);
        };
    }

    @httpGet("/:id")
    public async getById(@request() req: express.Request, @response() res: express.Response) {
        console.log("Get request of region controller");
        try {
            const region = await this.regionRepository.findById(req.params.id);
            res.json(region);
        } catch (error) {
            res.status(500).send(error.message);
        }
    }

    @httpPost("/")
    public async post(@request() req: express.Request, @response() res: express.Response) {
        console.log("Post request of region controller");
        try {
            const region = req.body as IRegionModel;
            delete region._id;
            region.cities = [];
            try{
                const country = await this.countryRepository.findById(region.country);
                const newRegion = await this.regionRepository.create(req.body);
                country.regions.push(newRegion._id);
                let result = await this.countryRepository.update(country._id, country);
                res.json(newRegion);
            }catch(error){
                res.status(500).json({error: error.message});
            }
            // country.re
        } catch (error) {
            res.status(500).send(error.message);
        }
    }

    @httpPut("/:id")
    public async put(@request() req: express.Request, @response() res: express.Response) {
        console.log("Put request of region controller");
        try {
            const region = await this.regionRepository.update(req.params.id, req.body);
            res.json(region);
        } catch (error) {
            res.status(500).send(error.message);
        }
    }

    @httpDelete("/:id")
    public async delete(@request() req: express.Request, @response() res: express.Response) {
        console.log("Delete request of region controller");
        try {
            const region = await this.regionRepository.delete(req.params.id);
            res.json(region);
        } catch (error) {
            res.status(500).send(error.message);
        }
    }

}