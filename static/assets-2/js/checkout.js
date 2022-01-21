var shipping_charge = 150.00;

function setSavedShippingValues() {
    var shipping_details = localStorage.getItem("shipping_details");

    if (shipping_details) {
        shipping_details = JSON.parse(shipping_details);

        var full_name = document.getElementsByName("full_name")[0];
        var phone_number = document.getElementsByName("phone_number")[0];
        var email = document.getElementsByName("email")[0];
        var address = document.getElementsByName("address")[0];

        full_name.value = shipping_details.fullName;
        phone_number.value = shipping_details.phone;
        email.value = shipping_details.email;
        address.value = shipping_details.address;
    }
}

function renderCartItemsTable() {
    var cart_item_table_body = document.getElementById("cart_item_table_body");
    var cart_items = JSON.parse(localStorage.getItem('cart_items'));
    var total_items_price = 0;

    cart_items.forEach((item) => {
        var row = createElement({tag_name: 'tr'});
        var sub_total = item.price * item.quantity;

        var td_title = createElement({
            tag_name: 'td',
            inner_text: item.title + " X " + item.quantity,
        });

        var td_price = createElement({
            tag_name: 'td',
            inner_text: "Tk. " + sub_total,
        });

        row.appendChild(td_title);
        row.appendChild(td_price);

        cart_item_table_body.appendChild(row);

        total_items_price +=sub_total;
    });

    var shipping_charge_row = createElement({tag_name: 'tr'});
    var td_shipping_title = createElement({
        tag_name: 'td',
        attributes: {
            style: 'font-weight: 600'
        },
        inner_text: 'Shipping (Countrywide)',
    });

    var td_shipping_charge = createElement({
        tag_name: 'td',
        inner_text: "Tk. " + shipping_charge,
    });

    shipping_charge_row.appendChild(td_shipping_title);
    shipping_charge_row.appendChild(td_shipping_charge);
    cart_item_table_body.appendChild(shipping_charge_row);

    var total_row = createElement({tag_name: 'tr'});
    var td_total_title = createElement({
        tag_name: 'td',
        attributes: {
            style: 'font-weight: 600'
        },
        inner_text: 'Total',
    });

    var td_total_amount = createElement({
        tag_name: 'td',
        inner_text: "Tk. " + (total_items_price + shipping_charge),
    });

    total_row.appendChild(td_total_title);
    total_row.appendChild(td_total_amount);
    cart_item_table_body.appendChild(total_row);
}

