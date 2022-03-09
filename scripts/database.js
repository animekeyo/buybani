function set(location, data) {
    localStorage.setItem(location, data)
    return localStorage.getItem(location)
}

function seti(location, data) {
    localStorage.setItem(location, data)
}

function get(location) {
    return localStorage.getItem(location)
}