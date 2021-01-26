import { response, controller, httpGet, httpPost, httpDelete, httpPut, request } from "inversify-express-utils";
import * as express from "express";
import * as fs from "fs";
import * as path from "path";
import * as http from "request";
import jwt = require("jsonwebtoken");
import { Constants } from "../config/constant/Constants";
import { v1 } from "uuid";
import * as nodemailer from "nodemailer";
import * as passport from 'passport';
import { middlewareToPromise } from '../app/model/helpers/server-utils';
import * as EmailTemplate from "email-templates";
import { RegistrationMail } from "../app/model/Mails/registration.mail"
import { Types } from "mongoose";
import { TYPES } from "../config/constant/types";
import { inject } from "inversify";
import { ItemRepository } from "../app/repository/item.repository";
import { PackageRepository } from "../app/repository/package.repository";
import { CategoryRepository } from "../app/repository/category.repository";
import { StoreRepository } from "../app/repository/store.repository";
import { CityRepository } from "../app/repository/city.repository";
import { ProductOfferRepository } from "../app/repository/product.offer.repository";
import { IItemModel } from "../app/model/Item";
import { IProductOfferModel } from "../app/model/ProductOffer";
import { RegionRepository } from "../app/repository/region.repository";
import { OrderRepository } from "../app/repository/order.repository";
import { DeliveryAddressRepository } from "../app/repository/delivery.adderess.repository";
import { RateRepository } from "../app/repository/rate.repository";
import { PackageModel } from '../app/model/Package';
import { ItemModel } from '../app/model/Item';
import { IOrderModel } from '../app/model/Order';
import { DeliveryAddressModel } from '../app/model/DeliveryAddress';
import { DeliveryDetailsModel } from '../app/model/DeliveryDetails';
import { CustomerDetailsModel } from '../app/model/CustomerDitails';
import { IStoreModel, StoreModel } from '../app/model/Store';
import { IRate, RateModel, IRateModel } from "../app/model/Rate";
import { ArticleRepository } from "../app/repository/article.repository";
import { ArticleType } from "../app/model/Enum/AritcleType";
import { UserRepository } from "../app/repository/user.repository";
import { IUserModel } from "../app/model/User";
import { CategoryModel, ICategoryModel } from "../app/model/Category";
import { ICityModel } from "../app/model/City";
import { RateManager } from "../app/model/helpers/RateManagement";
import { PriceManagement } from "../app/model/helpers/PriceManagement";
import { BindingType } from "../app/model/Enum/BindingType";

@controller("/api/v1/content")
export class ContentController {
    private itemRepository: ItemRepository;
    private packRepository: PackageRepository;
    private categoryRepository: CategoryRepository;
    private storeRepository: StoreRepository;
    private cityRepository: CityRepository;
    private productOfferRepository: ProductOfferRepository;
    private regionRepository: RegionRepository;
    private orderRepository: OrderRepository;
    private deliveryAddressRepository: DeliveryAddressRepository;
    private rateRepository: RateRepository;
    private articleRepository: ArticleRepository;
    private userRepository: UserRepository;

    constructor(
        @inject(TYPES.ItemRepository) itemRepo: ItemRepository,
        @inject(TYPES.PackegeRepository) packRepo: PackageRepository,
        @inject(TYPES.CategoryRepository) categoryRepo: CategoryRepository,
        @inject(TYPES.StoreRepository) storeRepo: StoreRepository,
        @inject(TYPES.CityRepository) cityRepo: CityRepository,
        @inject(TYPES.ProductOfferRepository) prodOfRepo: ProductOfferRepository,
        @inject(TYPES.RegionRepository) regionRepo: RegionRepository,
        @inject(TYPES.OrderRepository) orderRepo: OrderRepository,
        @inject(TYPES.DeliveryAddressRepository) delAddrRepo: DeliveryAddressRepository,
        @inject(TYPES.RateRepository) rateRepo: RateRepository,
        @inject(TYPES.ArticleRepository) articleRepo: ArticleRepository,
        @inject(TYPES.UserRepository) userRepo: UserRepository,
    ) {
        this.itemRepository = itemRepo;
        this.packRepository = packRepo;
        this.categoryRepository = categoryRepo;
        this.storeRepository = storeRepo;
        this.cityRepository = cityRepo;
        this.productOfferRepository = prodOfRepo;
        this.regionRepository = regionRepo;
        this.orderRepository = orderRepo;
        this.deliveryAddressRepository = delAddrRepo;
        this.rateRepository = rateRepo;
        this.articleRepository = articleRepo;
        this.userRepository = userRepo;
    }