function placeOrder() {
    var full_name = document.getElementsByName("full_name")[0];
    var phone_number = document.getElementsByName("phone_number")[0];
    var email = document.getElementsByName("email")[0];
    var address = document.getElementsByName("address")[0];
    var trx_id = document.getElementsByName("transaction_id")[0];

    document.getElementById("full_name_errmsg").innerText = "";
    document.getElementById("phone_number_errmsg").innerText = "";
    document.getElementById("email_errmsg").innerText = "";
    document.getElementById("address_errmsg").innerText = "";
    document.getElementById("trxid_errmsg").innerText = "";

    full_name.style.borderColor = "#ced4da";
    phone_number.style.borderColor = "#ced4da";
    email.style.borderColor = "#ced4da";
    address.style.borderColor = "#ced4da";
    trx_id.style.borderColor = "#ced4da";

    var hasValidationErrors = false;

    if (full_name.value === "") {
        document.getElementById("full_name_errmsg").innerText = "This field is required";
        full_name.style.borderColor = "red";
        hasValidationErrors = true;
    } else {
        if (!full_name.value.match(/^[a-zA-Z ]{2,30}$/)) {
            document.getElementById("full_name_errmsg").innerText = "Only alphabets are allowed";
            full_name.style.borderColor = "red";
            hasValidationErrors = true;
        }
    }

    if (phone_number.value === "") {
        document.getElementById("phone_number_errmsg").innerText = "This field is required";
        phone_number.style.borderColor = "red";
        hasValidationErrors = true;
    } else {
        if (!phone_number.value.match(/^[0-9]+$/)) {
            document.getElementById("phone_number_errmsg").innerText = "Only numbers are allowed";
            phone_number.style.borderColor = "red";
            hasValidationErrors = true;
        }
    }

    if (email.value === "") {
        document.getElementById("email_errmsg").innerText = "This field is required";
        email.style.borderColor = "red";
        hasValidationErrors = true;
    } else {
        if (!email.value.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
            document.getElementById("email_errmsg").innerText = "Please provide a valid email address";
            email.style.borderColor = "red";
            hasValidationErrors = true;
        }
    }

    if (address.value === "") {
        document.getElementById("address_errmsg").innerText = "This field is required";
        address.style.borderColor = "red";
        hasValidationErrors = true;
    }

    if (document.getElementsByName("payment_method")[1].checked) {
        if(trx_id.value === "") {
            document.getElementById("trxid_errmsg").innerText = "This field is required";
            trx_id.style.borderColor = "red";
            hasValidationErrors = true;
        }
    }

    if(!hasValidationErrors) {
        var orderPayload = {
            fullName: document.getElementsByName("full_name")[0].value,
            phone: document.getElementsByName("phone_number")[0].value,
            email: document.getElementsByName("email")[0].value,
            address: document.getElementsByName("address")[0].value,
            paymentMethod:  getPaymentMethod(),
            paymentNotes: "bKash TrxId: " + getTrxId(),
            items: JSON.parse(localStorage.getItem("cart_items")).map((item) => {
              return {
                productId: item.productId,
                quantity: parseInt(item.quantity),
              };
            }),
        };
    
        var place_order_btn_text = document.getElementById("place_order_btn_text");
        var place_order_btn = document.getElementById("place_order_btn");
        place_order_btn_text.innerText ="PLACING ORDER...";
        place_order_btn.disabled = true;
        
        // $.ajax('http://127.0.0.1:5000/cronping?ping_id=MNjaj89Uy6tarQzz', {
        $.ajax('https://bincommerz.azurewebsites.net/shop/order/addnew', {
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(orderPayload),
            headers: {
                shop_id: "potterybd",
            },
            success: function (response, status, xhr) {
                var orders = JSON.parse(localStorage.getItem('orders'));
                orders.push({
                    id: response.data.id,
                    fullName: document.getElementsByName("full_name")[0].value,
                    phone: document.getElementsByName("phone_number")[0].value,
                    email: document.getElementsByName("email")[0].value,
                    address: document.getElementsByName("address")[0].value,
                    paymentMethod:  getPaymentMethod(),
                    orderedOn: new Date().toUTCString(),
                    items: JSON.parse(localStorage.getItem("cart_items"))
                });

                localStorage.setItem('orders', JSON.stringify(orders));
                updateOrderCount();

                var shipping_details = localStorage.getItem("shipping_details");

                if (!shipping_details) {
                    localStorage.setItem("shipping_details", JSON.stringify({
                        fullName: document.getElementsByName("full_name")[0].value,
                        phone: document.getElementsByName("phone_number")[0].value,
                        email: document.getElementsByName("email")[0].value,
                        address: document.getElementsByName("address")[0].value,
                    }));
                }

                localStorage.setItem('cart_items', '[]');
                
                var checkout_header = document.getElementById("checkout_header");
                checkout_header.innerText = "ORDER PLACED";
                
                var checkout_form = document.getElementById("checkout_form");
                checkout_form.innerHTML = "";

                var order_id_section = createElement({
                    tag_name: 'div',
                    attributes: {
                        class: 'col-12',
                        style: 'text-align: center;'
                    }
                });

                var order_id_header = createElement({
                    tag_name: 'h4',
                    inner_text: 'Your Order ID'
                });

                var order_id_number = createElement({
                    tag_name: 'h4',
                    attributes: {
                        style: 'color: #e25050;'
                    },
                    inner_text: response.data.id
                });

                var instruction = createElement({
                    tag_name: 'p',
                    inner_text: 'Please store this id for tracking your order'
                });

                order_id_section.appendChild(order_id_header);
                order_id_section.appendChild(order_id_number);
                order_id_section.appendChild(instruction);
                

                var con_btn_section = createElement({
                    tag_name: 'div',
                    attributes: {
                        class: 'col-12'
                    }
                });
                
                var con_btn_col = createElement({
                    tag_name: 'div',
                    attributes: {
                        class: 'd-flex justify-content-center'
                    }
                });

                var con_btn = createElement({
                    tag_name: 'a',
                    attributes: {
                        class: 'exclusive btn-ex-red',
                        style: 'margin-top: 5%; text-align: center;',
                        href: '/'
                    }
                });

                var con_btn_text = createElement({
                    tag_name: 'span',
                    inner_text: 'CONTINUE SHOPPING'
                })

                con_btn.appendChild(con_btn_text);
                con_btn_col.appendChild(con_btn);
                con_btn_section.appendChild(con_btn_col);
                order_id_section.appendChild(con_btn_section);

                checkout_form.appendChild(order_id_section);
            },
            error: function (jqXhr, textStatus, errorMessage) {
                var checkout_form = document.getElementById("checkout_form");
                checkout_form.innerHTML = "";

                var order_error_section = createElement({
                    tag_name: 'div',
                    attributes: {
                        class: 'col-12',
                        style: 'text-align: center;'
                    }
                });

                var order_error_message = createElement({
                    tag_name: 'h4',
                    attributes: {
                        style: 'color: #e25050;'
                    },
                    inner_text: 'Something went wrong while processing your oder!'
                });

                order_error_section.appendChild(order_error_message);
                
                var con_btn_section = createElement({
                    tag_name: 'div',
                    attributes: {
                        class: 'col-12'
                    }
                });
                
                var con_btn_col = createElement({
                    tag_name: 'div',
                    attributes: {
                        class: 'd-flex justify-content-center'
                    }
                });

                var con_btn = createElement({
                    tag_name: 'a',
                    attributes: {
                        class: 'exclusive btn-ex-red',
                        style: 'margin-top: 5%; text-align: center;',
                        href: '/checkout'
                    }
                });

                var con_btn_text = createElement({
                    tag_name: 'span',
                    inner_text: 'TRY AGAIN',
                })

                con_btn.appendChild(con_btn_text);
                con_btn_col.appendChild(con_btn);
                con_btn_section.appendChild(con_btn_col);
                order_error_section.appendChild(con_btn_section);

                checkout_form.appendChild(order_error_section);
            }
        });
    }
}

function getPaymentMethod() {
    var payment_mentod = "cod";

    if (document.getElementsByName("payment_method")[0].checked) {
        payment_mentod = document.getElementsByName("payment_method")[0].value;
    }

    if (document.getElementsByName("payment_method")[1].checked) {
        payment_mentod = document.getElementsByName("payment_method")[1].value;
    }

    return payment_mentod;
}

function getTrxId() {
    var trx_id = "";

    if (document.getElementsByName("payment_method")[1].checked) {
        trx_id = document.getElementsByName("transaction_id")[0].value;
    }

    return trx_id;
}