export function saveToken(token) {
    localStorage.setItem('token', token);
}

export function getToken() {
    return localStorage.getItem('token');
}

export function removeToken() {
    localStorage.removeItem('token');
}

export function isLoggedIn() {
    return getToken() !== null;
}

export function authorizedFetch(url, options) {
    const token = getToken();
    if (token) {
        if (!options)
            options = {};

        if (!options.headers)
            options.headers = {};

        options.headers['Authorization'] = `Bearer ${token}`;
    }
    return fetch(url, options);
}