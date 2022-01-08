import { api_endpoints } from "../constants/api-endpoints";
import { Pages } from "../interfaces/page";
import { HttpClient } from "../utils/http.util";

export class PageService {
    private _httpClient: HttpClient = new HttpClient();

    public async getPages(): Promise<Pages | null> {
        return await this._httpClient.get<Pages>(api_endpoints.get_pages);
    }
}