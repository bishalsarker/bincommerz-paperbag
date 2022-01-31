import { api_endpoints } from "../constants/api-endpoints";
import { PageItem, Pages } from "../interfaces/page";
import { HttpClient } from "../utils/http.util";

export class PageService {
    private _httpClient: HttpClient = new HttpClient();

    public async getPages(): Promise<Pages | null> {
        return await this._httpClient.get<Pages>(api_endpoints.get_pages);
    }

    public async getPage(type: String, slug: String): Promise<PageItem | null> {
        return await this._httpClient.get<PageItem>(`${api_endpoints.get_page}?cat=${type}&slug=${slug}`);
    }
}