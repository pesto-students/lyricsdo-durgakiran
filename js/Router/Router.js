export class Router {
    constructor() {
        this.routes = [];
    }

    setUri(uri, callback) {
        this.routes.push({ uri, callback });
    }

    getUri(uri) {
        return this.routes.find((route) => route.uri === uri);
    }
}

export function dispatchQueryParamEvent() {
    window.dispatchEvent(new CustomEvent('queryParam'));
}

export function dispatchRouteChange() {
    window.dispatchEvent(new CustomEvent('routeChange'));
}
