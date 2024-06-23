let map;
let autocomplete;
let marker;

function initMap() {
    // Inicializar el mapa
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 4.8087174, lng: -75.690601 },
        zoom: 8,
    });

    // Inicializar el campo de autocomplete
    const input = document.getElementById("input");
    autocomplete = new google.maps.places.Autocomplete(input); //Metodo de google
    autocomplete.bindTo("bounds", map);

    autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (!place.geometry) {
            console.error(`"No hay detalles: '${place.name}'`);
            return;
        }

        map.setCenter(place.geometry.location);
        map.setZoom(10);

        if (marker) {
            marker.setMap(null);
        }
        marker = new google.maps.Marker({
            map: map,
            position: place.geometry.location,
        });

        getWeather(place.geometry.location.lat(), place.geometry.location.lng());
    });
}

async function getWeather(lat, lon) {
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m&hourly=precipitation`);
    const json = await response.json();
    
    const temperature = json.current.temperature_2m;
    console.log(json.hourly.precipitation)
    const wind = json.current.wind_speed_10m;
    document.getElementById("temperature").innerHTML = `${temperature} °C`;
    document.getElementById("wind").innerHTML = `${wind} Km/h`;
    document.getElementById("precipitation").innerHTML = `TBD`;

    /* if (json.hourly.is_day == 1 ){
        document.getElementById("time").innerHTML = `sunny`;
    } else {
        document.getElementById("time").innerHTML = `dark_mode`;
    } */

        let precipitation = json.hourly.precipitation.reduce((a, b) => a + b, 0)
        precipitation = precipitation / precipitation.length

    if (precipitation > 0 && json.hourly.is_day == 0) {
        document.getElementById("time").innerHTML = `dark_mode`;
    } else if (precipitation > 0 && json.hourly.is_day == 1) {
        document.getElementById("time").innerHTML = `rainy`;
    } else if (json.hourly.is_day == 1) {
        document.getElementById("time").innerHTML = `sunny`;
    } else {
        document.getElementById("time").innerHTML = `dark_mode`;
    }
}

initMap();