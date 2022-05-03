import axios, { AxiosStatic } from "axios";
import { ApiResponse } from "../interfaces/api-response";

export class HttpClient {
    private client = axios;

    constructor () {}

    public getClient(): AxiosStatic {
        return this.client;
    }

    public async get<T>(url: string, shop_id: string): Promise<T | null> {
        try {
            const axiosResponse = await this.client.get(url, {
                headers: {
                    "shop_id": shop_id
                }
            });
            
            if (axiosResponse.data) {
                const response = axiosResponse.data as ApiResponse;

                if (response.isSuccess) {
                    const data = response.data as T;
                    return Promise.resolve(data);
                }
            }

        } catch (err) {
            console.log(JSON.stringify(err));
        }

        return Promise.resolve(null);
    }

    public async post<T>(url: string, data: any): Promise<T | null> {
        try {
            const axiosResponse = await this.client.post(url, data);
            
            if (axiosResponse.data) {
                const response = axiosResponse.data as ApiResponse;

                if (response.isSuccess) {
                    const data = response.data as T;
                    return Promise.resolve(data);
                }
            }

        } catch (err) {
            console.log(JSON.stringify(err));
        }

        return Promise.resolve(null);
    }
}