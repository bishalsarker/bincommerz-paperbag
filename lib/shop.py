from lib.config_manager import get_configurations
from lib.http_client import get

route_params = {
    "get_categories": "categories",
    "get_category": "category/",
    "get_all_products": "products/get?",
    "get_product_details": "products/",
    "search_products": "products/search?q=",
    "track_order": "order/track/",
    "get_pages": "pages/getall",
    "get_page": "pages/get?",
    "shop_info": "info",
    "get_slider": "widgets/slider/get/"
}

def resolve_template():
    template_rows = get_configurations()['home_template']
    sorted_rows = sorted(template_rows, key=lambda x : x['row_number'], reverse=False)

    resolved_template = []
    for row in sorted_rows:
        data = None
        type = None
        title = None

        if row['type'] == "slider":
            type = "slider"
            data = get_slider(row['resolve'])

        if row['type'] == "section":
            title = row['resolve']['title']

            if title == None:
                title = ''

            if row['resolve']['type'] == 'category':
                type = 'category_section'
                data = get_categories()
            
            if row['resolve']['type'] == 'product':
                type = 'product_section'
                data = get_product_list(row['resolve']['value'], 'newest')
        
        if data != None and type !=None:
            resolved_row = {
                'type': type,
                'data': data,
                'title': title
            }

            resolved_template.append(resolved_row)

    return resolved_template


def get_categories():
    categories = []
    url = build_url(route_params['get_categories'])

    response = get(url)

    if response != None:
        categories = resolve_images(response, "imageUrl")
        categories = sorted(categories, key=lambda x: x['order'], reverse=False)

    return categories

def get_category(slug):
    categories = []
    url = build_url(route_params['get_category']) + slug

    response = get(url)

    if response != None:
        categories = resolve_image(response, "imageUrl")

    return categories

def get_slider(sliderid):
    slider = None
    url = build_url(route_params['get_slider']) + sliderid

    response = get(url)

    if response != None:
        slider = response
        slides = resolve_images(slider["slides"], "imageURL")

        i = 0
        for slide in slides:
            if i == 0:
               slide["default"] = True
            else:
               slide["default"] = False
            
            slides[i] = slide
            i = i + 1
        
        slider["slides"] = slides

    return slider

def get_pages():
    pages = []
    url = build_url(route_params['get_pages'])

    response = get(url)

    if response != None:
        pages = response

    return pages

def get_page(slug, category):
    page_data = None
    params = "cat=" + category + "&slug=" + slug
    url = build_url(route_params['get_page']) + params

    response = get(url)

    if response != None:
        page_data = response

    return page_data

def get_product_list(cat_slug, sort_by):
    product_list = []
    url = build_url(route_params['get_all_products'])

    if cat_slug != None:
        url = url + 'cat_slug=' + cat_slug + '&'

    if sort_by != None:
        url = url + 'sort_by=' + sort_by

    response = get(url)

    if response != None:
        product_list = resolve_images(response, "imageUrl")

    return product_list

def get_product_data(product_id):
    product_data = None
    url = build_url(route_params['get_product_details']) + product_id

    response = get(url)

    if response != None:
        product_data = response

    return product_data

def get_search_data(query):
    search_results = None
    url = build_url(route_params['search_products']) + query

    response = get(url)

    if response != None and len(response) > 0:
        search_results = resolve_images(response, "imageUrl")

    return search_results

def get_tracking_data(order_id):
    order_data = None
    url = build_url(route_params['track_order']) + order_id

    response = get(url)

    if response != None and len(response) > 0:
        order_data = response

    return order_data

def get_shop_info():
    shop_info = None
    url = build_url(route_params['shop_info'])

    response = get(url)

    if response != None:
        shop_info = resolve_image(response, "logo")

    return shop_info

def resolve_image(unresolved_item, img_prop_name):
    resolved_item = None
    config = get_configurations()
    static_files_endpoint = config["static_files_endpoint"]

    curr_url = unresolved_item[img_prop_name]
    if curr_url != None:
        unresolved_item[img_prop_name] = static_files_endpoint + curr_url
        resolved_item = unresolved_item
    
    return resolved_item

def resolve_images(unresolved_list, img_prop_name):
    resolved_list = []
    config = get_configurations()
    static_files_endpoint = config["static_files_endpoint"]

    for item in unresolved_list:
        curr_url = item[img_prop_name]
        if curr_url != None:
            item[img_prop_name] = static_files_endpoint + curr_url
            resolved_list.append(item)
    
    return resolved_list

def build_url(route_params):
    config = get_configurations()
    api_host = config["api_host"]
    return api_host + route_params
