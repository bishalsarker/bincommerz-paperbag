var cart_storage = localStorage.getItem('cart_items');
var shipping_charge = 110;

if (!cart_storage) {
	localStorage.setItem('cart_items', '[]');
}

updateCartCount();
updateCartTotalPrice();
// setCheckoutButton();

renderCartTable();

function openCart() {
	var cart_items = JSON.parse(localStorage.getItem('cart_items'));
	renderCartItems(cart_items);
	updateCartTotalPrice();
}

function renderCartTable() {
	var cart_items = JSON.parse(localStorage.getItem('cart_items'));
	renderCartTableItems(cart_items);
	updateCartTableTotalPrice();

	var shipping_charge_lbl = document.getElementById('shipping-charge-lbl');

	if (shipping_charge_lbl) {
		shipping_charge_lbl.innerText = 'Tk ' + shipping_charge;
	}
}

function renderCartItems(cart_items) {
	var cart_items_container = document.getElementById('cart_items_container');
	cart_items_container.innerHTML = '';

	if (cart_items.length === 0) {
		setEmptyCartMessage(cart_items_container);
	} else {
		var product_list = "";

		cart_items.forEach((cart_item) => {	
			product_list = product_list + `<div id="${cart_item.productId}" class="product">
				<div class="product-cart-details">
					<h4 class="product-title">
						<a href="product.html">${cart_item.title}</a>
					</h4>

					<span class="cart-product-info">
						<span class="cart-product-qty">${cart_item.quantity}</span>
						x Tk ${cart_item.price}
					</span>
				</div>

				<figure class="product-image-container">
					<a href="product.html" class="product-image">
						<img src="${cart_item.image_url}" alt="product">
					</a>
				</figure>
				<a style="cursor:pointer;" 
				   onclick="removeCartItem('${cart_item.productId}')" 
				   class="btn-remove" 
				   title="Remove Product">
				   <i class="icon-close"></i>
				</a>
			</div>`;
		});

		cart_items_container.innerHTML = product_list;
	}
}

function renderCartTableItems(cart_items) {
	var cart_items_container = document.getElementById('cart_table_items_container');
	cart_items_container.innerHTML = '';

	if (cart_items_container) {
		if (cart_items.length === 0) {
			setEmptyCartMessage(cart_items_container);
		} else {
			var product_list = "";
	
			cart_items.forEach((cart_item) => {
				product_list = product_list + `<tr id="row_${cart_item.productId}">
					<td class="product-col">
					<div class="product">
						<figure class="product-media">
						<a href="/product/${cart_item.productId}">
							<img src="${cart_item.image_url}" alt="Product image">
						</a>
						</figure>
	
						<h3 class="product-title">
						<a href="/product/${cart_item.productId}">${cart_item.title}</a>
						</h3><!-- End .product-title -->
					</div><!-- End .product -->
					</td>
					<td class="price-col">Tk ${cart_item.price} </td>
					<td class="quantity-col">
						<div class="cart-product-quantity">
							<input onchange="updateProductQuantity('${cart_item.productId}', this.value)" type="number" class="form-control" value="${cart_item.quantity}" min="1" max="10" step="1" data-decimals="0" required>
						</div><!-- End .cart-product-quantity -->
					</td>
					<td class="total-col">Tk ${cart_item.price * cart_item.quantity}</td>
					<td class="remove-col"><button class="btn-remove" onclick="removeCartItem('${cart_item.productId}')"><i class="icon-close"></i></button></td>
				</tr>`;
			});
	
			cart_items_container.innerHTML = product_list;
		}
	}
}

function generateCartItem(cart_item) {
	var list_group_item = createElement({
		tag_name: 'div',
		attributes: {
			id: cart_item.productId,
			class: 'list-group-item',
		},
	});

	var cart_item_row = createElement({
		tag_name: 'div',
		attributes: {
			class: 'row',
		},
	});

	var image_col = createElement({
		tag_name: 'div',
		attributes: {
			class: 'col-3 d-flex justify-content-center',
		},
	});

	var img = createElement({
		tag_name: 'img',
		attributes: {
			src: cart_item.image_url,
			style: 'max-height: 75px; object-fit: contain;',
			css: 'w-100',
		},
	});

	image_col.appendChild(img);
	cart_item_row.appendChild(image_col);

	var item_detail_col = createElement({
		tag_name: 'div',
		attributes: {
			class: 'col-9',
		},
	});

	var item_details_flex_box = createElement({
		tag_name: 'div',
		attributes: {
			class: 'd-flex w-100 justify-content-between',
		},
	});

	var prod_title = createElement({
		tag_name: 'h5',
		attributes: {
			class: 'mb-1',
		},
		inner_text: cart_item.title,
	});

	var cross_icon = createElement({
		tag_name: 'div',
		attributes: {
			class: 'cross-icon',
            style: 'cursor: pointer;',
			onclick: "removeCartItem('" + cart_item.productId + "');",
		},
	});

	var cross_icon_ico = createElement({
		tag_name: 'i',
		attributes: {
			class: 'fas fa-times',
		},
	});

	cross_icon.appendChild(cross_icon_ico);
	item_details_flex_box.appendChild(prod_title);
	item_details_flex_box.appendChild(cross_icon);
	item_detail_col.appendChild(item_details_flex_box);

	var item_quantity = createElement({
		tag_name: 'p',
		attributes: {
			class: 'mb-1',
		},
		inner_html: cart_item.quantity + ' X ' + cart_item.price,
	});

	item_detail_col.appendChild(item_quantity);
	cart_item_row.appendChild(item_detail_col);

	list_group_item.appendChild(cart_item_row);

	return list_group_item;
}

