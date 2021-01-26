import { response, controller, httpGet, httpPost, httpDelete, httpPut, request } from "inversify-express-utils";
import * as express from "express";
import { TYPES } from "../config/constant/types";
import { inject } from "inversify";
import { ItemRepository } from "../app/repository/item.repository";
import { IItemModel } from "../app/model/Item";
import { UploadedFile } from "express-fileupload";
import { v1 } from "uuid";
import * as path from "path";
import { Constants } from "../config/constant/Constants";

@controller("/api/v1/upload")
export class FileUploadController {

    private itemRepository: ItemRepository;

    constructor(@inject(TYPES.ItemRepository) repository: ItemRepository) {
        this.itemRepository = repository
    }

    @httpPost("/item")
    public async itemUpload(@request() req: express.Request, @response() res: express.Response) {
        console.log("Item Pic Upload");

        if (!req.files) {
            return res.status(400).json({ info: "No files were uploaded" });
        }
        let files: any[] = [];
        if (req.files.file instanceof Array) {
            let length = (req.files.file as UploadedFile[]).length;
            for (let i = 0; i < length; i++) {
                const photo: UploadedFile = req.files.file[i];
                let fileName: string = v1() + path.extname(photo.name);
                files.push({ name: fileName });
                photo.mv(Constants.PUBLIC_PATH + Constants.ITEMS + fileName, err => {
                    if (err) {
                        return res.status(500).json({ info: err });
                    } else {
                        return res.status(200).json({ info: "Item picture saved successfully!", data: files });
                    }
                });
            }
        } else {
            const photo: any = req.files.file;
            let fileName: string = v1() + path.extname(photo.name);
            files.push({ name: fileName });
            try {
                const filePath = Constants.PUBLIC_PATH + Constants.ITEMS + fileName;
                const result = await photo.mv(filePath);
                res.status(200).json({ info: "Item picture saved successfully!", data: files });
            } catch (error) {
                res.status(500).json({ info: error.message });
            }

        }
    }

    @httpPost("/articles")
    public async articleUpload(@request() req: express.Request, @response() res: express.Response) {
        console.log("Article Pic Upload");

        if (!req.files) {
            return res.status(400).json({ info: "No files were uploaded" });
        }
        let files: any[] = [];
        if (req.files.file instanceof Array) {
            let length = (req.files.file as UploadedFile[]).length;
            for (let i = 0; i < length; i++) {
                const photo: UploadedFile = req.files.file[i];
                let fileName: string = v1() + path.extname(photo.name);
                files.push({ name: fileName });
                photo.mv(Constants.PUBLIC_PATH + Constants.ARTICLES + fileName, err => {
                    if (err) {
                        return res.status(500).json({ info: err });
                    } else {
                        return res.status(200).json({ info: "Article picture saved successfully!", data: files });
                    }
                });
            }
        } else {
            const photo: any = req.files.file;
            let fileName: string = v1() + path.extname(photo.name);
            files.push({ name: fileName });
            try {
                const filePath = Constants.PUBLIC_PATH + Constants.ARTICLES + fileName;
                const result = await photo.mv(filePath);
                res.status(200).json({ info: "Article picture saved successfully!", data: files });
            } catch (error) {
                res.status(500).json({ info: error.message });
            }

        }
    }

    @httpPost("/category")
    public async categoryUpload(@request() req: express.Request, @response() res: express.Response) {
        if (!req.files) {
            return res.status(400).json({ info: "No files were uploaded" });
        }
        let files: any[] = [];
        if (req.files.file instanceof Array) {
            let length = (req.files.file as UploadedFile[]).length;
            for (let i = 0; i < length; i++) {
                const photo: UploadedFile = req.files.file[i];
                let fileName: string = v1() + path.extname(photo.name);
                files.push({ name: fileName });
                photo.mv(Constants.PUBLIC_PATH + Constants.CATEGORY + fileName, err => {
                    if (err) {
                        return res.status(500).json({ info: err });
                    } else {
                        return res.status(200).json({ info: "Category picture saved successfully!", data: files });
                    }
                });
            }
        } else {
            const photo: any = req.files.file;
            let fileName: string = v1() + path.extname(photo.name);
            files.push({ name: fileName });
            try {
                const filePath = Constants.PUBLIC_PATH + Constants.CATEGORY + fileName;
                const result = await photo.mv(filePath);
                res.status(200).json({ info: "Category picture saved successfully!", data: files });
            } catch (error) {
                res.status(500).json({ info: error.message });
            }

        }
    }

