import express from 'express';
import nunjucks from 'nunjucks';
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

app.get('/products/:slug', async (req, res) => {
  const layout = await _layoutService.resolveLayout();
  const categoryData = await _categoryService.getCategory(req.params.slug);
  const productlist = await _productService.getProducts(req.params.slug, 'newest');

  env.addGlobal('layout', layout);

  res.render('products.html', {
      page_data: {
        title: categoryData?.name,
        cat_slug: categoryData?.slug,
        cat_name: categoryData?.name,
        subcategories: categoryData?.subcategories,
        product_list: productlist,
        show_cart: true
      }
  });
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`)
});