    @httpGet("/homepage")
    public async get(@request() req: express.Request, @response() res: express.Response) {
        console.log("Get homepage data");
        let article, homePageArticles, stores, itemDalyList, itemSaleList, packages;
        let bestStores: any;
        let rateManager = RateManager.getInstance();
        let priceManager = PriceManagement.getInstance();

        try {
            article = await (this.articleRepository.retrieve() as any).where('articleType').equals(ArticleType.homePage);
            homePageArticles = await (this.articleRepository.retrieve() as any).where('showOnHomePage').equals(true).select("-seo -binding -text -slogan -showOnHomePage -showInList");
            article = article.length > 0 ? article[0] : article;
            //let packagePrice = await StoreModel.aggregate([{$unwind: "$items"}, {$match: {active: true}}, {$group: {_id: "$items.item", minPrice: {$min: "$items.price"}, maxPrice: {$max: "$items.price"}}}]);
            itemDalyList = (await (this.itemRepository.retrieve() as any).where('dayDeal').equals(true).limit(4).select("-rate -seo -description")).map((item: any) => item.toObject());
            itemDalyList.map((item: IItemModel) => {
                item.reviewsCount = rateManager.findBouquetReviewCount(item._id);
                item.rating = rateManager.findBouquetRate(item._id);
                const price = priceManager.getAllOffersPrice(item._id.toString());
                if (price) {
                    item.minPrice = price.minPrice;
                    item.maxPrice = price.maxPrice;
                    item.offerCount = price.offerCount;
                }
                return item;
            });
            itemSaleList = (await (this.itemRepository.retrieve() as any).where('dayDeal').equals(false).where('price').gt(0).limit(4).select("-rate -seo -description")).map((item: any) => item.toObject());;
            itemSaleList.map((item: IItemModel) => {
                item.reviewsCount = rateManager.findBouquetReviewCount(item._id);
                item.rating = rateManager.findBouquetRate(item._id);
                const price = priceManager.getAllOffersPrice(item._id.toString());
                if (price) {
                    item.minPrice = price.minPrice;
                    item.maxPrice = price.maxPrice;
                    item.offerCount = price.offerCount;
                }
                return item;
            });
            packages = await (this.packRepository.retrieve() as any).where('tmp').ne(true).populate('addItems').populate('baseItem').limit(4);
            let outStoreList = await (this.storeRepository.retrieve() as any).where({ toHomePage: true }).select('-weekHours -weekEndHours -shabatHours -payments -deliveryTypes -tel -mail -mobile -fax -adminActive -adminMessage -message');
            bestStores = []
            outStoreList.map((store: IStoreModel) => {
                let curRate: number = 0;
                let tmp: any = {};
                tmp.name = store.name;
                tmp.description = store.seo.description;
                tmp.address = store.address;
                tmp.itemsCount = store.items.length;
                tmp.link = store.link;
                tmp.ind = store.ind;

                tmp.reviewsCount = rateManager.findStoreReviewCount(store._id);
                tmp.rating = rateManager.findStoreRate(store._id);
                if (store.pic.length > 0) {
                    tmp.pic = store.pic[0];
                } else {
                    tmp.pic = 'no-photo-available.png'
                }
                bestStores.push(tmp);
            });
        } catch (error) {
            return res.status(500).send(error.message);
        }

        try {
            res.json({ bestStores: bestStores, DalyList: itemDalyList, SaleList: itemSaleList, packages: packages, article: article, homePageArticles: homePageArticles });
        } catch (error) {
            res.status(500).send(error.message);
        }
    }

    @httpGet("/shop-list")
    public async getShopList(@request() req: express.Request, @response() res: express.Response) {
        console.log("Get shop list data");
        let city = req.query.city;
        let region = req.query.region;
        let rateManager = RateManager.getInstance();
        const itemDalyList = await (this.itemRepository.retrieve() as any).where('dayDeal').equals(true).populate('rate');
        // const itemSaleList = await (this.itemRepository.retrieve() as any).where('dayDeal').equals(false).where('price').gt(0);
        const packages = await (this.packRepository.retrieve() as any).where('tmp').ne(true).populate('addItems').populate('baseItem');
        try {
            if (city !== undefined) {
                city = await (this.cityRepository.retrieve() as any).where('name.heb').equals(city.split("_").join(" "));
                let article = await (this.articleRepository.retrieve() as any).where({ "binding.object": city[0]._id, 'articleType': ArticleType.shopInCity });
                article = article.length > 0 ? article[0] : article;
                let storeList = await (this.storeRepository.retrieve() as any).where({ 'adminActive': true, 'delivery.city': city[0]._id }).select('-weekHours -weekEndHours -shabatHours -payments -description -deliveryTypes -tel -mail -mobile -fax -adminActive -adminMessage -message -rate');
                let needed: any[] = [];
                storeList.map((store: IStoreModel) => {
                    let curRate: number = 0;
                    let tmp: any = {};
                    tmp.name = store.name;
                    tmp.description = store.seo.description;
                    tmp.address = store.address;
                    tmp.items = store.items;
                    tmp.delivery = store.delivery;
                    tmp.itemsCount = store.items.length;
                    tmp.link = store.link;
                    tmp.storeLocation = store.storeLocation;
                    tmp.ind = store.ind;
                    tmp._id = store._id;
                    tmp.city = store.city;
                    tmp.reviewsCount = rateManager.findStoreReviewCount(store._id);
                    tmp.rating = rateManager.findStoreRate(store._id);
                    if (store.pic.length > 0) {
                        tmp.pic = store.pic[0];
                    } else {
                        tmp.pic = 'no-photo-available.png'
                    }
                    needed.push(tmp);
                });
                const regions = await (this.regionRepository.retrieve() as any).select('-seo -averagePrice -itemCount');
                return res.json({ storeList: needed, regions: regions, article: article, dalyList: itemDalyList, packages: packages, city: city });
            }
            if (region !== undefined) {
                let selRegion = await (this.regionRepository.retrieve() as any).where('name.heb').equals(region.split("_").join(" ")).select("-seo");
                selRegion = selRegion.length > 0 ? selRegion[0] : selRegion;
                let cities = await (this.cityRepository.retrieve() as any).where('region').equals(selRegion._id).select("-seo -description");
                let citiesIDs = cities.map((city: ICityModel) => city._id);
                let article = await (this.articleRepository.retrieve() as any).where({ 'binding.object': selRegion._id, 'articleType': ArticleType.shopInRegion });
                article = article.length > 0 ? article[0] : article;
                const storeList = await (this.storeRepository.retrieve() as any).where('active').equals(true).where('city').in(citiesIDs).select('-weekHours -weekEndHours -shabatHours -payments -tel -mail -mobile -fax -adminActive -adminMessage -message -rate');
                let needed: any[] = [];
                storeList.map((store: IStoreModel) => {
                    let tmp: any = {};
                    tmp.name = store.name;
                    tmp.description = store.seo.description;
                    tmp.address = store.address;
                    tmp.items = store.items;
                    tmp.delivery = store.delivery;
                    tmp.itemsCount = store.items.length;
                    tmp.link = store.link;
                    tmp.storeLocation = store.storeLocation;
                    tmp.ind = store.ind;
                    tmp._id = store._id;
                    tmp.city = store.city;
                    tmp.reviewsCount = rateManager.findStoreReviewCount(store._id);
                    tmp.rating = rateManager.findStoreRate(store._id);
                    if (store.pic.length > 0) {
                        tmp.pic = store.pic[0];
                    } else {
                        tmp.pic = 'no-photo-available.png'
                    }
                    needed.push(tmp);
                });
                return res.json({ storeList: needed, selRegion, cities: cities, article });
            }

            const storeList = await (this.storeRepository.retrieve() as any).where({ 'adminActive': true }).select('-weekHours -weekEndHours -shabatHours -payments -deliveryTypes -tel -mail -mobile -fax -adminActive -adminMessage -message').populate('rate');
            let outStoreList: any = [];
            let article = await (this.articleRepository.retrieve() as any).where({
                'binding.object': null,
                'articleType': ArticleType.shopInCity,
                'binding.bindingType': BindingType.city
            });
            article = article.length > 0 ? article[0] : article;
            storeList.map((store: IStoreModel) => {
                let curRate: number = 0;
                let tmp: any = {};
                tmp.name = store.name;
                tmp.description = store.seo.description;
                tmp.address = store.address;
                tmp.itemsCount = store.items.length;
                tmp.link = store.link;
                tmp.ind = store.ind;
                store.rate.forEach(rate => {
                    curRate += rate.rate;
                })
                if (curRate !== 0) {
                    curRate = +(curRate / store.rate.length).toFixed(1);
                }
                tmp.rating = curRate;
                tmp.reviewsCount = store.rate.length;
                if (store.pic.length > 0) {
                    tmp.pic = store.pic[0];
                } else {
                    tmp.pic = 'no-photo-available.png'
                }
                outStoreList.push(tmp);
            });

            const regions = await (this.regionRepository.retrieve() as any).select('-seo -averagePrice -itemCount');
            return res.json({ storeList: outStoreList, regions: regions, article });
        } catch (error) {
            return res.status(500).send(error.message);
        }
    }

