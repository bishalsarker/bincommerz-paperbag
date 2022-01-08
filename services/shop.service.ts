import { api_endpoints } from "../constants/api-endpoints";
import { HttpClient } from "../utils/http.util";
import { Resolvers } from "../utils/resolvers.util";

export class ShopService {
    private _httpClient = new HttpClient();
    private _resolvers = new Resolvers();
    
    public async getShopInfo(): Promise<any> {
        const shop_info = await this._httpClient.get(api_endpoints.shop_info);
        const resolved_shop_info = this._resolvers.resolveImageUrl(shop_info, ["logo"]);

        return resolved_shop_info
    }
}