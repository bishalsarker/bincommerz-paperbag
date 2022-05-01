import { api_endpoints } from "../constants/api-endpoints";
import { HttpClient } from "../utils/http.util";

export class UrlMapperService {
    private _httpClient = new HttpClient();
    
    public async getAppUrls(): Promise<{ name: string, value: string}[]> {
        const app_urls = await this._httpClient.get<any[]>(api_endpoints.get_app_urls, "");
        return app_urls ? app_urls.map((val) => {
            return {
                name: val.url,
                value: val.shopId
            }
        }) : [];
    }
}