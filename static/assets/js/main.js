window.onload = function () {
    var desc_html = document.getElementById("product_desc_quill");
    var page_body = document.getElementsByClassName("page_body")[0];

    if (desc_html) {
      desc_html.innerHTML = desc_html.innerText;
    }

    if (page_body) {
      page_body.innerHTML = page_body.innerText;
    }
}

function createElement(options) {
  var el = document.createElement(options.tag_name);
  
  if (options.attributes) {
    Object.keys(options.attributes).forEach(function (key) {
      el.setAttribute(key, options.attributes[key]);
    });
  }

  if (options.inner_text) {
    el.innerText = options.inner_text;
  }

  if (options.inner_html) {
    el.innerHTML = options.inner_html;
  }

  return el;
}