function setEmptyCartMessage(cart_items_container) {
	var no_cart_items = `<p>No cart items currently</p>`;

	cart_items_container.innerHTML = no_cart_items;
}

function removeCartItem(productId) {
	var cart_items = JSON.parse(localStorage.getItem('cart_items'));
	var new_cart_list = _.filter(cart_items, function (o) {
		return o.productId !== productId;
	});
	localStorage.setItem('cart_items', JSON.stringify(new_cart_list));

	var cart_item_element = document.getElementById(productId);
	cart_item_element.remove();

	var cart_table_item_element = document.getElementById("row_" + productId);

	if (cart_table_item_element) {
		cart_table_item_element.remove();
	}

	if (new_cart_list.length === 0) {
		setEmptyCartMessage(cart_items_container);
	}

	updateCartCount();
	updateCartTotalPrice();
	// setCheckoutButton();
}

function addToCart(product_id, product_title, image, unit_price, quantity) {
	var cart_items = JSON.parse(localStorage.getItem('cart_items'));

	if (cart_items.length > 0) {
		var product = _.find(cart_items, function (o) {
			return o.productId === product_id;
		});

		if (!product) {
			cart_items.push({
				productId: product_id,
				title: product_title,
				image_url: image,
				price: parseInt(unit_price),
				quantity: quantity,
			});
		} else {
			cart_items.forEach((item) => {
				if (item.productId === product.productId) {
					item.quantity = quantity;
				}
			})
		}

	} else {
		cart_items.push({
			productId: product_id,
			title: product_title,
			image_url: image,
			price: parseInt(unit_price),
			quantity: quantity,
		});
	}

	localStorage.setItem('cart_items', JSON.stringify(cart_items));

	updateCartCount();
	updateCartTotalPrice();
	//setCheckoutButton();

	// var cartnotifier = document.getElementById("cart-notifier");
	// if (cartnotifier.style.display !== 'block') {
	// 	cartnotifier.style.display = 'block';

	// 	setTimeout(function() {
	// 		cartnotifier.style.display = 'none';
	// 	}, 3000);
	// }
}

function buyNow(product_id, product_title, image, unit_price, quantity) {
	addToCart(product_id, product_title, image, unit_price, quantity);
	window.location.href = "/checkout";
}

function updateCartCount() {
	var cart_items = JSON.parse(localStorage.getItem('cart_items'));
	var lblCartCount = document.getElementById('lblCartCount');

	if (lblCartCount) {
		lblCartCount.innerText = cart_items.length;
	}	

	// var total_cart_items_count = document.getElementById(
	// 	'total_cart_items_count'
	// );

	// total_cart_items_count.innerText = cart_items.length;
}

function updateCartTotalPrice() {
	var cart_items = JSON.parse(localStorage.getItem('cart_items'));
	var total_price = 0.0;

	cart_items.forEach((item) => {
		total_price = total_price + item.price * item.quantity;
	});

	var total_price_cart_items = document.getElementById(
		'total_price_cart_items'
	);

	total_price_cart_items.innerText = total_price + ' Tk';
}

function updateCartTableTotalPrice() {
	var cart_items = JSON.parse(localStorage.getItem('cart_items'));
	var total_price = 0.0;

	cart_items.forEach((item) => {
		total_price = total_price + item.price * item.quantity;
	});

	var cart_subtotal = document.getElementById('cart-subtotal');
	cart_subtotal.innerText = 'Tk ' + total_price;

	var shipping_charge_el = document.getElementById('shipping-charge').checked;
	var total_amount = document.getElementById('total-amount');

	if (shipping_charge_el) {
		total_amount.innerText = total_price + shipping_charge;
	}
}

function updateProductQuantity(productId, quantity) {
	var cart_items = JSON.parse(localStorage.getItem('cart_items'));
	
	var productItem = null;
	var new_cart_list = cart_items.map((item) => {
		if (item.productId === productId) {
			productItem = item;
			item.quantity = parseInt(quantity);
		}

		return item;
	})

	localStorage.setItem('cart_items', JSON.stringify(new_cart_list));

	var price_col = document.querySelector('#row_' + productId + ' .total-col');
	
	if (price_col && productItem) {
		price_col.innerText = "Tk " + (productItem.price * productItem.quantity);
	}

	updateCartTableTotalPrice();
}

function setCheckoutButton() {
	var cart_items = JSON.parse(localStorage.getItem('cart_items'));
	var checkout_btn = document.getElementById('checkout_btn');

	if (cart_items.length !== 0) {
		checkout_btn.innerHTML = '';
		var btn = createElement({
			tag_name: 'button',
			attributes: {
				class: 'exclusive exclusive-sm btn-ex-red w-100',
                onclick: "window.location.href = '/checkout'"
			},
			inner_html: '<span>CHECKOUT</span>',
		});

		checkout_btn.appendChild(btn);
	} else {
		checkout_btn.innerHTML = '';
	}
}
