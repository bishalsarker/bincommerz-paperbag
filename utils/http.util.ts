import axios, { AxiosStatic } from "axios";
import { ApiResponse } from "../interfaces/api-response";

export class HttpClient {
    private client = axios;

    constructor () {
        this.client.defaults.headers.common = {
            "shop_id": "c186a01b40e849d9987d03753b444cfd"
        }
    }

    public getClient(): AxiosStatic {
        return this.client;
    }

    public async get<T>(url: string): Promise<T | null> {
        try {
            const axiosResponse = await this.client.get(url);
            
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