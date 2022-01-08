import { social_links } from "../constants/social-links";
import { CategoryService } from "./category.service";
import { PageService } from "./page.service";
import { ShopService } from "./shop.service";

export class LayoutService {
    private _categroryService: CategoryService;
    private _pageService: PageService;
    private _shopService: ShopService;

    constructor(
        categroryService: CategoryService, 
        pageService: PageService,
        shopService: ShopService) {
        this._categroryService = categroryService;
        this._pageService = pageService;
        this._shopService = shopService;
    }

    public async resolveLayout(): Promise<any> {
        const categories = await this._categroryService.getCategories();
        const pages = await this._pageService.getPages();

        const nav_items = {
            shown: categories,
            hidden: categories,
            pages: pages?.navLink
        }

        const footer_items = {
            social_links: social_links,
            pages: {
                support: pages?.support,
                about: pages?.about,
                faq: pages?.faq
            }
        }

        return Promise.resolve({
            nav_items: nav_items, 
            footer_items: footer_items, 
            shop_info: await this._shopService.getShopInfo()
        });
    }
}