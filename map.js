let place = null;
let hasPlace = false;

function initMap() {
    const map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 40.749933, lng: -73.98633 },
        zoom: 13,
        mapTypeControl: false,
    });
    const input = document.getElementById("pac-input");
    const options = {
        fields: ["place_id", "formatted_address", "geometry", "name", "address_components"],
        strictBounds: false,
        language: "en",
        types: ["(cities)"],
    };

    const autocomplete = new google.maps.places.Autocomplete(input, options);
    const infowindow = new google.maps.InfoWindow();
    const infowindowContent = document.getElementById("infowindow-content");

    infowindow.setContent(infowindowContent);

    const marker = new google.maps.Marker({
        map,
        anchorPoint: new google.maps.Point(0, -29),
    });

    autocomplete.addListener("place_changed", () => {
        infowindow.close();
        marker.setVisible(false);

        place = autocomplete.getPlace();

        if (!place.geometry || !place.geometry.location) {
            window.alert("No details available for input: '" + place.name + "'");
            hasPlace = false;
            return;
        }

        if (place.geometry.viewport) {
            map.fitBounds(place.geometry.viewport);
        } else {
            map.setCenter(place.geometry.location);
            map.setZoom(17);
        }
        hasPlace = true;

        marker.setPosition(place.geometry.location);
        marker.setVisible(true);
        infowindowContent.children["place-name"].textContent = place.name;
        infowindowContent.children["place-address"].textContent =
            place.formatted_address;
        infowindow.open(map, marker);
    });
}

window.initMap = initMap;

function buttonClick() {
    if (!hasPlace) {
        window.alert("No place has been selected!")
    } else {
        let miles = document.getElementById('miles').value;
        Telegram.WebApp.sendData(place.address_components[0].short_name + "+" + place.address_components[2].short_name + "+" + place.place_id + "+" + miles);
    }
}