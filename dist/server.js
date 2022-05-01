"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const nunjucks_1 = __importDefault(require("nunjucks"));
const category_service_1 = require("./services/category.service");
const layout_service_1 = require("./services/layout.service");
const order_service_1 = require("./services/order.service");
const page_service_1 = require("./services/page.service");
const product_service_1 = require("./services/product.service");
const shop_service_1 = require("./services/shop.service");
const template_service_1 = require("./services/template.service");
const url_mapper_service_1 = require("./services/url-mapper.service");
const _ = __importStar(require("lodash"));
var app = (0, express_1.default)();
const PORT = process.env.PORT || 8000;
app.use(express_1.default.urlencoded({
    extended: true
}));
app.use(express_1.default.json());
var env = nunjucks_1.default.configure('views', {
    autoescape: true,
    express: app
});
app.set('view engine', 'html');
app.use(express_1.default.static('static'));
if (process.env.NODE_ENV !== "production") {
    process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";
}
const _productService = new product_service_1.ProductService();
const _categoryService = new category_service_1.CategoryService();
const _pageService = new page_service_1.PageService();
const _shopService = new shop_service_1.ShopService();
const _templateService = new template_service_1.TemplateService(_productService, _categoryService);
const _layoutService = new layout_service_1.LayoutService(_categoryService, _pageService, _shopService);
const _orderService = new order_service_1.OrderService();
const _urlMapperService = new url_mapper_service_1.UrlMapperService();
let _urlMap = [];
const shopUrlPromise = _urlMapperService.getAppUrls();
shopUrlPromise.then((m) => _urlMap = m);
app.use((req, res, next) => {
    var _a;
    let shop_id = "c186a01b40e849d9987d03753b444cfd";
    if (req.headers.host !== 'localhost:8000') {
        const mapped_shop_id = (_a = _.find(_urlMap, (o) => { return o.name === req.headers.host; })) === null || _a === void 0 ? void 0 : _a.value;
        shop_id = mapped_shop_id ? mapped_shop_id : 'invalid';
    }
    if (shop_id === 'invalid') {
        res.send({ error: '404 Not Found!' });
    }
    else {
        req['shopId'] = shop_id;
        next();
    }
});
app.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const shop_id = req['shopId'];
        const layout = yield _layoutService.resolveLayout(shop_id);
        const template = yield _templateService.resolveTemplate(shop_id);
        env.addGlobal('layout', layout);
        res.render('index.html', {
            page_data: {
                title: null,
                show_cart: true,
                template_data: template
            }
        });
    }
    catch (error) {
        console.log(error);
    }
}));
app.get('/product/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const shop_id = req['shopId'];
        const layout = yield _layoutService.resolveLayout(shop_id);
        const productData = yield _productService.getProduct(req.params.id, shop_id);
        const similarProducts = yield _productService.getSimilarProducts(req.params.id, shop_id);
        env.addGlobal('layout', layout);
        res.render('product-details.html', {
            page_data: {
                title: productData === null || productData === void 0 ? void 0 : productData.name,
                product_data: productData,
                similar_products: similarProducts,
                product_id: req.params.id,
                default_gallery_image: productData === null || productData === void 0 ? void 0 : productData.images[0],
                show_cart: true
            }
        });
    }
    catch (error) {
        console.log(error);
    }
}));
app.get('/products/catalog/:slug', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const shop_id = req['shopId'];
        const layout = yield _layoutService.resolveLayout(shop_id);
        const slug = req.params.slug;
        const keyword = req.query.keyword;
        const page_number = req.query.page_number ? req.query.page_number : "1";
        const categoryData = yield _categoryService.getCategory(slug, shop_id);
        const productlist = yield _productService.getProducts(shop_id, slug, 'newest', keyword ? keyword : undefined, "20", page_number);
        env.addGlobal('layout', layout);
        res.render('products.html', {
            page_data: {
                title: categoryData === null || categoryData === void 0 ? void 0 : categoryData.name,
                cat_slug: categoryData === null || categoryData === void 0 ? void 0 : categoryData.slug,
                cat_name: categoryData === null || categoryData === void 0 ? void 0 : categoryData.name,
                subcategories: categoryData === null || categoryData === void 0 ? void 0 : categoryData.subcategories,
                product_list: productlist === null || productlist === void 0 ? void 0 : productlist.products,
                query_string: "slug=" + slug,
                selected_page_number: page_number,
                total_pages: () => {
                    const page_number_list = [];
                    let i = 0;
                    const total_pages = (productlist === null || productlist === void 0 ? void 0 : productlist.totalPages) ? productlist === null || productlist === void 0 ? void 0 : productlist.totalPages : 0;
                    while (i < total_pages) {
                        page_number_list.push(i + 1);
                        i++;
                    }
                    return page_number_list;
                },
                show_cart: true
            }
        });
    }
    catch (error) {
        console.log(error);
    }
}));
app.get('/products/search', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const shop_id = req['shopId'];
        const layout = yield _layoutService.resolveLayout(shop_id);
        const cat = req.query.cat;
        const keyword = req.query.keyword;
        const page_number = req.query.page_number ? req.query.page_number : "1";
        const categories = yield _categoryService.getCategories(shop_id);
        let subcategories = [];
        if (cat) {
            const subcat = (_a = (yield _categoryService.getCategory(cat, shop_id))) === null || _a === void 0 ? void 0 : _a.subcategories;
            if (subcat) {
                subcategories = subcat;
            }
        }
        const productlist = yield _productService.getProducts(shop_id, cat, 'newest', keyword ? keyword : undefined, "20", page_number);
        layout['query_string'] = keyword;
        env.addGlobal('layout', layout);
        if (keyword && keyword !== '') {
            res.render('search_results.html', {
                page_data: {
                    title: 'Catalog Search',
                    categories: categories,
                    subcategories: subcategories,
                    product_list: productlist === null || productlist === void 0 ? void 0 : productlist.products,
                    query_string: keyword,
                    selected_page_number: page_number,
                    total_pages: () => {
                        const page_number_list = [];
                        let i = 0;
                        const total_pages = (productlist === null || productlist === void 0 ? void 0 : productlist.totalPages) ? productlist === null || productlist === void 0 ? void 0 : productlist.totalPages : 0;
                        while (i < total_pages) {
                            page_number_list.push(i + 1);
                            i++;
                        }
                        return page_number_list;
                    },
                    show_cart: true
                }
            });
        }
        else {
            res.render('search_results.html', {
                page_data: {
                    title: 'Catalog Search',
                    categories: [],
                    subcategories: [],
                    product_list: [],
                    query_string: '',
                    selected_page_number: 1,
                    total_pages: () => {
                        return 1;
                    },
                    show_cart: true
                }
            });
        }
    }
    catch (error) {
        console.log(error);
    }
}));
app.get('/cart', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const shop_id = req['shopId'];
        const layout = yield _layoutService.resolveLayout(shop_id);
        const pages = yield _pageService.getPages(shop_id);
        env.addGlobal('layout', layout);
        res.render('cart.html', {
            page_data: {
                title: 'My Cart',
                faq_list: pages === null || pages === void 0 ? void 0 : pages.faq,
                show_cart: true
            }
        });
    }
    catch (error) {
        console.log(error);
    }
}));
app.get('/checkout', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const shop_id = req['shopId'];
        const layout = yield _layoutService.resolveLayout(shop_id);
        const pages = yield _pageService.getPages(shop_id);
        const deliveryCharges = yield _orderService.getDeliveryCharges(shop_id);
        const defaultShipping = {
            id: "0000000000000000",
            title: "default-delivery-charge",
            amount: 0
        };
        if (deliveryCharges.length === 0) {
            deliveryCharges.push(defaultShipping);
        }
        env.addGlobal('layout', layout);
        res.render('checkout.html', {
            page_data: {
                title: 'Checkout',
                faq_list: pages === null || pages === void 0 ? void 0 : pages.faq,
                show_cart: true,
                deliveryCharges: deliveryCharges,
                defaultDeliveryCharge: deliveryCharges.length > 0 ? deliveryCharges[0] : defaultShipping
            }
        });
    }
    catch (error) {
        console.log(error);
    }
}));
app.get('/orders', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const shop_id = req['shopId'];
        const layout = yield _layoutService.resolveLayout(shop_id);
        const pages = yield _pageService.getPages(shop_id);
        env.addGlobal('layout', layout);
        res.render('orders.html', {
            page_data: {
                title: 'My Orders',
                faq_list: pages === null || pages === void 0 ? void 0 : pages.faq,
                show_cart: true
            }
        });
    }
    catch (error) {
        console.log(error);
    }
}));
app.get('/order/tracker', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const shop_id = req['shopId'];
        const layout = yield _layoutService.resolveLayout(shop_id);
        const order_id = req.query.oid ? req.query.oid : null;
        const trackingData = yield _orderService.trackOrder(order_id, shop_id);
        env.addGlobal('layout', layout);
        res.render('tracker.html', {
            page_data: {
                title: "Order Tracker",
                show_tracking_data: order_id ? true : false,
                tracking_data: trackingData.length > 0 ? trackingData : null,
                order_id: req.query.oid,
                show_cart: true
            }
        });
    }
    catch (error) {
        console.log(error);
    }
}));
app.get('/pages/:type/:slug', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const shop_id = req['shopId'];
        const layout = yield _layoutService.resolveLayout(shop_id);
        const pageData = yield _pageService.getPage(req.params.type, req.params.slug, shop_id);
        env.addGlobal('layout', layout);
        res.render('page_viewer.html', {
            page_data: {
                title: pageData === null || pageData === void 0 ? void 0 : pageData.pageTitle,
                page_data: pageData,
                show_cart: true
            }
        });
    }
    catch (error) {
        console.log(error);
    }
}));
app.get('/faq', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const shop_id = req['shopId'];
        const layout = yield _layoutService.resolveLayout(shop_id);
        const pages = yield _pageService.getPages(shop_id);
        env.addGlobal('layout', layout);
        res.render('faq.html', {
            page_data: {
                title: 'Frequently Asked Questions',
                faq_list: pages === null || pages === void 0 ? void 0 : pages.faq,
                show_cart: true
            }
        });
    }
    catch (error) {
        console.log(error);
    }
}));
app.post('/place-order', (req, res) => {
    try {
        _orderService.placeOrder(req.body).then((response) => {
            res.send(response);
        });
    }
    catch (error) {
        console.log(error);
    }
});
app.get('/update-url-cache', (req, res) => {
    try {
        shopUrlPromise.then((m) => _urlMap = m);
    }
    catch (error) {
        console.log(error);
    }
});
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`);
});
