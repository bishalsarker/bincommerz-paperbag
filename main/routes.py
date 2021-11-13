from lib.page_data import get_all_pages, get_checkout_page_data, get_index_data, get_nav_categories, get_nav_shop_info, get_order_tracking_data, get_page_data, get_product_details, get_products_by_slug, get_search_results
from main import app
from flask import request, render_template, jsonify, abort

@app.context_processor
def inject_categories():
    shown_cats, hidden_cats = get_nav_categories()
    pages = get_all_pages()
    nav_items = {
        "shown": shown_cats,
        "hidden": hidden_cats,
        "pages": pages['navLink']
    }

    footer_items ={
        "pages": {
            "support": pages['support'],
            "about": pages['about'],
            "faq": pages['faq']
        }
    }

    return dict(nav_items=nav_items, footer_items=footer_items, shop_info=get_nav_shop_info())

@app.errorhandler(404)
def resource_not_found(e):
    return jsonify(error=str(e)), 404

@app.route('/')
@app.route('/index')
def index():
    return render_template ('index.html', page_data=get_index_data())

@app.route('/products/<cat_slug>', methods=['GET'])
def products(cat_slug):
    return render_template ('products.html', page_data=get_products_by_slug(cat_slug))

@app.route('/product', methods=['GET'])
def product_details():
    return render_template ('product-details.html', page_data=get_product_details(request.args.get('id')))

@app.route('/checkout', methods=['GET'])
def checkout():
    return render_template ('checkout.html', page_data=get_checkout_page_data())

@app.route('/order_tracker', methods=['GET'])
def order_tracker():
    return render_template ('tracker.html', page_data=get_order_tracking_data(request.args.get('track_id')))

@app.route('/search', methods=['GET'])
def search():
    return render_template ('search.html', page_data=get_search_results(request.args.get('q')))

@app.route('/about/<slug>', methods=['GET'])
def about_pages(slug):
    return render_template ('page_viewer.html', page_data=get_page_data('about', slug))

@app.route('/support/<slug>', methods=['GET'])
def support_pages(slug):
    return render_template ('page_viewer.html', page_data=get_page_data('support', slug))

@app.route('/faq/<slug>', methods=['GET'])
def faq_pages(slug):
    return render_template ('page_viewer.html', page_data=get_page_data('faq', slug))

@app.route('/nav/<slug>', methods=['GET'])
def nav_pages(slug):
    return render_template ('page_viewer.html', page_data=get_page_data('navbarlink', slug))

@app.route('/cronping', methods=['GET'])
def cronping():
    ping_id = request.args.get('ping_id')

    if(ping_id != 'MNjaj89Uy6tarQzz'):
        abort(404, description="Resource not found")

    return "We are awake..."