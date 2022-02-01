import { Product } from "./product";

export interface PaginationResponse {
    products: Product[],
    pageSize: Number,
    pageNumber: Number,
    totalPages: Number
}