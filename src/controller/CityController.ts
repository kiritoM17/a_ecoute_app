import { response, controller, httpGet, httpPost, httpDelete, httpPut, request } from "inversify-express-utils";
import {Types} from "mongoose";
import express from "express";
import { TYPES } from '../config/constant/types';
import { inject } from "inversify";
import { CityRepository } from "../app/repository/city.repository";
import { CityModel, ICityModel } from "../app/model/City";
import { RegionRepository } from '../app/repository/region.repository';

@controller("/api/v1/city")
export class CityController {

    private cityRepository: CityRepository;
    private regionRepository: RegionRepository;

    constructor(
        @inject(TYPES.CityRepository) repository: CityRepository,
        @inject(TYPES.RegionRepository) regRepo: RegionRepository) {
        this.cityRepository = repository;
        this.regionRepository = regRepo;
    }

    @httpGet("/")
    public async get(@request() req: express.Request, @response() res: express.Response) {
        console.log("Get request of city controller");
        try {
            //let output = await this.cityRepository.retrieve();
            let output = await new Promise(async (resolve, reject) => {
                this.cityRepository.retrieve().then((data: any) => {
                    resolve(data);
                }).catch(error => {
                    if (error) {
                        reject(error);
                    }
                });
            });
            return res.json(output);
        } catch (error) {
            return res.status(500).send(error.message);
        };
    }

    @httpGet("/:id")
    public async getById(@request() req: express.Request, @response() res: express.Response) {
        console.log("Get request of city controller");
        try {
            const city = await this.cityRepository.findById(req.params.id);
            res.json(city);
        } catch (error) {
            res.status(500).send(error.message);
        }
    }

    @httpPost("/")
    public async post(@request() req: express.Request, @response() res: express.Response) {
        console.log("Post request of city controller");
        try {
            const city = req.body as ICityModel;
            delete city._id;
            const region = await this.regionRepository.findById(city.region as string);
            if(!city.country){
                city.country = region.country;
            }
            const newCity = await this.cityRepository.create(city);
            region.cities.push(newCity._id);
            const result = await this.regionRepository.update(region._id, region);
            res.json(newCity);
        } catch (error) {
            res.status(500).send(error.message);
        }
    }

    @httpPut("/:id")
    public async put(@request() req: express.Request, @response() res: express.Response) {
        console.log("Put request of city controller");
        try {
            const city = await this.cityRepository.update(req.params.id, req.body);
            res.json(city);
        } catch (error) {
            res.status(500).send(error.message);
        }
    }

    @httpDelete("/:id")
    public async delete(@request() req: express.Request, @response() res: express.Response) {
        console.log("Delete request of city controller");
        try {
            const city = await this.cityRepository.delete(req.params.id);
            const region = await this.regionRepository.findByCityId(req.params.id);
            let index = region.cities.indexOf(req.params.id);
            if(index>-1){
                region.cities.splice(index, 1);
                await this.regionRepository.update(region._id, region);
            }
            res.json(city);
        } catch (error) {
            res.status(500).send(error.message);
        }
    }

}