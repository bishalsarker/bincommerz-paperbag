var orders = localStorage.getItem('orders');

if (!orders) {
	localStorage.setItem('orders', '[]');
}

updateOrderCount();
openOrders();

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

	if (orders.length > 0) {
		viewOrderDetails(orders[0].id);
	} else {
		var order_details_container = document.getElementById('order_details_container');
		order_details_container.innerHTML = `<p style="margin-top: 10px;">No order is selected</p>`
	}
}

function renderOrderItems(orders) {
	var order_items_container = document.getElementById('order_items_container');
	order_items_container.innerHTML = '';

	if (orders.length === 0) {
		setEmptyCartMessage(order_items_container);
	} else {
		var order_list = "";
	
		orders.forEach((order) => {
			order_list = order_list + `<tr id="row_${order.id}">
				<td>
					<a style="cursor: pointer; color: #007bff;" onclick="viewOrderDetails('${order.id}')">${order.id}</a>
				</td>
				<td>${order.orderedOn} </td>
				<td>
					<div style="float: right;">
						<button class="btn btn-primary" onclick="viewOrderDetails('${order.id}')">View</button>
					</div>
				</td>
			</tr>`;
		});

		order_items_container.innerHTML = order_list;
	}
}

function viewOrderDetails(order_id) {
	var orders = JSON.parse(localStorage.getItem('orders'));
	var order = _.find(orders, function (o) { 
		return o.id === order_id;
	});

	if (order) {
		var order_details_container = document.getElementById('order_details_container');
		order_details_container.innerHTML = `
		<div class="table-responsive">
		<table class="table">
			<tbody>
			<tr class="summary-subtotal">
				<td>Order ID:</td>
				<td id="cart-subtotal">${order.id}</td>
			</tr><!-- End .summary-subtotal -->
			</tbody>
		</table><!-- End .table table-summary -->
		<a href="/order/tracker?oid=${order.id}" class="btn btn-outline-primary-2 btn-order btn-block">TRACK ORDER</a>
		</div>`
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