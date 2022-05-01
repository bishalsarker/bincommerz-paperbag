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
exports.TemplateService = void 0;
const api_endpoints_1 = require("../constants/api-endpoints");
const http_util_1 = require("../utils/http.util");
const _ = __importStar(require("lodash"));
const resolvers_util_1 = require("../utils/resolvers.util");
class TemplateService {
    constructor(productService, categoryService) {
        this._httpClient = new http_util_1.HttpClient();
        this._resolvers = new resolvers_util_1.Resolvers();
        this._productService = productService;
        this._categoryService = categoryService;
    }
    resolveTemplate(shop_id) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const template = yield this.getTemplate(shop_id);
            const parsed_template = JSON.parse(template.content);
            const sorted_rows = _.orderBy(parsed_template, ['row_number'], ['asc']);
            const resolved_template = [];
            let i = 0;
            while (i < sorted_rows.length) {
                const row = sorted_rows[i];
                let data, section_type, title;
                if (row['type'] === "slider") {
                    section_type = "slider";
                    data = yield this.getSlider(row['resolve'], shop_id);
                }
                if (row['type'] === "banner") {
                    section_type = "banner";
                    const resolvedBanner = yield this.getSlider(row['resolve'], shop_id);
                    data = resolvedBanner;
                    data["slides_count"] = resolvedBanner.slides.length;
                }
                if (row['type'] == "section") {
                    title = row['resolve']['title'] ? row['resolve']['title'] : '';
                    if (row['resolve']['type'] == 'category') {
                        section_type = 'category_section';
                        data = yield this._categoryService.getCategories(shop_id);
                    }
                    if (row['resolve']['type'] == 'product') {
                        section_type = 'product_section';
                        data = {
                            'slug': row['resolve']['value'],
                            "products": (_a = (yield this._productService.getProducts(shop_id, row['resolve']['value'], 'newest', undefined, "4", "1"))) === null || _a === void 0 ? void 0 : _a.products
                        };
                    }
                }
                if (data && section_type) {
                    resolved_template.push({
                        type: section_type,
                        data: data,
                        title: title,
                    });
                }
                i++;
            }
            return Promise.resolve(resolved_template);
        });
    }
    getSlider(slider_id, shop_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const slider = yield this._httpClient.get(api_endpoints_1.api_endpoints.get_slider + slider_id, shop_id);
            const resolved_slides = slider.slides.map((slide) => {
                slide['default'] = false;
                return this._resolvers.resolveImageUrl(slide, ["imageURL"]);
            });
            if (resolved_slides.length > 0) {
                resolved_slides[0].default = true;
            }
            slider["slides"] = resolved_slides;
            return slider;
        });
    }
    getTemplate(shop_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._httpClient.get(api_endpoints_1.api_endpoints.get_template, shop_id);
        });
    }
}
exports.TemplateService = TemplateService;