    @httpGet("/price-compare")
    public async getPriceCompare(@request() req: express.Request, @response() res: express.Response) {
        console.log("Get shop list data");
        let city = req.query.city;
        let rateManager = RateManager.getInstance();
        try {
            if (city !== undefined) {
                city = await (this.cityRepository.retrieve() as any).where('name.heb').equals(city.split("_").join(" "));
                let storeList = await (this.storeRepository.retrieve() as any).where({ 'adminActive': true, 'delivery.city': city[0]._id }).select('-weekHours -description -weekEndHours -shabatHours -payments -description -deliveryTypes -tel -mail -mobile -fax -adminActive -adminMessage -message -rate');
                let needed: any[] = [];
                storeList.map((store: IStoreModel) => {
                    let tmp: any = {};
                    tmp.name = store.name;
                    tmp.description = store.seo.description;
                    tmp.address = store.address;
                    tmp.items = store.items;
                    tmp.delivery = store.delivery;
                    tmp.itemsCount = store.items.length;
                    tmp.link = store.link;
                    tmp.storeLocation = store.storeLocation;
                    tmp.ind = store.ind;
                    tmp._id = store._id;
                    tmp.city = store.city;
                    tmp.reviewsCount = rateManager.findStoreReviewCount(store._id);
                    tmp.rating = rateManager.findStoreRate(store._id);
                    if (store.pic.length > 0) {
                        tmp.pic = store.pic[0];
                    } else {
                        tmp.pic = 'no-photo-available.png'
                    }
                    needed.push(tmp);
                });
                return res.json({ storeList: needed });
            }
        } catch (error) {
            return res.status(500).send(error.message);
        }
    }

    @httpGet("/wishlist/:cityName")
    public async getWishlist(@request() req: express.Request, @response() res: express.Response) {
        let rateManager = RateManager.getInstance();
        let cityName: string = req.params.cityName.replace(/_/g, ' ');
        let city = await ((this.cityRepository.retrieve() as any).where({ 'name.heb': cityName }));
        if (city) {
            city = city[0];
        } else {
            res.status(404).send('Resource not found');
        }
        try {
            let stores = (await (this.storeRepository.retrieve() as any).where({ 'delivery.city': city._id }).select("-rate -seo -description -weekHours -weekEndHours -tel -shabatHours -mobile -message -mail -adminMessage")).map((item: any) => item.toObject());
            stores.map((item: IStoreModel) => {
                item.reviewsCount = rateManager.findStoreReviewCount(item._id);
                item.rating = rateManager.findStoreRate(item._id);
                return item;
            });
            let items = (await (this.itemRepository.retrieve() as any).select("-rate -seo -description")).map((item: any) => item.toObject());
            items.map((item: IItemModel) => {
                item.reviewsCount = rateManager.findBouquetReviewCount(item._id);
                item.rating = rateManager.findBouquetRate(item._id);
                return item;
            });
            res.json({ items, stores });
        } catch (error) {
            res.status(500).send(error.message);
        }
    }

    @httpGet("/items/:categoryName?")
    public async getItems(@request() req: express.Request, @response() res: express.Response) {
        console.log("Get Items data");
        let rateManager = RateManager.getInstance();
        let priceManager = PriceManagement.getInstance();
        let categoryName = req.params.categoryName;
        let category;
        let index = 0;
        if (categoryName) {
            category = await (this.categoryRepository.retrieve() as any).where({ 'name.heb': categoryName.replace(/_/g, " ") });
            category = category.length > 0 ? category[0] : category;
        }
        try {
            let items: any = (await (this.itemRepository.retrieve() as any).select("-seo -description -rate")).map((item: any) => item.toObject());
            items = items.map((item: any) => {
                item.reviewsCount = rateManager.findBouquetReviewCount(item._id);
                item.rating = rateManager.findBouquetRate(item._id);
                const price = priceManager.getAllOffersPrice(item._id.toString());
                if (price) {
                    item.minPrice = price.minPrice;
                    item.maxPrice = price.maxPrice;
                    item.offerCount = price.offerCount;
                }
                index += 1;
                return item;
            });
            res.json(category ? { data: items, category } : { data: items });
        } catch (error) {
            console.log(index);
            res.status(500).send(error.message);
        }
    }

    @httpGet("/category")
    public async getCategories(@request() req: express.Request, @response() res: express.Response) {
        let categories = await (this.categoryRepository.retrieve() as any).select("-description -seo -tagline");
        categories = categories.map((item: any) => item.toObject());
        let categoryStat = await ItemModel.aggregate([
            {
                $unwind: "$category"
            },
            {
                $group: {
                    _id: {
                        category: "$category"
                    },
                    count: {
                        $sum: 1
                    }
                }
            }
        ]);
        categoryStat.forEach(item => {
            const index = categories.findIndex((category: any) => category._id.equals(item._id.category));
            if (index > -1) {
                categories[index].count = item.count;
            }
        });
        return res.status(200).json({ data: categories });
    }

