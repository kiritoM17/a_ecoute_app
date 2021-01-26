import { response, controller, httpGet, httpPost, httpDelete, httpPut, request } from "inversify-express-utils";
import { Types } from "mongoose";
import express from "express";
import { TYPES } from '../config/constant/types';
import { inject } from "inversify";
import { CityRepository } from "../app/repository/city.repository";
import { CityModel, ICityModel } from "../app/model/City";
import { RegionRepository } from '../app/repository/region.repository';
import { OrderRepository } from "../app/repository/order.repository";
import { IOrderModel } from "../app/model/Order";

@controller("/api/v1/order")
export class OrderController {

    private orderRepository: OrderRepository;
    private regionRepository: RegionRepository;

    constructor(
        @inject(TYPES.OrderRepository) repository: OrderRepository,
        @inject(TYPES.RegionRepository) regRepo: RegionRepository) {
        this.orderRepository = repository;
        this.regionRepository = regRepo;
    }

    @httpGet("/")
    public async get(@request() req: express.Request, @response() res: express.Response) {
        console.log("Get request of Order controller");
        try {
            let data = await (this.orderRepository.retrieve() as any)
                .populate('productOffer')
                .populate({
                    path: 'productOffer',
                    populate: {
                        path: 'store'
                    }
                })
                /*.populate({
                    path: 'productOffer',
                    populate: {
                        path: 'package'
                    }
                })
                .populate({
                    path: 'productOffer',
                    populate: {
                        path: 'package',
                        populate: {
                            path: 'baseItem'
                        }
                    }
                })
                .populate({
                    path: 'productOffer',
                    populate: {
                        path: 'package',
                        populate: {
                            path: 'addItems'
                        }
                    }
                })
                .populate({
                    path: 'productOffer.package',
                    populate: {
                        path: 'addItems'
                    }
                })
                .populate('customerDitails')
                .populate('deliveryDetails')
                .populate('deliveryAddress')
                .populate({
                    path: 'deliveryAddress',
                    populate: {
                        path: 'city'
                    }
                })*/;

            return res.json(data);
        } catch (error) {
            return res.status(500).send(error.message);
        };
    }

    @httpGet("/:id")
    public async getById(@request() req: express.Request, @response() res: express.Response) {
        console.log("Get request of Order controller");
        try {
            const order = await this.orderRepository.findById(req.params.id);
            res.json(order);
        } catch (error) {
            res.status(500).send(error.message);
        }
    }

    @httpPost("/")
    public async post(@request() req: express.Request, @response() res: express.Response) {
        console.log("Post request of order controller");
        try {
            const order = req.body as IOrderModel;
            delete order._id;
            const newOrder = await this.orderRepository.create(order);
            res.json(newOrder);
        } catch (error) {
            res.status(500).send(error.message);
        }
    }

    @httpPut("/:id")
    public async put(@request() req: express.Request, @response() res: express.Response) {
        console.log("Put request of Order controller");
        try {
            const order = await this.orderRepository.update(req.params.id, req.body);
            res.json(order);
        } catch (error) {
            res.status(500).send(error.message);
        }
    }

    @httpDelete("/:id")
    public async delete(@request() req: express.Request, @response() res: express.Response) {
        console.log("Delete request of Order controller");
        try {
            const order = await this.orderRepository.delete(req.params.id);
            res.json(order);
        } catch (error) {
            res.status(500).send(error.message);
        }
    }

}