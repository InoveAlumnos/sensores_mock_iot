// ---- Estructura de datos ----
let data = {
    inerciales: {heading: 0, accel: 0},
    gps: {latitude: -34.55, longitude: -58.496},
}

let socket_connected = false;

function isNumeric(str) {
    if (typeof str != "string") return false // we only process strings!  
    return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
           !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
}

// ---- Instanciar elementos HTML y conectar eventos ----

// https://www.codehim.com/text-input/round-range-slider-html-control-in-jquery/#:~:text=The%20plugin%2C%20%E2%80%9CroundSlider%E2%80%9D%20is,build%20with%20CSS%20and%20JavaScript.
// https://roundsliderui.com/document.html
$("#heading").roundSlider({
    sliderType: "min-range",
    value: 0,
    max : 360,
    startAngle: "+90",
    endAngle : "+360",
    drag: function(e) {
        var angle = e.value;
        data.inerciales.heading = angle;
    }
});
$("#accel").roundSlider({
    sliderType: "min-range",
    value: 0,
    max : 5,
    min : -5,
    step: 0.2,        
    startAngle: "-90",
    drag: function(e) {
        var angle = e.value;
        data.inerciales.accel = angle;
    }
});

document.querySelector("#latitude").value = data.gps.latitude;
document.querySelector("#latitude").onchange = (e) => {
    if(isNumeric(e.value) == true) {
        data.gps.latitude = parseFloat(e.value);
    }
};

document.querySelector("#longitude").value = data.gps.longitude;
document.querySelector("#longitude").onchange = (e) => {
    if(isNumeric(e.value) == true) {
        data.gps.longitude = parseFloat(e.value);
    }
};


// ---- Web sockets contra el backend ----
let socket = io();
socket.on("connect", function() {
    socket_connected = true;
});

(function my_func() {
    if (socket_connected == true){
        socket.emit("sensores_event", data);
    }
    setTimeout( my_func, 500 );
})();
