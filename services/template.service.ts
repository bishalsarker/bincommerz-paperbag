import { api_endpoints } from "../constants/api-endpoints";
import { HttpClient } from "../utils/http.util";
import { CategoryService } from "./category.service";
import { ProductService } from "./product.service";
import * as _ from 'lodash';
import { TemplateItem } from "../interfaces/template";
import { Resolvers } from "../utils/resolvers.util";

export class TemplateService {
    private _productService: ProductService;
    private _categoryService: CategoryService;
    private _httpClient = new HttpClient();
    private _resolvers = new Resolvers();

    constructor(productService: ProductService, categoryService: CategoryService) {
        this._productService = productService;
        this._categoryService = categoryService;
    }

    public async resolveTemplate(shop_id: string): Promise<TemplateItem[]> {
        const template = await this.getTemplate(shop_id);
        let content = JSON.stringify([ { row_number: 1 } ]);

        if (template) {
            content = template.content
        }

        const parsed_template = JSON.parse(content);
        const sorted_rows = _.orderBy(parsed_template, ['row_number'], ['asc']);

        const resolved_template: TemplateItem[] = [];

        let i = 0;
        while (i < sorted_rows.length) {
            const row = sorted_rows[i];
            let data, section_type, title;

            if (row['type'] === "slider") {
                section_type = "slider";
                data = await this.getSlider(row['resolve'], shop_id)
            }

            if (row['type'] === "banner") {
                section_type = "banner";
                const resolvedBanner = await this.getSlider(row['resolve'], shop_id);
                data = resolvedBanner;
                data["slides_count"] = resolvedBanner.slides.length
            }

            if (row['type'] == "section") {
                title = row['resolve']['title'] ? row['resolve']['title'] : '';

                if (row['resolve']['type'] == 'category') {
                    section_type = 'category_section'
                    data = await this._categoryService.getCategories(shop_id)
                }
                
                if (row['resolve']['type'] == 'product') {
                    section_type = 'product_section'
                    data = {
                        'slug': row['resolve']['value'],
                        "products": (await this._productService.getProducts(shop_id, row['resolve']['value'], 'newest', undefined, "4", "1"))?.products
                    }
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
    }

    private async getSlider(slider_id: String, shop_id: string): Promise<any> {
        const slider = await this._httpClient.get<any>(api_endpoints.get_slider + slider_id, shop_id);
            
        const resolved_slides = slider.slides.map((slide: any) => {
            slide['default'] = false;     
            return this._resolvers.resolveImageUrl(slide, ["imageURL"]);
        })

        if (resolved_slides.length > 0) {
            resolved_slides[0].default = true;
        }
        
        slider["slides"] = resolved_slides

        return slider;
            
    }

    private async getTemplate(shop_id: string): Promise<any> {
        return await this._httpClient.get<any>(api_endpoints.get_template, shop_id);
    }
}