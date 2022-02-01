import { api_endpoints } from "../constants/api-endpoints";
import { PaginationResponse } from "../interfaces/pagination-response";
import { Product } from "../interfaces/product";
import { HttpClient } from "../utils/http.util";
import { Resolvers } from "../utils/resolvers.util";

export class ProductService {
    private _httpClient = new HttpClient();
    private _resolvers = new Resolvers();

    public async getProducts(
        cat_slug: String, sort_by: String, keyword?: String,
        page_size?: String, page_number?: String): Promise<PaginationResponse | null> {
            
        let url = `${api_endpoints.get_all_products}`;
        let parameters = [];

        if (cat_slug){
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

        console.log(url)
            
        const response = await this._httpClient.get<PaginationResponse>(url);
        let resolved_response: any[] = [];
        if (response) {
            resolved_response = response.products.map((p) => {
                return this._resolvers.resolveImageUrl(p, ["imageUrl"]);
            });

            response.products = resolved_response;
        }

        return Promise.resolve(response);
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