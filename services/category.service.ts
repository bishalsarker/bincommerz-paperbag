import { api_endpoints } from "../constants/api-endpoints";
import { Category } from "../interfaces/category";
import { HttpClient } from "../utils/http.util";
import { Resolvers } from "../utils/resolvers.util";
import * as _ from 'lodash';

export class CategoryService {
    private _httpClient = new HttpClient();
    private _resolvers = new Resolvers();
    
    public async getCategories(): Promise<Category[] | null> {
        const categories = await this._httpClient.get<Category[]>(api_endpoints.get_categories);
        let resolved_categories: Category[] = [];

        if (categories) {
             categories.forEach((cat) => {
                const resolved_cat = this._resolvers.resolveImageUrl(cat, ["imageUrl"]);
                if (resolved_cat) {
                    resolved_categories.push(resolved_cat);
                }
            });
        }

        return Promise.resolve(_.orderBy(resolved_categories, ['order'], ['asc']));
    }

    public async getCategory(slug: String): Promise<Category | null> {
        return await this._httpClient.get<Category>(`${api_endpoints.get_category}/${slug}`);
    }
}