    @httpGet("/category/:categoryID?/:cityName?/:cityID?")
    public async getCategoryByCity(@request() req: express.Request, @response() res: express.Response) {
        console.log("Get getCategoryByCity data");
        try {
            let categoryID = req.params.categoryID;
            let cityName = req.params.cityName;
            let cityID = req.params.cityID;
            if (categoryID === undefined && cityID === undefined) {
                const category = await (this.categoryRepository.retrieve() as any); //.where('renderOnHomePage').equals(true);
                return res.json({ categories: category });
            } else if (categoryID !== undefined && cityID === undefined) {
                const items = await (this.itemRepository.retrieve() as any).where('category').equals(Types.ObjectId(categoryID));
                const category = await (this.categoryRepository.findById(categoryID) as any);
                return res.json({ items: items, category: category });
            } else if (categoryID !== undefined && cityID === undefined && cityName !== undefined) {
                const city = await (this.cityRepository.retrieve() as any).where({ $or: [{ 'name.heb': cityName }, { 'name.en': cityName }] });
                if (!city) {
                    return res.status(404).send("city not found");
                }
                const items = await (this.itemRepository.retrieve() as any).where('category').equals(Types.ObjectId(categoryID));
                const stores = await (this.storeRepository.retrieve() as any).where('delivery.city').equals(city._id);
                const category = await (this.categoryRepository.findById(categoryID) as any);
                return res.json({ items: items, stores: stores, category: category, city: city });
            } else if (categoryID !== undefined && cityID !== undefined) {
                const items = await (this.itemRepository.retrieve() as any).where('category').equals(Types.ObjectId(categoryID));
                const stores = await (this.storeRepository.retrieve() as any).where('delivery.city').equals(Types.ObjectId(cityID));
                const category = await (this.categoryRepository.findById(categoryID) as any);
                return res.json({ items: items, stores: stores, category: category });
            }
        } catch (error) {
            res.status(500).send(error.message);
        }
    }

    @httpGet("/city-search/:cityName?/:cityID?")
    public async getCitySearch(@request() req: express.Request, @response() res: express.Response) {
        console.log("Get city search data");
        let rateManager = RateManager.getInstance();
        try {
            let cityName = req.params.cityName;
            let cityID = req.params.cityID;
            const items = (await (this.itemRepository.retrieve() as any).populate('rate').select("-rate -seo")).map((item: any) => item.toObject());
            items.map((item: IItemModel) => {
                item.reviewsCount = rateManager.findBouquetReviewCount(item._id);
                item.rating = rateManager.findBouquetRate(item._id);
                return item;
            });

            if (cityID === undefined && cityName !== undefined) {
                const city = await (this.cityRepository.retrieve() as any).where({ $or: [{ 'name.heb': cityName }, { 'name.en': cityName }] }).select('-country -pic -region');
                if (Array.isArray(city) && city.length === 0) {
                    return res.status(404).send("city not found");
                }
                const stores = (await (this.storeRepository.retrieve() as any).where({ adminActive: true, 'delivery.city': city[0]._id })
                    .select("-rate -active -adminActive -address -description -weekHours -weekEndHours -seo -tel -fax -shabatHours -mobile -message -mail -adminMessage -payments -deliveryTypes"))
                    .map((item: any) => item.toObject());
                stores.map((item: IStoreModel) => {
                    item.reviewsCount = rateManager.findStoreReviewCount(item._id);
                    item.rating = rateManager.findStoreRate(item._id);
                    return item;
                });
                return res.json({ items: items, stores: stores, city: city });
            } else if (cityID !== undefined) {
                const stores = await (this.storeRepository.retrieve() as any).where('delivery.city').equals(Types.ObjectId(cityID));
                return res.json({ items: items, stores: stores });
            }
        } catch (error) {
            res.status(500).send(error.message);
        }
    }

    @httpGet("/product/:id")
    public async getProductPackage(@request() req: express.Request, @response() res: express.Response) {
        console.log("Get product page data");
        try {
            let id = req.params.id;
            let data: any = {};
            let rateManager = RateManager.getInstance();
            let priceManager = PriceManagement.getInstance();
            data.offer = await (this.productOfferRepository.findById(id) as any)
                .populate({
                    path: 'store',
                    populate: {
                        path: "items.item"
                    }
                })
                .populate({
                    path: 'store',
                })
                .populate('city', 'name')
                .populate({
                    path: 'package',
                    populate: {
                        path: "baseItem"
                    }
                });
            data.offer = data.offer.toObject();
            data.offer.store.rate = [];
            data.offer.store.seo = {};
            data.offer.store.reviewsCount = rateManager.findStoreReviewCount(data.offer.store._id);
            data.offer.store.rating = rateManager.findStoreRate(data.offer.store._id);
            data.offer.package.baseItem.rate = [];
            data.offer.package.baseItem.reviewsCount = rateManager.findBouquetReviewCount(data.offer.package.baseItem._id);
            data.offer.package.baseItem.rating = rateManager.findBouquetRate(data.offer.package.baseItem._id);

            const cityArray: string[] = [];
            data.offer.store.delivery.forEach((item: any) => {
                cityArray.push(item.city);
            });

            let cities = await (this.cityRepository.retrieve() as any).where({ _id: { $in: cityArray } }).select('-seo -description -country -pic -region');
            data.deliveryDest = cities;
            let addItems = await (this.itemRepository.retrieve() as any).where({ additional: true }).select('-seo -description -rate -category');
            data.addItems = addItems;

            const itemId = data.offer.package.baseItem._id;
            const offset = 0
            const count = 10;

            let idList;
            idList = (await (this.itemRepository.findById(itemId.toString()) as any).select('rate'));

            let rates;
            rates = await (this.rateRepository.retrieve() as any).where({ _id: { $in: idList.rate } }).sort('-createdAt').skip(offset).limit(count);
            data.itemRates = rates;
            data.offerCount = priceManager.getOffers(data.offer.city._id.toString(), data.offer.package.baseItem._id.toString());
            res.status(200).json({ data });
        } catch (error) {
            res.status(500).send(error.message);
        }
    }

    @httpPost("/product/:id")
    public async getProductPackageUpdate(@request() req: express.Request, @response() res: express.Response) {
        console.log("Update pack data");
        try {
            let id = req.params.id;
            let pack = await this.packRepository.update(req.body._id, req.body);
            let offer = await this.productOfferRepository.findById(id);
            res.status(200).json({ data: offer });
        } catch (error) {
            res.status(500).send(error.message);
        }
    }

