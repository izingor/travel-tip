
export const mapService = {
    initMap,
    addMarker,
    panTo
}

var gMap;
var gClickedLoc = { lat: 32.0749831, lng: 34.9120554 }

function initMap(lat = 32.0749831, lng = 34.9120554) {
    console.log('InitMap');
    return _connectGoogleApi()
        .then(() => {
            console.log('google available');
            gMap = new google.maps.Map(
                document.querySelector('#map'), {
                center: { lat, lng },
                zoom: 15
            })
            console.log('Map!', gMap);
        })
        .then(() => {
            let infoWindow = new google.maps.InfoWindow({
                content: 'Hello!',
                position: { lat, lng }
            });
            infoWindow.open(gMap);
            infoWindow.close();
            // Configure the click listener.
            gMap.addListener("click", (mapsMouseEvent) => {
                console.log(mapsMouseEvent);
                const contentStr = '<form onsubmit="onAddLoc(event)">' + '<input name="location" placeholder="Name of location?">' + '</form>'
                infoWindow.close();
                infoWindow = new google.maps.InfoWindow({
                    content: contentStr,
                    position: mapsMouseEvent.latLng,
                });
                gClickedLoc = mapsMouseEvent.latLng.toJSON()
                infoWindow.open(gMap);
            });
        })
}

function addMarker(loc) {
    var marker = new google.maps.Marker({
        position: loc,
        map: gMap,
        title: 'Hello World!'
    });
    return marker;
}

function panTo(lat, lng) {
    var laLatLng = new google.maps.LatLng(lat, lng);
    gMap.panTo(laLatLng);
}



function _connectGoogleApi() {
    if (window.google) return Promise.resolve()
    const API_KEY = 'AIzaSyDXNxZYGzQXRBraA5rsPqLrOhvqO8pHxA8';
    var elGoogleApi = document.createElement('script');
    elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`;
    elGoogleApi.async = true;
    document.body.append(elGoogleApi);

    return new Promise((resolve, reject) => {
        elGoogleApi.onload = resolve;
        elGoogleApi.onerror = () => reject('Google script failed to load')
    })
}