import { locService } from './services/loc.service.js';
import { mapService } from './services/map.service.js';

window.onload = onInit;
window.onAddMarker = onAddMarker;
window.onPanTo = onPanTo;
window.onGetLocs = onGetLocs;
window.onGetUserPos = onGetUserPos;
window.onAddLoc = onAddLoc;
window.onGoLoc = onGoLoc;
window.onDeleteLoc = onDeleteLoc;
// window.onMoveUser = onMoveUser;
window.onFindPlace = onFindPlace;

var gCurrUserLoc;


function onInit() {
    mapService.initMap()
        .then(() => {
            console.log('Map is ready');
        })
        .catch(() => console.log('Error: cannot init map'));
    locService.getLocs()
        .then(renderLocs);
}

// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
    console.log('Getting Pos');
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
    });
}

function onAddLoc(ev) {
    ev.preventDefault();
    const currLoc = mapService.getCurrLoc();
    const prmWeather = mapService.getWeather(currLoc);
    prmWeather.then(res => res.data)
        .then(renderWeather);

    new Promise((resolve) => {
            resolve(currLoc);
        })
        .then(locService.addLoc)
        .then(locService.getLocs)
        .then(renderLocs);
}

function renderLocs(locs) {
    const strHTMLs = locs.map(loc => {
        return `<table>
            <tbody>
                <tr>
                    <td class="loc-name">${loc.name}:</td>
                    <td class="loc-latlng">${loc.lat}, ${loc.lng}</td>
                    <td>
                    <button class = "btn" onclick="onGoLoc(${loc.lat}, ${loc.lng})">Go</button>
                    <button class = "btn" onclick="onDeleteLoc('${loc.id}')">Delete</button>
                    </td>
                </tr>
            </tbody>
        </table>`;
    });
    document.querySelector('.locs').innerHTML = strHTMLs.join('');
}

function onGoLoc(lat, lng) {
    mapService.panTo(lat, lng);
}

function onDeleteLoc(locId) {
    console.log(locId);
    locService.deleteLoc(locId);
    locService.getLocs()
        .then(renderLocs);
}

function onAddMarker() {
    console.log('Adding a marker');
    mapService.addMarker({ lat: 32.0749831, lng: 34.9120554 });
}

function onGetLocs() {
    locService.getLocs()
        .then(locs => {
            console.log('Locations:', locs);
            document.querySelector('.locs').innerText = JSON.stringify(locs);
        });
}

function onGetUserPos() {
    getPosition()
        .then(pos => {
            gCurrUserLoc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
            mapService.panTo(gCurrUserLoc.lat, gCurrUserLoc.lng);
            mapService.addMarker(gCurrUserLoc);
            console.log('User position is:', pos.coords);
            document.querySelector('.user-pos').innerText =
                `Latitude: ${pos.coords.latitude} - Longitude: ${pos.coords.longitude}`;
        })
        .catch(err => {
            console.log('err!!!', err);
        });
}

function onPanTo() {
    console.log('Panning the Map');
    mapService.panTo(35.6895, 139.6917);
}


function onFindPlace(input) {
    const prm = mapService.findPlace(input.value);
    prm.then(res => mapService.panTo(res.lat, res.lng));
}

function renderWeather(data) {
    const elWeather = document.querySelector('.weather-container');
    var strHTML = `<h4>Temperature: ${Math.floor(data.main.temp - 273)}Celsius</h4>
                    <h4>Description: ${data.weather[0].description}`
    elWeather.innerHTML = strHTML;
    console.log(data);
}