import { api_endpoints } from "../constants/api-endpoints";
import { Category } from "../interfaces/category";
import { HttpClient } from "../utils/http.util";
import { Resolvers } from "../utils/resolvers.util";

export class CategoryService {
    private _httpClient = new HttpClient();
    private _resolvers = new Resolvers();
    
    public async getCategories(): Promise<Category[] | null> {
        const categories = await this._httpClient.get<Category[]>(api_endpoints.get_categories);
        let resolved_categories: Category[] = [];

        if (categories) {
            resolved_categories = categories.map((cat) => {
                return this._resolvers.resolveImageUrl(cat, ["imageUrl"]);
            });
        }

        return Promise.resolve(resolved_categories);
    }

    public async getCategory(slug: String): Promise<Category | null> {
        return await this._httpClient.get<Category>(`${api_endpoints.get_category}/${slug}`);
    }
}