    @httpGet("/product/:storeId/:offerId")
    public async UpdateStoreInOffer(@request() req: express.Request, @response() res: express.Response) {
        console.log("Update pack data");
        try {
            let storeId = req.params.storeId;
            let offerId = req.params.offerId;
            let offer = await this.productOfferRepository.findById(offerId);
            offer.store = storeId;
            offer.save();
            res.status(200).json({ data: offer });
        } catch (error) {
            res.status(500).send(error.message);
        }
    }

    @httpPost("/product")
    public async setProductPackage(@request() req: express.Request, @response() res: express.Response) {
        console.log("Save Store Offer");
        try {
            let cityId = req.body.city;
            let storeID = req.body.store;
            let pack = req.body.package;
            delete pack._id;
            pack.tmp = true;
            let newPack = await this.packRepository.create(pack);
            let offer = await this.productOfferRepository.create({ store: storeID, city: cityId, package: newPack._id } as IProductOfferModel)
            return res.status(200).json({ data: offer });
        } catch (error) {
            res.status(500).send(error.message);
        }
    }

    @httpGet("/regions")
    public async getRegions(@request() req: express.Request, @response() res: express.Response) {
        console.log("Get regions search data");
        try {
            const startDate = Date.now();
            let article = await (this.articleRepository.retrieve() as any).where({
                articleType: ArticleType.shopInRegion,
                'binding.bindingType': BindingType.region,
                'binding.object': null
            })
            let tmpStore = await StoreModel.aggregate([
                { $unwind: "$delivery" },
                { $match: { adminActive: true, city: { $ne: null } } },
                {
                    $group: {
                        _id: { city: "$delivery.city" },
                    }
                }
            ]);

            tmpStore = tmpStore.map(item => item._id.city);

            let [regions, cities, categories, stores, items] = await Promise.all([
                ((this.regionRepository.retrieve()) as any).select('-seo'),
                ((this.cityRepository.retrieve()) as any).where({ _id: { $in: tmpStore } }).select('-seo -description'),
                ((this.categoryRepository.retrieve()) as any).select('-seo -tagline'),
                ((this.storeRepository.retrieve()) as any).select('-seo -description'),
                ((this.itemRepository.retrieve()) as any).select('-seo -description'),
            ]);
            let tmpCity = [];
            cities.forEach((city: any, index: number) => {
                let result = stores.filter((store: IStoreModel) => {
                    if (store.city) {
                        return store.city.toString() === city._id.toString();
                    }
                    return false;
                });
                cities[index] = city.toObject();
                cities[index].storesCount = result ? result.length : 0;
            });

            let tmpCategory: ICategoryModel[] = [];
            categories.forEach((category: any, index: number) => {
                let result = items.filter((item: IItemModel) => {
                    return item.category.indexOf(category._id) > -1
                });
                categories[index] = category.toObject();
                categories[index].itemsCount = result ? result.length : 0;
                if (!(categories[index].subcategory && categories[index].subcategory.length > 0)) {
                    tmpCategory.push(categories[index]);
                }
            });

            const packagesCount = await PackageModel.count({ tmp: false });
            const dayDealCount = await ItemModel.count({ dayDeal: true });


            console.log(Date.now() - startDate);
            res.status(200).json({ data: { regions: regions, article, cities: cities, categories: tmpCategory, packagesCount: packagesCount, dayDealCount: dayDealCount } });
        } catch (error) {
            res.status(500).send(error.message);
        }
    }

    @httpPost("/order")
    public async setOrder(@request() req: express.Request, @response() res: express.Response) {
        console.log("Save new Order");

        try {
            let order: IOrderModel = req.body;
            let json = JSON.stringify(order);

            if (req.user) {
                // this.deliveryAddressRepository.findById(order.productOffer)
            } else {
                let offer = await this.productOfferRepository.findById(order.productOffer as string);
                let pack = await this.packRepository.findById(offer.package.toString());
                if (offer.city.toString() !== order.deliveryAddress.city as String) {
                    offer.city = order.deliveryAddress.city;
                }
                try {
                    let deliveryDetails = new DeliveryDetailsModel(order.deliveryDetails);
                    let deliveryAddress = new DeliveryAddressModel(order.deliveryAddress);
                    let customerDetails = new CustomerDetailsModel(order.customerDitails);
                    await customerDetails.save();
                    await deliveryAddress.save();
                    await deliveryDetails.save();
                    order.customerDitails = customerDetails._id;
                    order.deliveryAddress = deliveryAddress._id;
                    order.deliveryDetails = deliveryDetails._id;
                    let result = await this.orderRepository.create(order);
                    offer.finished = true;
                    offer = await this.productOfferRepository.update(offer._id, offer);
                    return res.status(200).json({ data: result });
                } catch (error) {
                    return res.status(500).json({ error: error });
                }
            }
        } catch (error) {
            res.status(500).send(error.message);
        }
    }

    @httpGet("/order/:id")
    public async getOrderById(@request() req: express.Request, @response() res: express.Response) {
        const id = req.params.id;
        const order = await (this.orderRepository.findById(id) as any)
            .populate('customerDitails')
            .populate({
                path: 'productOffer',
                populate: {
                    path: 'store'
                }
            })
            .populate({
                path: 'productOffer',
                populate: {
                    path: 'package'
                }
            });
        return res.status(200).json({ data: order });
    }