    @httpPost("/region")
    public async regionUpload(@request() req: express.Request, @response() res: express.Response) {
        if (!req.files) {
            return res.status(400).json({ info: "No files were uploaded" });
        }
        let files: any[] = [];
        if (req.files.file instanceof Array) {
            let length = (req.files.file as UploadedFile[]).length;
            for (let i = 0; i < length; i++) {
                const photo: UploadedFile = req.files.file[i];
                let fileName: string = v1() + path.extname(photo.name);
                files.push({ name: fileName });
                photo.mv(Constants.PUBLIC_PATH + Constants.REGION + fileName, err => {
                    if (err) {
                        return res.status(500).json({ info: err });
                    } else {
                        return res.status(200).json({ info: "Region picture saved successfully!", data: files });
                    }
                });
            }
        } else {
            const photo: any = req.files.file;
            let fileName: string = v1() + path.extname(photo.name);
            files.push({ name: fileName });
            try {
                const filePath = Constants.PUBLIC_PATH + Constants.REGION + fileName;
                const result = await photo.mv(filePath);
                res.status(200).json({ info: "Region picture saved successfully!", data: files });
            } catch (error) {
                res.status(500).json({ info: error.message });
            }

        }
    }

    @httpPost("/store")
    public async storeUpload(@request() req: express.Request, @response() res: express.Response) {
        if (!req.files) {
            return res.status(400).json({ info: "No files were uploaded" });
        }
        let files: any[] = [];
        let index: boolean[] = [];
        if (req.files.file instanceof Array) {
            let length = (req.files.file as UploadedFile[]).length;
            for (let i = 0; i < length; i++) {
                const photo: UploadedFile = req.files.file[i];
                let fileName: string = v1() + path.extname(photo.name);
                files.push({ name: fileName });
                photo.mv(Constants.PUBLIC_PATH + Constants.STORE + fileName, err => {
                    if (err) {}
                });
            }
            return res.status(200).json({ info: "Store picture saved successfully!", data: files });
        } else {
            const photo: any = req.files.file;
            let fileName: string = v1() + path.extname(photo.name);
            files.push({ name: fileName });
            try {
                const filePath = Constants.PUBLIC_PATH + Constants.STORE + fileName;
                const result = await photo.mv(filePath);
                res.status(200).json({ info: "Store picture saved successfully!", data: files });
            } catch (error) {
                res.status(500).json({ info: error.message });
            }

        }
    }

    @httpPost("/city")
    public async cityUpload(@request() req: express.Request, @response() res: express.Response) {
        if (!req.files) {
            return res.status(400).json({ info: "No files were uploaded" });
        }
        let files: any[] = [];
        let index: boolean[] = [];
        if (req.files.file instanceof Array) {
            let length = (req.files.file as UploadedFile[]).length;
            for (let i = 0; i < length; i++) {
                const photo: UploadedFile = req.files.file[i];
                let fileName: string = v1() + path.extname(photo.name);
                files.push({ name: fileName });
                photo.mv(Constants.PUBLIC_PATH + Constants.CITY + fileName, err => {
                    if (err) {}
                });
            }
            return res.status(200).json({ info: "City picture saved successfully!", data: files });
        } else {
            const photo: any = req.files.file;
            let fileName: string = v1() + path.extname(photo.name);
            files.push({ name: fileName });
            try {
                const filePath = Constants.PUBLIC_PATH + Constants.CITY + fileName;
                const result = await photo.mv(filePath);
                res.status(200).json({ info: "City picture saved successfully!", data: files });
            } catch (error) {
                res.status(500).json({ info: error.message });
            }
        }
    }
    /*
            @httpPost("/avatar")
            public async avatarUpload(@request() req: express.Request, @response() res: express.Response) {
                console.log("Delete request of item controller");
                try {
                    const item = await this.itemRepository.delete(req.params.id);
                    res.json(item);
                } catch (error) {
                    res.status(500).send(error.message);
                }
            }*/

}