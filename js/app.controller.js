import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'

window.onload = onInit;
window.onAddMarker = onAddMarker;
window.onPanTo = onPanTo;
window.onGetLocs = onGetLocs;
window.onGetUserPos = onGetUserPos;
window.onAddLoc = onAddLoc;
window.onMoveUser = onMoveUser;

var gCurrUserLoc;


function onInit() {
    mapService.initMap()
        .then(() => {
            console.log('Map is ready');
        })
        .catch(() => console.log('Error: cannot init map'));
}

// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
    console.log('Getting Pos');
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
}

function onAddLoc(ev, mouseEv) {
    ev.preventDefault();
    console.log(ev, mouseEv);
    const { lat, lng } = mouseEv.latLng.toJSON();

    new Promise((resolve) => {
            resolve(lat, lng)
        })
        .then(locService.addLoc)
        .then(locService.getLocs)
        .then(renderLocs)
}

function renderLocs(locs) {
    const strHTMLs = locs.map(loc => {
        `<table>
            <tbody>
                <tr>,
                    <td class="loc-name">${loc.name}</td>
                    <td class="loc-latlng">${loc.lat}, ${loc.lng}</td>
                    <td>
                    <button onclick="onGoLoc()">Go</button>
                    <button onclick="onDeleteLoc()">Delete</button>
                    </td>
                </tr>
            </tbody>
        </table>`
    })
    document.querySelector('.my-location-container').innerHTML = strHTMLs.join('')
}

function onAddMarker() {
    console.log('Adding a marker');
    mapService.addMarker({ lat: 32.0749831, lng: 34.9120554 });
}

function onGetLocs() {
    locService.getLocs()
        .then(locs => {
            console.log('Locations:', locs)
            document.querySelector('.locs').innerText = JSON.stringify(locs)
        })
}

function onGetUserPos() {
    getPosition()
        .then(pos => {
            gCurrUserLoc = { lat: pos.coords.latitude, long: pos.coords.longitude };
            console.log(gCurrUserLoc);
            console.log('User position is:', pos.coords);
            document.querySelector('.user-pos').innerText =
                `Latitude: ${pos.coords.latitude} - Longitude: ${pos.coords.longitude}`
        })
        .catch(err => {
            console.log('err!!!', err);
        })
}

function onPanTo() {
    console.log('Panning the Map');
    mapService.panTo(35.6895, 139.6917);
}


function onMoveUser() {
    // console.log();
    mapService.panTo(gCurrUserLoc.lat, gCurrUserLoc.long)
}