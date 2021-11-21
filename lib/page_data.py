# from lib.shop import get_categories, get_category, get_page, get_pages, get_product_data, get_product_list, get_search_data, get_shop_info, get_slider, get_tracking_data

import lib.shop as shop

def get_index_data():
    page_model = {}

    page_model = {
        "title": None,
        "show_cart": True,
        "template_data": shop.resolve_template()
    }

    return page_model

def get_products_by_slug(cat_slug):
    page_model = {}
    category_data = shop.get_category(cat_slug)
    cat_name = category_data['name']
    title = category_data['name']
    product_list = shop.get_product_list(category_data['slug'], 'newest')

    page_model = {
        "title": title,
        "cat_slug": cat_slug,
        "cat_name": cat_name,
        "product_list": product_list,
        "show_cart": True
    }

    return page_model

def get_product_details(product_id):
    page_model = {}
    product_data = None
    default_gallery_image = ''
    title = ''

    if product_id != None:
        product_data = shop.get_product_data(product_id)
    
    if product_data != None:
        title = product_data['name']
        default_gallery_image = product_data['images'][0]
    
    page_model = {
        "title": title,
        "product_data": product_data,
        "product_id": product_id,
        "default_gallery_image": default_gallery_image,
        "show_cart": True
    }

    return page_model

def get_order_tracking_data(order_id):
    page_model = {}
    show_tracking_data = False
    tracking_data = None

    if order_id != None:
        tracking_data = shop.get_tracking_data(order_id)
        show_tracking_data = True
    
    page_model = {
        "title": "Order Tracker",
        "show_tracking_data": show_tracking_data,
        "tracking_data": tracking_data,
        "order_id": order_id,
        "show_cart": True
    }

    return page_model

def get_search_results(q):
    page_model = {}
    show_search_results = False
    search_results = None
    count = 0

    if q != None and q != '':
        search_results = shop.get_search_data(q)
        show_search_results = True
        
        if search_results != None:
            count = len(search_results)
    
    if q == None:
        q = ''
    
    page_model = {
        "title": "Search Products",
        "show_search_results": show_search_results,
        "search_results": search_results,
        "query": q,
        "count": count,
        "show_cart": True
    }

    return page_model

def get_checkout_page_data():
    page_model = {}

    page_model = {
        "title": "Checkout",
        "show_cart": False
    }

    return page_model

def get_page_data(category, slug):
    page_model = {}

    page_data = shop.get_page(slug, category)

    page_model = {
        "title": page_data['pageTitle'],
        "page_data": page_data,
        "show_cart": True
    }

    return page_model


def filter_categories(all_cats):
    filtered = []
    for cat in all_cats:
        if cat['slug'] != 'featured':
            filtered.append(cat)

    return filtered

def get_all_pages():
    page_list = shop.get_pages()

    return page_list


def get_nav_categories():
    all_cats = shop.get_categories()
    shown = []
    hidden = []

    i = 0
    for cat in all_cats:
        if cat['slug'] != 'featured':
            if i <= 3:
                shown.append(cat)
            else:
                hidden.append(cat)

            i += 1

    return shown, hidden

def get_nav_shop_info():
    return shop.get_shop_info()