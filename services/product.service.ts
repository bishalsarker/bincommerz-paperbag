import { api_endpoints } from "../constants/api-endpoints";
import { Product } from "../interfaces/product";
import { HttpClient } from "../utils/http.util";
import { Resolvers } from "../utils/resolvers.util";

export class ProductService {
    private _httpClient = new HttpClient();
    private _resolvers = new Resolvers();

    public async getProducts(cat_slug: String, sort_by: String): Promise<Product[] | null> {
        let url = `${api_endpoints.get_all_products}`;

        if (cat_slug){
            url = url + 'cat_slug=' + cat_slug + '&';
        }
            
        if (sort_by) {
            url = url + 'sort_by=' + sort_by
        }
            
        const response = await this._httpClient.get<Product[]>(url);
        let resolved_response: any[] = [];
        if (response) {
            resolved_response = response.map((p) => {
                return this._resolvers.resolveImageUrl(p, ["imageUrl"]);
            });
        }

        return Promise.resolve(resolved_response);
    }

    public async getProduct(product_id: String): Promise<Product | null> {
        let product = await this._httpClient.get<Product>(api_endpoints.get_product_details + product_id);

        if (product) {
            const resolved_item = this._resolvers.resolveImageUrl(product, ["imageUrl"]) as Product;
            resolved_item.images = resolved_item.images.map((i) => {
                return this._resolvers.resolveImageUrl(i, ["originalImage", "thumbnailImage"])
            })
            
            return Promise.resolve(resolved_item);
        }
        
    
        return Promise.resolve(null);
    }

    public async getProductsByKeyword(query: String): Promise<Product[] | null> {
        let url = `${api_endpoints.search_products}${query}`;
            
        const response = await this._httpClient.get<Product[]>(url);
        let resolved_response: any[] = [];
        if (response) {
            resolved_response = response.map((p) => {
                return this._resolvers.resolveImageUrl(p, ["imageUrl"]);
            });
        }

        return Promise.resolve(resolved_response);
    }
} 