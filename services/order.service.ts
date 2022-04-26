import { api_endpoints } from "../constants/api-endpoints";
import { HttpClient } from "../utils/http.util";

export class OrderService {
    private _httpClient: HttpClient = new HttpClient();

    public placeOrder(payload: any): Promise<any> {
        return new Promise((resolve) => { 
            this._httpClient.getClient()
            .post<any>(api_endpoints.place_order, payload)
            .then((response) => {
                resolve(response.data);
            });
        });
    }

    public async trackOrder(order_id: string | null, shop_id: string): Promise<any | null> {
        return await this._httpClient.get<any>(`${api_endpoints.track_order}${order_id}`, shop_id);
    }

    public async getDeliveryCharges(shop_id: string): Promise<any | null> {
        return await this._httpClient.get<any>(`${api_endpoints.delivery_charges}`, shop_id);
    }
}