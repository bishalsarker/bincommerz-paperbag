"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShopService = void 0;
const api_endpoints_1 = require("../constants/api-endpoints");
const http_util_1 = require("../utils/http.util");
const resolvers_util_1 = require("../utils/resolvers.util");
class ShopService {
    constructor() {
        this._httpClient = new http_util_1.HttpClient();
        this._resolvers = new resolvers_util_1.Resolvers();
    }
    getShopInfo(shop_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const shop_info = yield this._httpClient.get(api_endpoints_1.api_endpoints.shop_info, shop_id);
            const resolved_shop_info = this._resolvers.resolveImageUrl(shop_info, ["logo"]);
            return resolved_shop_info;
        });
    }
}
exports.ShopService = ShopService;
