import { response, controller, httpGet, httpPost, httpDelete, httpPut, request } from "inversify-express-utils";
import express from "express";
import { TYPES } from '../config/constant/types';
import { inject } from "inversify";
import { ArticleRepository } from "../app/repository/article.repository";
import { ArticleModel, IArticleModel } from "../app/model/Article";

@controller("/api/v1/article")
export class ArticleController {

    private articleRepository: ArticleRepository;
    
    constructor(
        @inject(TYPES.ArticleRepository) repository: ArticleRepository) {
        this.articleRepository = repository;
    }

    @httpGet("/")
    public async get(@request() req: express.Request, @response() res: express.Response) {
        console.log("Get request of article controller");
        try {
            //let output = await this.cityRepository.retrieve();
            let output = await new Promise(async (resolve, reject) => {
                this.articleRepository.retrieve().then((data: any) => {
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
        console.log("Get request of article controller");
        try {
            const article = await this.articleRepository.findById(req.params.id);
            res.json(article);
        } catch (error) {
            res.status(500).send(error.message);
        }
    }

    @httpPost("/")
    public async post(@request() req: express.Request, @response() res: express.Response) {
        console.log("Post request of article controller");
        try {
            const article = req.body as IArticleModel;
            if(article.binding && article.binding.bindingType === null){
                delete article.binding
            }
            const id = article._id;
            delete article._id;
            const ar = await this.articleRepository.create(article);
            res.json(ar);
        } catch (error) {
            res.status(500).send(error.message);
        }
    }

    @httpPut("/:id")
    public async put(@request() req: express.Request, @response() res: express.Response) {
        console.log("Put request of city controller");
        try {
            const article = await this.articleRepository.update(req.params.id, req.body);
            res.json(article);
        } catch (error) {
            res.status(500).send(error.message);
        }
    }

    @httpDelete("/:id")
    public async delete(@request() req: express.Request, @response() res: express.Response) {
        console.log("Delete request of article controller");
        try {
            const article = await this.articleRepository.delete(req.params.id);
            res.json(article);
        } catch (error) {
            res.status(500).send(error.message);
        }
    }

}