import { storageService } from './storage.service.js';
import { utilService } from './util.service.js'

export const locService = {
    getLocs,
    addLoc,
}

const STORAGE_KEY = 'locsDB'
const locs = []

function getLocs() {
    return new Promise((resolve) => {
        return resolve(locs)
    });
}

function addLoc(lat, lng) {
    console.log(lat, lng);
    const locName = document.querySelector('input[name=location]').value
    _createLoc(locName, lat, lng)
}

function _createLoc(name, lat, lng) {
    const location = {
        id: utilService.makeId(),
        name,
        lat,
        lng,
        weather: 'chilly',
        createdAt: Date.now(),
        updatedAt: Date.now()
    }
    locs.push(location)
    console.log(locs);
    storageService.save(STORAGE_KEY, locs)
}


