import {utilService} from './util.service.js'

export const locService = {
    getLocs,
    addLoc,
}


const locs = [
    { name: 'Greatplace', lat: 32.047104, lng: 34.832384 }, 
    { name: 'Neveragain', lat: 32.047201, lng: 34.832581 }
]

function getLocs() {
    return new Promise((resolve) => {
return resolve(locs)
    });
}

function addLoc() {

}

function _createLoc(name, lat, lng, createdAt) {
    const location = {
        id: utilService.makeId(),
        name,
        lat,
        lng,
        weather: 'chilly',
        createdAt,
    }
    locs.push(location)
    console.log(gLocs);
}


