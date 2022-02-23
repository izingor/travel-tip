import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'

window.onload = onInit;
window.onAddMarker = onAddMarker;
window.onPanTo = onPanTo;
window.onCopyLink = onCopyLink;
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
        .then(renderLocs)

    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
    })
    var lat = params.lat
    var lng = params.lng
    gCurrUserLoc.lat = lat 
    gCurrUserLoc.lng = lng 
}

// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
    console.log('Getting Pos');
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
}

function onAddLoc(ev) {
    ev.preventDefault()
    const currLoc = mapService.getCurrLoc()
    new Promise((resolve) => {
            resolve(currLoc)
        })
        .then(locService.addLoc)
        .then(locService.getLocs)
        .then(renderLocs)
        .catch(err => console.log('error ', err))
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
        </table>`
    })
    document.querySelector('.locs').innerHTML = strHTMLs.join('')
}

function onGoLoc(lat, lng) {
    mapService.panTo(lat, lng);
}

function onDeleteLoc(locId) {
    locService.deleteLoc(locId)
    locService.getLocs()
        .then(renderLocs)
}

function onAddMarker() {
    console.log('Adding a marker');
    mapService.addMarker({ lat: 32.0749831, lng: 34.9120554 });
}

// function onGetLocs() {
//     locService.getLocs()
//         .then(locs => {
//             console.log('Locations:', locs)
//             document.querySelector('.locs').innerText = JSON.stringify(locs)
//         })
// }

function onGetUserPos() {
    getPosition()
        .then(pos => {
            gCurrUserLoc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
            mapService.panTo(gCurrUserLoc.lat, gCurrUserLoc.lng)
            mapService.addMarker(gCurrUserLoc);
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


function onFindPlace(input) {
    const prm = mapService.findPlace(input.value);
    prm.then(res => mapService.panTo(res.lat, res.lng));
}

function onCopyLink(elBtn){
    if (!gCurrUserLoc) {
        getPosition()
            .then(pos => {
                gCurrUserLoc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
            })
    }
    navigator.clipboard.writeText(`https://izingor.github.io/travel-tip/index.html?lat=${gCurrUserLoc.lat}&lng=${gCurrUserLoc.lng}`)

    elBtn.innerText = 'Copied!'
    setTimeout(() => {
        elBtn.innerText = 'Copy Link'
    }, 2000)
}