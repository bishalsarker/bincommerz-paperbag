const api_host_dev = "https://localhost:5001/shop/";
const api_host_prod = "https://api-core.bincommerz.com/shop/";

const api_host = process.env.NODE_ENV === "production" ? api_host_prod : api_host_dev;
// const api_host = api_host_prod;

export const api_endpoints: any = {
    get_categories: api_host + "categories",
    get_category: api_host + "category",
    get_all_products: api_host + "products/get?",
    get_product_details: api_host + "products/",
    search_products: api_host + "products/search?q=",
    track_order: api_host + "order/track/",
    get_pages: api_host + "pages/getall",
    get_page: api_host + "pages/get",
    shop_info: api_host + "info",
    get_slider: api_host + "widgets/slider/get/",
    get_template: api_host + "templates/get",
    place_order: api_host + "order/addnew",
    delivery_charges: api_host + "orders/delivery-charges",
    static_files_endpoint: "https://bincommerzstaticstorage.blob.core.windows.net"
}