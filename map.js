function measureAdd(latLng) {
    var marker = new google.maps.Marker({
        map: map,
        position: latLng,
        draggable: true,
        raiseOnDrag: false,
        icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 2
        }
    });

    measure.mvcDots.push(latLng);
    measure.mvcMarkers.push(marker);

    var latLngIndex = measure.mvcDots.getLength() - 1;
    google.maps.event.addListener(marker, "drag", function(evt) {
        measure.mvcDots.setAt(latLngIndex, evt.latLng);
    });

    if (measure.mvcDots.getLength() > 1) {
        if (!measure.line) {
            measure.line = new google.maps.Polyline({
                map: map,
                clickable: false,
                strokeColor: "#0000FF",
                strokeOpacity: 1,
                strokeWeight: 2,
                path: measure.mvcDots
            });
        }

        if (measure.mvcDots.getLength() > 2) {
            if (!measure.polygon) {
                measure.polygon = new google.maps.Polygon({
                    clickable: false,
                    map: map,
                    fillOpacity: 0.25,
                    strokeOpacity: 0,
                    paths: measure.mvcDots
                });
            }

            refreshArea();
        }
    }
}

function measureReset() {
    if (measure.polygon) {
        measure.polygon.setMap(null);
        measure.polygon = null;
    }

    measure.mvcDots.clear();

    measure.mvcMarkers.forEach(function(elem, index) {
        elem.setMap(null);
    });

    measure.mvcMarkers.clear();

    refreshArea();
}

function calculateArea() {
    if (measure.mvcDots.getLength() > 2) {
        return Math.round(google.maps.geometry.spherical.computeArea(measure.polygon.getPath()) * 100) / 100;
    } else {
        return 0;
    }
}

function refreshArea() {
    document.getElementById("inputArea").value = calculateArea();
    refreshCost();
}

function calculateCost() {
    return Math.round(document.getElementById("inputMultiplier").value * document.getElementById("inputArea").value * 100) / 100;
}

function refreshCost() {
    document.getElementById("inputCost").value = calculateCost();
}

/***Measure and Map***/
var measure = {
    mvcDots: new google.maps.MVCArray(),
    mvcMarkers: new google.maps.MVCArray(),
    polygon: null
};

var map = new google.maps.Map(document.getElementById("map"), {
    zoom: 20,
    center: { lat: -41.318721, lng: -72.981087 },
    mapTypeId: google.maps.MapTypeId.SATELLITE,
    draggableCursor: "crosshair",
    disableDefaultUI: true
});

/***Event listeners***/
google.maps.event.addListener(map, "click", function(evt) {
    measureAdd(evt.latLng);
});

document.getElementById("btnClear").addEventListener("click", function(){
    measureReset();
});

document.getElementById("inputMultiplier").addEventListener("mouseup", function(){
    refreshCost();
});

document.getElementById("inputMultiplier").addEventListener("keyup", function(){
    refreshCost();
});

document.getElementById("inputArea").addEventListener("mouseup", function(){
    refreshCost();
});

document.getElementById("inputArea").addEventListener("keyup", function(){
    refreshCost();
});

/***Get current position if user allows***/
navigator.geolocation.getCurrentPosition(function(position) {
    map.setCenter(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
});