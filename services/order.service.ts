import { api_endpoints } from "../constants/api-endpoints";
import { HttpClient } from "../utils/http.util";

export class OrderService {
    private _httpClient: HttpClient = new HttpClient();

    public async placeOrder(payload: any): Promise<any | null> {
        return await this._httpClient.post<any>(api_endpoints.place_order, payload);
    }
}