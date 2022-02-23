import { storageService } from './storage.service.js';
import { utilService } from './util.service.js'

export const locService = {
    getLocs,
    addLoc,
    deleteLoc,
}

const STORAGE_KEY = 'locsDB'
const locs = []

function getLocs() {
    return new Promise((resolve) => {
            resolve(locs);
    });
}

function addLoc(loc) {
const {lat, lng} = loc
console.log(lat, lng);
    const locName = document.querySelector('input[name=location]').value
    _createLoc(locName, lat, lng)
}

function deleteLoc(locId) {
    const locIdx = locs.findIndex(loc => {
        return locId === loc.id
    })
    console.log(locIdx);
    locs.splice(locIdx, 1)
    storageService.save(STORAGE_KEY, locs)
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
    locs.unshift(location)
    console.log(locs);
    storageService.save(STORAGE_KEY, locs)
}


