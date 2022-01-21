var orders = localStorage.getItem('orders');

if (!orders) {
	localStorage.setItem('orders', '[]');
}

updateOrderCount();

function updateOrderCount() {
	var orders = JSON.parse(localStorage.getItem('orders'));
	var lblOrderCount = document.getElementById('lblOrderCount');
	if(lblOrderCount) {
		lblOrderCount.innerText = orders.length;
	}
}

function clearSavedOrders() {
	if (confirm("This would clear all your saved order records. Please make sure to store somewhere safe. Proceed?")) {
		localStorage.setItem('orders', '[]');
		openOrders();
	}
}

function openOrders() {
	var orders = JSON.parse(localStorage.getItem('orders'));
	orders.sort(function compare(a, b) {
		var dateA = new Date(a.orderedOn);
		var dateB = new Date(b.orderedOn);
		return dateA - dateB;
	});

	renderOrderItems(orders.reverse());
}

function renderOrderItems(orders) {
	var order_items_container = document.getElementById('order_items_container');
	order_items_container.innerHTML = '';

	if (orders.length === 0) {
		setEmptyCartMessage(order_items_container);
	} else {
		var list_group = createElement({
			tag_name: 'div',
			attributes: {
				class: 'list-group',
				style: 'margin: 20px 15px;',
			},
		});

		orders.forEach((order) => {
			list_group.appendChild(generateOrderItem(order));
		});

		order_items_container.appendChild(list_group);
	}
}

function setEmptyOrdersMessage(order_items_container) {
	var no_order_items = createElement({
		tag_name: 'p',
		attributes: {
			style: 'margin-top: 15px; padding-left: 15px;',
		},
		inner_html: 'No orders currently',
	});

	order_items_container.appendChild(no_order_items);
}

function generateOrderItem(order_item) {
	var list_group_item = createElement({
		tag_name: 'div',
		attributes: {
			id: order_item.id,
			class: 'list-group-item'
		},
	});

	var cart_item_row = createElement({
		tag_name: 'div',
		attributes: {
			class: 'row'
		},
	});

	var item_detail_col = createElement({
		tag_name: 'div',
		attributes: {
			class: 'col-12',
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
		inner_text: order_item.id,
	});

    var local_date = new Date(new Date(order_item.orderedOn).toString());
    var orderedOn = moment(local_date).format("dddd, MMMM Do YYYY, h:mm a");

    var order_datetime = createElement({
		tag_name: 'p',
		attributes: {
			class: 'mb-1 mt-auto',
            style: 'font-size: 12px; float: left'
		},
		inner_html: orderedOn,
	});

    var track_url = "window.location.href = '/order_tracker?track_id=" + order_item.id + "'"

	var cross_icon = createElement({
		tag_name: 'a',
		attributes: {
			class: 'btn btn-primary mt-auto',
            style: 'cursor: pointer; float: right;',
			onclick: track_url,
		},
        inner_text: 'Track Order'
	});

	item_details_flex_box.appendChild(prod_title);
	item_details_flex_box.appendChild(cross_icon);
	item_detail_col.appendChild(item_details_flex_box);
    item_detail_col.appendChild(order_datetime);

    cart_item_row.appendChild(item_detail_col);

	list_group_item.appendChild(cart_item_row);

	return list_group_item;
}