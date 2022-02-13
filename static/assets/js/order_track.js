renderTrackingData();

function renderTrackingData() {
    var tracking_dates = document.getElementsByClassName("tracking-date");
    console.log(tracking_dates)
    for(i = 0; i < tracking_dates.length; i++) {
        var iso_date = tracking_dates[i].innerText.split(".")[0] + ".000Z";
        var local_date = new Date(new Date(iso_date).toString());
        tracking_dates[i].innerText = moment(local_date).format("dddd, MMMM Do YYYY, h:mm a");
    }
}

function trackOrder() {
    var order_id = document.getElementsByName("order_id")[0].value;
    var track_id_errmsg = document.getElementById("track_id_errmsg");

    track_id_errmsg.innerText = "";

    if (order_id === "") {
        track_id_errmsg.innerText = "Please provide an order id to track"
    } else {
        window.location.href = '/order/tracker?oid=' + order_id;
    }
}