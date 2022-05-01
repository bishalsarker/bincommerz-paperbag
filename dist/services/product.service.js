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
exports.ProductService = void 0;
const api_endpoints_1 = require("../constants/api-endpoints");
const http_util_1 = require("../utils/http.util");
const resolvers_util_1 = require("../utils/resolvers.util");
class ProductService {
    constructor() {
        this._httpClient = new http_util_1.HttpClient();
        this._resolvers = new resolvers_util_1.Resolvers();
    }
    getProducts(shop_id, cat_slug, sort_by, keyword, page_size, page_number) {
        return __awaiter(this, void 0, void 0, function* () {
            let url = `${api_endpoints_1.api_endpoints.get_all_products}`;
            let parameters = [];
            if (cat_slug) {
                parameters.push('cat_slug=' + cat_slug);
            }
            if (keyword) {
                parameters.push('keyword=' + keyword);
            }
            if (sort_by) {
                parameters.push('sort_by=' + sort_by);
            }
            parameters.push('page_size=' + page_size);
            parameters.push('page_number=' + page_number);
            url = url + parameters.join('&');
            const response = yield this._httpClient.get(url, shop_id);
            let resolved_response = [];
            if (response) {
                resolved_response = response.products.map((p) => {
                    if (p.discount > 0) {
                        p.oldPrice = p.price;
                        p.price = p.discount;
                    }
                    return this._resolvers.resolveImageUrl(p, ["imageUrl"]);
                });
                response.products = resolved_response;
            }
            return Promise.resolve(response);
        });
    }
    getProduct(product_id, shop_id) {
        return __awaiter(this, void 0, void 0, function* () {
            let product = yield this._httpClient.get(api_endpoints_1.api_endpoints.get_product_details + product_id, shop_id);
            if (product) {
                if (product.discount > 0) {
                    product.oldPrice = product.price;
                    product.price = product.discount;
                }
                const resolved_item = this._resolvers.resolveImageUrl(product, ["imageUrl"]);
                resolved_item.images = resolved_item.images.map((i) => {
                    return this._resolvers.resolveImageUrl(i, ["originalImage", "thumbnailImage"]);
                });
                return Promise.resolve(resolved_item);
            }
            return Promise.resolve(null);
        });
    }
    getProductsByKeyword(query, shop_id) {
        return __awaiter(this, void 0, void 0, function* () {
            let url = `${api_endpoints_1.api_endpoints.search_products}${query}`;
            const response = yield this._httpClient.get(url, shop_id);
            let resolved_response = [];
            if (response) {
                resolved_response = response.map((p) => {
                    return this._resolvers.resolveImageUrl(p, ["imageUrl"]);
                });
            }
            return Promise.resolve(resolved_response);
        });
    }
    getSimilarProducts(productId, shop_id) {
        return __awaiter(this, void 0, void 0, function* () {
            let url = `${api_endpoints_1.api_endpoints.get_similar_products}${productId}`;
            const response = yield this._httpClient.get(url, shop_id);
            let resolved_response = [];
            if (response) {
                resolved_response = response.map((p) => {
                    return this._resolvers.resolveImageUrl(p, ["imageUrl"]);
                });
            }
            return Promise.resolve(resolved_response);
        });
    }
}
exports.ProductService = ProductService;
