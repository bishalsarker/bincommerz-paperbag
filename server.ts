import express from 'express';
import nunjucks from 'nunjucks';
import { Category } from './interfaces/category';
import { CategoryService } from './services/category.service';
import { LayoutService } from './services/layout.service';
import { PageService } from './services/page.service';

import { ProductService } from './services/product.service';
import { ShopService } from './services/shop.service';
import { TemplateService } from './services/template.service';

var app = express();
const PORT = '8000';

var env = nunjucks.configure('views', {
  autoescape: true,
  express: app
});

app.set('view engine', 'html');
app.use(express.static('static'))

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";

const _productService = new ProductService();
const _categoryService = new CategoryService();
const _pageService = new PageService();
const _shopService = new ShopService();
const _templateService = new TemplateService(_productService, _categoryService);
const _layoutService = new LayoutService(_categoryService, _pageService, _shopService);

app.get('/', async (req, res) => {
    const layout = await _layoutService.resolveLayout();
    const template = await _templateService.resolveTemplate();

    env.addGlobal('layout', layout);

    res.render('index.html', {
        page_data: { 
            title: null,
            show_cart: true,
            template_data: template
        }
    });
});

app.get('/product/:id', async (req, res) => {
  const layout = await _layoutService.resolveLayout();
  const productData = await _productService.getProduct(req.params.id);

  env.addGlobal('layout', layout);

  res.render('product-details.html', {
      page_data: {
        title: productData?.name,
        product_data: productData,
        product_id: productData?.id,
        default_gallery_image: productData?.images[0],
        show_cart: true
      }
  });
});

app.get('/products/catalog/:slug', async (req, res) => {
  const layout = await _layoutService.resolveLayout();
  const slug = req.params.slug as String;
  const keyword = req.query.keyword as String;
  const page_number = req.query.page_number as String ? req.query.page_number as String : "1";
  const categoryData = await _categoryService.getCategory(slug);
  const productlist = await _productService.getProducts(
    slug, 'newest', keyword ? keyword : undefined, "20", page_number);

  env.addGlobal('layout', layout);

  res.render('products.html', {
      page_data: {
        title: categoryData?.name,
        cat_slug: categoryData?.slug,
        cat_name: categoryData?.name,
        subcategories: categoryData?.subcategories,
        product_list: productlist?.products,
        query_string: "slug=" + slug,
        selected_page_number: page_number,
        total_pages: () => {
          const page_number_list = [];
          let i = 0;
          const total_pages = productlist?.totalPages ? productlist?.totalPages : 0;

          while (i < total_pages) {
            page_number_list.push(i + 1);
            i++;
          }

          return page_number_list;
        },

        show_cart: true
      }
  });
});

app.get('/products/search', async (req, res) => {
  const layout = await _layoutService.resolveLayout();
  const cat = req.query.cat as String;
  const keyword = req.query.keyword as String;
  const page_number = req.query.page_number as String ? req.query.page_number as String : "1";
  const categories = await _categoryService.getCategories();
  let subcategories: Category[] = [];

  if (cat) {
    const subcat = (await _categoryService.getCategory(cat))?.subcategories;
    if (subcat) {
      subcategories = subcat;
    }
  }

  const productlist = await _productService.getProducts(
    cat, 'newest', keyword ? keyword : undefined, "20", page_number);

  layout['query_string'] = keyword;

  env.addGlobal('layout', layout);

  if (keyword && keyword !== '') {
    res.render('search_results.html', {
        page_data: {
          title: 'Catalog Search',
          categories: categories,
          subcategories: subcategories,
          product_list: productlist?.products,
          query_string: keyword,
          selected_page_number: page_number,
          total_pages: () => {
            const page_number_list = [];
            let i = 0;
            const total_pages = productlist?.totalPages ? productlist?.totalPages : 0;

            while (i < total_pages) {
              page_number_list.push(i + 1);
              i++;
            }

            return page_number_list;
          },

          show_cart: true
        }
    });
  } else {
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
});

app.get('/cart', async (req, res) => {
  const layout = await _layoutService.resolveLayout();
  const pages = await _pageService.getPages();

  env.addGlobal('layout', layout);

  res.render('cart.html', {
      page_data: {
        title: 'Frequently Asked Questions',
        faq_list: pages?.faq,
        show_cart: true
    }
  });
});

app.get('/pages/:type/:slug', async (req, res) => {
  const layout = await _layoutService.resolveLayout();
  const pageData = await _pageService.getPage(req.params.type, req.params.slug);

  env.addGlobal('layout', layout);

  res.render('page_viewer.html', {
      page_data: {
        title: pageData?.pageTitle,
        page_data: pageData,
        show_cart: true
    }
  });
});

app.get('/faq', async (req, res) => {
  const layout = await _layoutService.resolveLayout();
  const pages = await _pageService.getPages();

  env.addGlobal('layout', layout);

  res.render('faq.html', {
      page_data: {
        title: 'Frequently Asked Questions',
        faq_list: pages?.faq,
        show_cart: true
    }
  });
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`)
});

