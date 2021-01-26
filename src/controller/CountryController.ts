import { response, controller, httpGet, httpPost, httpDelete, httpPut, request } from "inversify-express-utils";
import * as express from "express";
import { TYPES } from "../config/constant/types";
import { inject } from "inversify";
import { CountryRepository } from "../app/repository/country.repository";
import { ICountryModel } from "../app/model/Country";

@controller("/api/v1/country")
export class CountryController {

    private countryRepository: CountryRepository;

    constructor(@inject(TYPES.CountryRepository) repository: CountryRepository) {
        this.countryRepository = repository
    }

    @httpGet("/")
    public async get(@request() req: express.Request, @response() res: express.Response) {
        console.log("Get request of country controller");
        try {
            const countryList = await this.countryRepository.retrieve();
            res.json(countryList);
        } catch (error) {
            res.status(500).send(error.message);
        }
    }

    @httpGet("/:id")
    public async getById(@request() req: express.Request, @response() res: express.Response) {
        console.log("Get request of country controller");
        try {
            const country = await this.countryRepository.findById(req.params.id);
            res.json(country);
        } catch (error) {
            res.status(500).send(error.message);
        }
    }

    @httpPost("/")
    public async post(@request() req: express.Request, @response() res: express.Response) {
        console.log("Post request of country controller");
        try {
            const country = req.body as ICountryModel;
            delete country._id;
            const newCountry = await this.countryRepository.create(country);
            res.json(newCountry);
        } catch (error) {
            res.status(500).send(error.message);
        }
    }

    @httpPut("/:id")
    public async put(@request() req: express.Request, @response() res: express.Response) {
        console.log("Put request of country controller");
        try {
            const country = await this.countryRepository.update(req.params.id, req.body);
            res.json(country);
        } catch (error) {
            res.status(500).send(error.message);
        }
    }

    @httpDelete("/:id")
    public async delete(@request() req: express.Request, @response() res: express.Response) {
        console.log("Delete request of country controller");
        try {
            const country = await this.countryRepository.delete(req.params.id);
            res.json(country);
        } catch (error) {
            res.status(500).send(error.message);
        }
    }

}