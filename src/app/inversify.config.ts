import "reflect-metadata";
import { Container } from "inversify";
import {TYPES} from "../config/constant/types";
import {IUser, UserModel} from "./model/User";
import {UserRepository} from "./repository/user.repository";
import { ICountry, CountryModel } from "./model/Country";
import { CountryRepository } from "./repository/country.repository";
import { IRegion, RegionModel } from "./model/Region";
import { RegionRepository } from "./repository/region.repository";
import { ICity, CityModel } from "./model/City";
import { CityRepository } from "./repository/city.repository";
import { UserService } from "./services/UserService";
import { ItemRepository } from "./repository/item.repository";
import { IItem, ItemModel } from "./model/Item";
import { ICategory, CategoryModel } from "./model/Category";
import { CategoryRepository } from "./repository/category.repository";
import { PackageRepository } from "./repository/package.repository";
import { StoreRepository } from './repository/store.repository';
import { OrderRepository } from './repository/order.repository';
import { ProductOfferRepository } from './repository/product.offer.repository';
import { DeliveryAddressRepository } from './repository/delivery.adderess.repository';
import { RateRepository } from './repository/rate.repository';
import { ArticleRepository } from './repository/article.repository';

let zooContainer = new Container();

zooContainer.bind<IUser>(TYPES.IUser).to(UserModel);
zooContainer.bind<ICountry>(TYPES.ICountry).to(CountryModel);
zooContainer.bind<IRegion>(TYPES.IRegion).to(RegionModel);
zooContainer.bind<ICity>(TYPES.ICity).to(CityModel);
zooContainer.bind<IItem>(TYPES.ICity).to(ItemModel);
zooContainer.bind<ICategory>(TYPES.ICity).to(CategoryModel);
zooContainer.bind<UserRepository>(TYPES.UserRepository).to(UserRepository);
zooContainer.bind<CountryRepository>(TYPES.CountryRepository).to(CountryRepository);
zooContainer.bind<RegionRepository>(TYPES.RegionRepository).to(RegionRepository);
zooContainer.bind<CityRepository>(TYPES.CityRepository).to(CityRepository);
zooContainer.bind<ItemRepository>(TYPES.ItemRepository).to(ItemRepository);
zooContainer.bind<CategoryRepository>(TYPES.CategoryRepository).to(CategoryRepository);
zooContainer.bind<PackageRepository>(TYPES.PackegeRepository).to(PackageRepository);
zooContainer.bind<StoreRepository>(TYPES.StoreRepository).to(StoreRepository);
zooContainer.bind<ProductOfferRepository>(TYPES.ProductOfferRepository).to(ProductOfferRepository);
zooContainer.bind<OrderRepository>(TYPES.OrderRepository).to(OrderRepository);
zooContainer.bind<DeliveryAddressRepository>(TYPES.DeliveryAddressRepository).to(DeliveryAddressRepository);
zooContainer.bind<RateRepository>(TYPES.RateRepository).to(RateRepository);
zooContainer.bind<ArticleRepository>(TYPES.ArticleRepository).to(ArticleRepository);


zooContainer.bind<UserService>(TYPES.UserService).to(UserService);

export {zooContainer};
