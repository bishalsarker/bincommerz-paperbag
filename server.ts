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

    console.log(template);

    env.addGlobal('layout', layout);

    res.render('index.html', {
        page_data: { 
            title: null,
            show_cart: true,
            template_data: template
        }
    });
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`)
});