    @httpGet("/order/history/:id?")
    public async getOrderWithPackageById(@request() req: express.Request, @response() res: express.Response) {
        const id = req.params.id;
        let order = null;
        if (id) {
            order = await (this.orderRepository.findById(id) as any)
                .populate('customerDitails')
                .populate({
                    path: 'productOffer',
                    populate: {
                        path: 'store'
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
                }).populate({
                    path: 'productOffer',
                    populate: {
                        path: 'package',
                        populate: {
                            path: 'addItems'
                        }
                    }
                });
        } else if (req.user) {
            order = await (this.orderRepository.findById(id) as any)
                .populate('customerDitails')
                .populate({
                    path: 'productOffer',
                    populate: {
                        path: 'store'
                    }
                })
                .populate({
                    path: 'productOffer',
                    populate: {
                        path: 'package'
                    }
                });
        }
        return res.status(200).json({ data: order });
    }

    @httpPost('/save-rate/:id')
    public async saveRate(@request() req: express.Request, @response() res: express.Response) {
        const id = req.params.id;
        const rate = await this.rateRepository.create(req.body);
        const order = await (this.orderRepository.findById(id) as any)
            .populate({ path: 'productOffer', populate: { path: 'store' } })
            .populate({ path: 'productOffer', populate: { path: 'package' } });
        const storeID = order.productOffer.store._id;
        const itemID = order.productOffer.package.baseItem;
        const item = await ItemModel.findById(itemID);
        const store = await StoreModel.findById(storeID);
        if (item !== null) {
            if (!item.rate) {
                item.rate = [];
            }
            item.rate.push(rate._id);
            item.save();
        }

        if (store !== null) {
            if (!store.rate) {
                store.rate = [];
            }
            store.rate.push(rate._id);
            store.save();
        }

        return res.json(rate);

    }

    @httpGet('/rate/:type/:id')
    public async getRate(@request() req: express.Request, @response() res: express.Response) {
        const type = +req.params.type;
        const id = req.params.id;
        const offset = +req.query.offset
        const count = +req.query.count;

        let idList;

        if (type === 0) {
            idList = (await (this.itemRepository.findById(id) as any).select('rate'));
        } else {
            idList = await (this.storeRepository.findById(id) as any).select('rate');
        }
        let rates;

        if (!isNaN(offset) && !isNaN(count)) {
            rates = await (this.rateRepository.retrieve() as any).where({ _id: { $in: idList.rate } }).sort('-createdAt').skip(offset).limit(count);
        } else {
            return res.status(500).json({ info: "offset and count is not specified" });
        }

        return res.json(rates);

    }

    @httpGet("/store/byId/:id")
    public async getStoreById(@request() req: express.Request, @response() res: express.Response) {
        console.log("Get store by Id");
        try {
            let link: string = req.params.id;
            let store = await (this.storeRepository.retrieve() as any).where({ ind: link }).populate('rate').populate('city');
            if (store) {
                return res.status(200).json({ data: store });
            } else {
                return res.status(404).send("Store not found");
            }
        } catch (error) {
            res.status(500).send(error.message);
        }
    }

    @httpGet("/store/:link")
    public async setStore(@request() req: express.Request, @response() res: express.Response) {
        console.log("Get store by link");
        try {
            let link: string = req.params.link;
            let store = await (this.storeRepository.retrieve() as any).where({ link: link }).populate('rate').populate('city');
            if (store) {
                return res.status(200).json({ data: store });
            } else {
                return res.status(404).send("Store not found");
            }
        } catch (error) {
            res.status(500).send(error.message);
        }
    }

    @httpGet("/article")
    public async getArticle(@request() req: express.Request, @response() res: express.Response) {
        console.log("Get article data data");
        try {
            let showInList = req.query.showInList;
            let articleType = req.query.articleType;
            let bindingType = req.query.bindingType;
            let articleID = req.query.articleID;
            let last = + req.query.last;
            let id = req.query.id;
            let name = req.query.name;
            let where: any = {};
            if (name !== undefined) {
                let articles = await (this.articleRepository.retrieve() as any).where({ 'header.heb': name });
                if (articles.length > 0) {
                    return res.status(200).json({ data: articles[0] });
                } else {
                    return res.status(404).json({ data: `Article ${name} not found` });
                }
            }
            if (articleID !== undefined) {
                let article = await (this.articleRepository.findById(articleID));
                return res.status(200).json({ data: article });
            }
            if (!isNaN(last) && last !== undefined) {
                let articles = await (this.articleRepository.retrieve() as any).where({ showInList: true }).sort({ created_At: 'desc' }).limit(last);
                return res.status(200).json({ data: articles });
            }
            if (showInList !== undefined) {
                where.showInList = showInList;
            }
            if (articleType !== undefined) {
                where.articleType = articleType;
            }
            if (bindingType !== undefined && id !== undefined) {
                where.binding = {};
                where.binding.bindingType = bindingType;
                where.binding.object = id;
            }
            let articleList;
            if (Object.keys(where).length === 0) {
                articleList = await (this.articleRepository.retrieve() as any);
            } else {
                articleList = await (this.articleRepository.retrieve() as any).where(where);
            }
            return res.status(200).json({ data: articleList });
        } catch (e) {
            res.status(500).send(e.message);
        }
    }

    @httpGet("/cities")
    public async getCities(@request() req: express.Request, @response() res: express.Response) {
        let cities: any = await (this.cityRepository.retrieve() as any).select("-country -description -region -seo");

        let stores = StoreModel.aggregate([
            { $unwind: "$items" },
            { $match: { adminActive: true, city: { $ne: null }, "items.price": { $gt: 80 } } },
            {
                $group: {
                    _id: { city: "$city" },
                    minPrice: { $min: "$items.price" },
                    maxPrice: { $max: "$items.price" }
                }
            }
        ]);
        let st = StoreModel.aggregate([
            { $match: { adminActive: true, city: { $ne: null } } },
            { $unwind: "$delivery" },
            {
                $group: {
                    _id: { city: "$delivery.city" },
                    count: { $sum: 1 },
                }
            }
        ]);
        let [result1, result2] = await Promise.all([stores, st])
        cities.forEach((city: any, index: number) => {
            cities[index] = city.toObject();
            let tmp = result2.find(item => item._id.city.equals(cities[index]._id));
            if (tmp) {
                cities[index].storeCount = tmp.count;
            }
            tmp = result1.find(item => item._id.city.equals(cities[index]._id))
            if (tmp) {
                cities[index].minPrice = tmp.minPrice;
                cities[index].maxPrice = tmp.maxPrice;
            }
        });
        return res.status(200).json({ data: cities });
    }

    @httpGet("/cheapest-delivery-store/:cityId")
    public async getCheapestOfferStore(@request() req: express.Request, @response() res: express.Response) {
        let cityId = req.params.cityId;
        let stores = await (this.storeRepository.retrieve() as any).where('delivery.city').equals(cityId);
        let store: any = null;
        let neededStores: Array<any> = [];
        stores.forEach((element: any) => {
            if (store) {
                element.delivery.forEach((offer: any) => {
                    let index: number = -1;
                    if (offer.city.toString() === cityId) {
                        for (let i = 0; i < store.delivery.length; i++) {
                            if (store.delivery[i].city.toString() === cityId) {
                                index = i;
                                break;
                            }
                        }
                        if (store.delivery[index].price > offer.price) {
                            store = element;
                        }
                    }
                });
            } else {
                store = element;
            }
        });
        return res.json({ store: store });
    }

    // registration and login start ------------------------------------------------------------------------------------------
    @httpPost("/registration")
    public async registration(@request() req: express.Request, @response() res: express.Response) {
        let user = req.body as IUserModel;
        if (user.password !== (user as any).rePassword) {
            return res.status(500).json({ error: "messages.notEqualsPasswords" })
        }
        user.token = v1();
        const tmp = await this.userRepository.findByEmail(user.mail);
        if (!tmp) {
            return res.status(500).json({ error: 'messages.userExists' });
        }

        user = await this.userRepository.create(user);
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: Constants.mail.login,
                pass: Constants.mail.password
            }
        });

        const mailOptions = {
            from: Constants.mail.login, // sender address
            to: user.mail, // list of receivers
            subject: RegistrationMail.title(Constants.siteName), // Subject line
            html: RegistrationMail.content(
                user.mail.split('@')[0],
                `${Constants.urlProtocol}${Constants.host}/api/v1/content/approve/${user.token}`,
                user.mail,
                `${Constants.ui_url}/faq`,
                Constants.ui_url
            )
        };

        transporter.sendMail(mailOptions, function (err, info) {
            if (err)
                console.log(err)
            else
                console.log(info);
        });

        return res.status(200).json({ data: user });
    }

    @httpGet("/approve/:token")
    public async registrationApprove(@request() req: express.Request, @response() res: express.Response) {
        let token = req.params.token;

        let user = await (this.userRepository.retrieve() as any).where({ token: token });
        try {
            if (user[0]) {
                user[0].active = true;
                user[0].token = '';
                await this.userRepository.update(user[0]._id, user[0])
            }

            return res.redirect(Constants.ui_url);
        } catch (error) {
            return res.status(500).json(error);
        }

    }

    @httpPost("/login")
    public async login(@request() req: express.Request, @response() res: express.Response) {
        console.log("Post request of login controller");
        try {
            const email: string = req.body.mail;
            const password: string = req.body.password;
            const user = await this.userRepository.findByEmail(email);
            if (!user) {
                throw new Error("User not found");
            }
            const isMatch = await user.comparePassword(password, user.password);
            if (isMatch) {
                user.password = "";
                let token = jwt.sign(user.toObject(), Constants.JWT_SECRET, { expiresIn: Constants.JWT_EXPAIRE_TIME });
                res.json({ token: "JWT " + token, user: user });
            } else {
                return { success: false, info: "Password does not match" };
            }
        } catch (error) {
            res.status(500).send(error.message);
        }
    }

    @httpPost("/social-login/:provider")
    public async socialLogin(@request() req: express.Request, @response() res: express.Response) {
        let provider = req.params.provider;
        if (req) {
            try {
                let result = await middlewareToPromise((req as any).passport.authenticate(`${provider}-token`, { session: false }), req, res); // Authenticate using the provider suitable (google-token, facebook-token)
                if (req.user) {
                    let user = req.user;
                    user.password = "";
                    let token = jwt.sign(user.toObject(), Constants.JWT_SECRET, { expiresIn: Constants.JWT_EXPAIRE_TIME });
                    res.json({ token: "JWT " + token, user: user });
                } else {
                    throw result;
                }
            } catch (error) {
                return res.status(500).json({ error: error.message });
            }
        }
    }

    // registration and login end ------------------------------------------------------------------------------------------

    @httpGet("/remove-tmp-offers")
    private async removeTmpOffers(@request() req: express.Request, @response() res: express.Response) {
        let offers = await (this.productOfferRepository.retrieve() as any).where({ finished: false, createdAt: { $lt: this.oneMonthFromNow() } });
        // site.deleteMany({ userUID: uid, id: { $in: [10, 2, 3, 5]}}, function(err) {})
        res.json({ data: offers });
    }

    private oneMonthFromNow() {
        let d = new Date();
        let targetMonth = d.getMonth() - 1;
        d.setMonth(targetMonth);
        if (d.getMonth() !== targetMonth % 12) {
            d.setDate(0);
        }
        return d;
    }

    @httpGet("/get-item-banner-data")
    public async getItemBannersData(@request() req: express.Request, @response() res: express.Response) {
        let cityName = req.query.city;
        let city: any = null;
        if (cityName) {
            city = await (this.cityRepository.retrieve() as any).where({ 'name.heb': cityName.split("_").join(" ") }).select('-country -pic -region -seo');
            if (city.length === 1) {
                city = city[0];
            }
        }

        let rateManager = RateManager.getInstance();
        let priceManager = PriceManagement.getInstance();
        let recommended = (await (this.itemRepository.retrieve() as any).where('recommended').equals(true).limit(4).select("-rate -seo -description")).map((item: any) => item.toObject());
        recommended.map((item: IItemModel) => {
            item.reviewsCount = rateManager.findBouquetReviewCount(item._id);
            item.rating = rateManager.findBouquetRate(item._id);
            const price = priceManager.getAllOffersPrice(item._id.toString());
            if (price) {
                item.minPrice = price.minPrice;
                item.maxPrice = price.maxPrice;
                item.offerCount = price.offerCount;
            }
            return item;
        });

        let mostSaled = await ItemModel.aggregate([{ $unwind: "$rate" }, { $group: { _id: "$_id", count: { $sum: 1 } } }, { $sort: { count: -1 } }, { $limit: 4 }]);
        let mostSaledResult = await ItemModel.populate(mostSaled, { path: "_id", select: "-rate -seo -description" });
        mostSaledResult = mostSaledResult.map(item => item._id.toObject());
        mostSaledResult = mostSaledResult.map((item: IItemModel) => {
            item.reviewsCount = rateManager.findBouquetReviewCount(item._id);
            item.rating = rateManager.findBouquetRate(item._id);
            const price = priceManager.getAllOffersPrice(item._id.toString());
            if (price) {
                item.minPrice = price.minPrice;
                item.maxPrice = price.maxPrice;
                item.offerCount = price.offerCount;
            }
            return item;
        });
        let prices: any = [];
        if (cityName) {
            recommended.forEach((item: any) => {
                prices.push(priceManager.getOffers(city._id.toString(), item._id.toString()));
            });

            mostSaledResult.forEach((item: any) => {
                prices.push(priceManager.getOffers(city._id.toString(), item._id.toString()));
            });
        } else {
            let itemIDList: any[] = []
            recommended.forEach((item: any) => {
                itemIDList.push(item._id);
            });
            mostSaledResult.forEach((item: any) => {
                itemIDList.push(item._id);
            });
        }

        res.status(200).json({ recommended, mostSaled: mostSaledResult, city });
    }

    @httpGet("/get-review")
    public async getReview(@request() req: express.Request, @response() res: express.Response) {
        let length = await RateModel.countDocuments();
        let items = (await this.itemRepository.retrieve()).map(item => item._id);
        let cityName = req.query.city;
        let priceManager = PriceManagement.getInstance();
        let rateManager = RateManager.getInstance();
        let city: any = null;
        if (cityName) {
            city = await (this.cityRepository.retrieve() as any).where({ 'name.heb': cityName.split("_").join(" ") }).select('-country -pic -region -seo');
            if (city.length === 1) {
                city = city[0];
            }
        }
        let random, reviews;
        random = Math.floor(Math.random() * length);
        random = random + 15 > length ? random - 15 : random;

        if (city !== null) {
            reviews = await RateModel.find({ approved: true, rate: { $gte: 4 }, item: { $in: items }, city: city._id.toString() }).skip(random).populate('city').populate('item').where({ 'city': { $ne: null }, 'item': { $ne: null } }).limit(15);
        } else {
            reviews = await RateModel.find({ approved: true, rate: { $gte: 4 }, item: { $in: items } }).skip(random).populate('city').populate('item').limit(15);
        }

        try {
            reviews = reviews.map((review: any) => {
                review = review.toObject();
                review.item.reviewsCount = rateManager.findBouquetReviewCount(review.item._id);
                review.item.rating = rateManager.findBouquetRate(review.item._id);
                review.item.description = {};
                review.item.seo = [];
                review.item.rate = [];
                review.city.description = {};
                review.city.seo = [];
                review.price = priceManager.getOffers(review.city._id.toString(), review.item._id.toString())
                let tmp = review.fullName.split(' ');
                review.fullName = tmp[0];
                return review;
            });
        } catch (error) {
            return res.status(500).send(error.message);
        }
        return res.status(200).json({ reviews });
    }

    @httpPost("/get-card")
    public async getCard(@request() req: express.Request, @response() res: express.Response) {
        let card = req.body;
        card = card.map((item: any) => item.offer);
        try {
            let data: any = {};
            let rateManager = RateManager.getInstance();
            let priceManager = PriceManagement.getInstance();
            data.offer = await (this.productOfferRepository.retrieve() as any).where({ _id: { $in: card } })
                .populate({
                    path: 'store',
                    populate: {
                        path: "items.item"
                    }
                })
                .populate({
                    path: 'store',
                })
                .populate('city', 'name')
                .populate({
                    path: 'package',
                    populate: {
                        path: "baseItem"
                    }
                });
            for (let i = 0; i < data.length; i++) {
                data[i].offer = data.offer.toObject();
                data[i].offer.store.rate = [];
                data[i].offer.store.seo = {};
                data[i].offer.store.reviewsCount = rateManager.findStoreReviewCount(data[i].offer.store._id);
                data[i].offer.store.rating = rateManager.findStoreRate(data[i].offer.store._id);
                data[i].offer.package.baseItem.rate = [];
                data[i].offer.package.baseItem.reviewsCount = rateManager.findBouquetReviewCount(data[i].offer.package.baseItem._id);
                data[i].offer.package.baseItem.rating = rateManager.findBouquetRate(data.offer.package.baseItem._id);
            }

            res.status(200).json({ data });
        } catch (error) {
            res.status(500).send(error.message);
        }
    }

    @httpGet("/get-item-info/:itemName/:cityName?")
    public async getItemInformation(@request() req: express.Request, @response() res: express.Response) {
        try {
            let itemName = req.params.itemName.replace(/_/g, ' ');
            let cityName = req.params.cityName;
            let item;
            let city;
            cityName = cityName ? cityName.replace(/_/g, ' ') : cityName;
            let rateManager = RateManager.getInstance();
            let priceManager = PriceManagement.getInstance();
            if (cityName) {
                city = await (this.cityRepository.retrieve() as any).where({ 'name.heb': cityName }).select('-seo -description -country -region');
                city = city.length > 0 ? city[0] : city;
                city = city.toObject();
            }
            item = await (this.itemRepository.retrieve() as any).where({ 'name.heb': itemName });
            item = item.length > 0 ? item[0] : item;
            item = item.toObject();
            item.reviewsCount = rateManager.findBouquetReviewCount(item._id);
            item.rating = rateManager.findBouquetRate(item._id);
            let price;
            if(city){
                price = priceManager.getOffers(city._id.toString(), item._id.toString());
            }else{
                price = priceManager.getAllOffersPrice(item._id.toString());
            }
            if (price) {
                item.minPrice = price.minPrice;
                item.maxPrice = price.maxPrice;
                item.offerCount = price.offerCount;
            }
            if(city){
                res.status(200).json({ item, city });
            }else{
                res.status(200).json({ item });
            }
        } catch (error) {
            res.status(500).send(error.message);
        }
    }

    @httpPost("/story-call/:phone")
    public async callToStore(@request() req: express.Request, @response() res: express.Response) {
        debugger;
        let offer = req.body;
        let phone = req.params.phone;
        this.productOfferRepository // ProductOfferRepository
        // $base_url = "http://[MASKYOO_URL]/api/?";
        let base_url = `http://maskyoo.co.il/hashve_new/api/?service=create_maskyoo_call&destination=${phone}&maskyoo=972776670500&first_target=destination&format=json`;
	    
        try {
            let data: any = {};
            data.service = "create_maskyoo_call";
            data.destination = "972527272084";
            data.maskyoo = "972776670500";
            data.first_target = "destination";
            data.format = "json";
            http.get(base_url, (error: any, resp: any, body: any) => {
                console.log(error);
                console.log(resp);
                console.log(body);
            });
            res.json({hello: "Hello World"});
        } catch (error) {
            res.status(500).send(error.message);
        }
    }
}

