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
exports.LayoutService = void 0;
const social_links_1 = require("../constants/social-links");
class LayoutService {
    constructor(categroryService, pageService, shopService) {
        this._categroryService = categroryService;
        this._pageService = pageService;
        this._shopService = shopService;
    }
    resolveLayout(shop_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const categories = yield this._categroryService.getCategories(shop_id);
            const pages = yield this._pageService.getPages(shop_id);
            const nav_items = {
                shown: categories,
                hidden: categories,
                pages: pages === null || pages === void 0 ? void 0 : pages.navLink
            };
            const footer_items = {
                social_links: social_links_1.social_links,
                pages: {
                    support: pages === null || pages === void 0 ? void 0 : pages.support,
                    about: pages === null || pages === void 0 ? void 0 : pages.about,
                    faq: pages === null || pages === void 0 ? void 0 : pages.faq
                }
            };
            return Promise.resolve({
                nav_items: nav_items,
                footer_items: footer_items,
                shop_info: yield this._shopService.getShopInfo(shop_id)
            });
        });
    }
}
exports.LayoutService = LayoutService;
