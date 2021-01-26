import * as path from "path";

export class Constants{
    // static DB_CONNECTION_STRING: string = "mongodb://localhost/hashve";
    static DB_CONNECTION_STRING: string = "127.0.0.1/bac";
    static JWT_SECRET: string = "my super secret key";
    static JWT_EXPAIRE_TIME: number = 60000;
    static FACEBOOK = {
        APP_ID: "",
        APP_SECRET: ""
    };
    static GOOGLE = {
        APP_ID: "",
    };
    static PUBLIC_PATH: string = path.join(__dirname, "../../../public/");
    // static urlProtocol: string = "https://";
    static urlProtocol: string = "http://";
    // static host: string = "localhost:3000";
    static host: string = "";
    static ui_url: string = "";
    static siteName: string = "";
    // static ui_url: string = "zerba.co.il";
    static mail: any = {
        login: "",
        password: ""
    };
    static AVATARS: string = "assets/avatars/";
    static ITEMS: string = "assets/items/";
    static CITY: string = "assets/city/";
    static ARTICLES: string = "assets/articles/";
    static CATEGORY: string = "assets/category/";
    static STORE: string = "assets/store/";
    static REGION: string = "assets/region/";
    static BANNERS: string = "assets/banners/";
    static MAIL_PATH: string = "mails/";
    static option: any = {
        socketTimeoutMS: 30000,
        keepAlive: true,
        useNewUrlParser: true,
        reconnectTries: 30000
    };
}
