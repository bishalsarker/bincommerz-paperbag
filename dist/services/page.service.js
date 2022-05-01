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
exports.PageService = void 0;
const api_endpoints_1 = require("../constants/api-endpoints");
const http_util_1 = require("../utils/http.util");
class PageService {
    constructor() {
        this._httpClient = new http_util_1.HttpClient();
    }
    getPages(shop_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._httpClient.get(api_endpoints_1.api_endpoints.get_pages, shop_id);
        });
    }
    getPage(type, slug, shop_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._httpClient.get(`${api_endpoints_1.api_endpoints.get_page}?cat=${type}&slug=${slug}`, shop_id);
        });
    }
}
exports.PageService = PageService;
