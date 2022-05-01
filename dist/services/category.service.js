"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.CategoryService = void 0;
const api_endpoints_1 = require("../constants/api-endpoints");
const http_util_1 = require("../utils/http.util");
const resolvers_util_1 = require("../utils/resolvers.util");
const _ = __importStar(require("lodash"));
class CategoryService {
    constructor() {
        this._httpClient = new http_util_1.HttpClient();
        this._resolvers = new resolvers_util_1.Resolvers();
    }
    getCategories(shop_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const categories = yield this._httpClient.get(api_endpoints_1.api_endpoints.get_categories, shop_id);
            let resolved_categories = [];
            if (categories) {
                categories.forEach((cat) => {
                    const resolved_cat = this._resolvers.resolveImageUrl(cat, ["imageUrl"]);
                    if (resolved_cat) {
                        resolved_categories.push(resolved_cat);
                    }
                });
            }
            return Promise.resolve(_.orderBy(resolved_categories, ['order'], ['asc']));
        });
    }
    getCategory(slug, shop_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._httpClient.get(`${api_endpoints_1.api_endpoints.get_category}/${slug}`, shop_id);
        });
    }
}
exports.CategoryService = CategoryService;
