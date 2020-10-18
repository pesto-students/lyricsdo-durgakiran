const utils = {
    debounce(cb, wait, thisArg) {
        let timerId;
        let result;

        if (typeof cb !== 'function') {
            throw new TypeError(`expected function got ${typeof cb}`);
        }

        if (!Number.isSafeInteger(wait)) {
            throw new TypeError(`expected number got ${wait}`);
        }

        function cancel() {
            if (timerId) {
                clearTimeout(timerId);
            }
        }

        function delayed(...args) {
            if (timerId) {
                clearTimeout(timerId);
            }
            timerId = setTimeout(() => {
                result = cb.call(thisArg, ...args);
            }, wait);
            return result;
        }

        delayed.cancel = cancel;

        return delayed;
    },
};

const uiManipulations = {
    getResultsLoader() {
        return `
            <div class="shimmer" id="result-shimmer"></div>
            <div class="shimmer" id="result-shimmer"></div>
            <div class="shimmer" id="result-shimmer"></div>
            <div class="shimmer" id="result-shimmer"></div>
            <div class="shimmer" id="result-shimmer"></div>
            `;
    },
    addResultsLoader() {
        const resultsNode = document.getElementById('result-container');
        resultsNode.innerHTML = `<div class="user-msg">${this.getResultsLoader()}</div>`;
        const shimmer = document.getElementById('result-shimmer');
        shimmer.style.width = `${resultsNode.offsetWidth}px`;
    },
    removeResultLoaders() {

    },
    createSearchResultsHtml(resultsArray, total) {
        let html = '';
        if (!Array.isArray(resultsArray) || resultsArray.length <= 0) {
            throw new TypeError(`resultsArray must be an array, got ${typeof resultsArray}`);
        }

        resultsArray.forEach((value) => {
            html += `<div class="results__list-item" 
                    onclick="handleInteractions.getLyrics('${value.artist.name}', '${value.title}', '${value.album.title}', '${value.album.cover_medium}')">
                    <img src="./assets/hero-background-small.jpg"
                        class="results__list-item-logo"
                        data-src="${value.album.cover_small}"
                        onload="if(this.src !== this.getAttribute('data-src')) this.src=this.getAttribute('data-src')"
                        onerror="this.onerror=null;this.src='./assets/hero-background-small.jpg'"
                    />
                    <div class="results__list-content">
                        <h3 class="results__list-content-title">
                            ${value.title}
                        </h3>
                        <p class="results__list-content-author">
                            ${value.artist.name}
                        </p>
                    </div>
                </div>`;
        });
        if (total * 75 > document.getElementById('result-container').offsetHeight) {
            html += '<div class="results__list-item load-more-btn">Load More...</div>';
        }
        return html;
    },
    addSearchResults(results, total) {
        const resultsNode = document.getElementById('result-container');
        resultsNode.innerHTML = `${this.createSearchResultsHtml(results, total)}`;
        return true;
    },
    addMoreDocs() {

    },
    createLyricsHtml(lyrics, artist, song, album, image) {
        const html = `<div class="results__lyrics-header">
                        <img 
                            src='${image}'
                            onerror="this.onerror=null;this.src='./assets/hero-background-small.jpg'"
                            class="results__lyrics-header-logo"
                        />
                        <div class="results__lyrics-header-meta">
                            <h3 class="results__lyrics-header-title">
                                ${song}
                            </h3>
                            <div class="results__lyrics-header-author">
                                <span>Artist: </span><span>${artist}</span>
                            </div>
                            <div class="results__lyrics-header-album">
                                <span>Album: </span><span>${album}</span>
                            </div>
                        </div>
                    </div>
                    <div class="results__lyrics-content">
                        ${lyrics ? lyrics.replace(/\n/g, '<br />') : '<div style="text-align:center; font-size: 24px">Hmm! It seems we could not find lyrics</div>'}
                    </div>
                    `;
        return html;
    },
    addLyrics(lyrics, artist, song, album, image) {
        const lyricsNode = document.getElementById('lyrics-node');
        lyricsNode.innerHTML = this.createLyricsHtml(lyrics, artist, song, album, image);
    },
};

const httpCalls = {
    getSuggestions: async (searchText) => fetch(`https://api.lyrics.ovh/suggest/${searchText}`),
    getLyrics: async (artist, song) => fetch(`https://api.lyrics.ovh/v1/${artist}/${song}`),
};

const getResults = {
    handleRouteParams(routeObject) {
        // eslint-disable-next-line no-prototype-builtins
        if (routeObject.hasOwnProperty('search')) {
            this.searchResults(routeObject.search);
        }
        // eslint-disable-next-line no-prototype-builtins
        if (routeObject.hasOwnProperty('lyrics') && routeObject.hasOwnProperty('artist')) {
            this.getLyrics(routeObject.artist, routeObject.lyrics, routeObject.artist, '');
        }
    },
    searchResults: async (searchText) => {
        uiManipulations.addResultsLoader.call(uiManipulations);
        const results = await httpCalls.getSuggestions(searchText)
            .then((value) => value.json());
        uiManipulations.addSearchResults.call(uiManipulations, results.data, results.total);
    },
    attachLoader() {

    },
    getLyrics: async (artist, song, album, image) => {
        const results = await httpCalls.getLyrics(artist, song).then((value) => value.json());
        uiManipulations.addLyrics.call(uiManipulations, results.lyrics, artist, song, album, image);
    },
};

const routes = [
    {
        path: '/',
        action: getResults.handleRouteParams,
    },
];

/**
 * Thanks Taylor for this wonderful little blog
 *  https://willtaylor.blog/client-side-routing-in-vanilla-js/
 *
 */
const router = {
    routes,
    loadRoute(urlSegments) {
        /**
         * load given route and update the UI
         */
        const segments = urlSegments.segments || '/';
        const matchedRouteObject = this.matchUrlToRoute(segments);
        const { search, lyrics, artist } = urlSegments.query;

        const url = `/${`${urlSegments.segments ? urlSegments.segments.join('/') : ''}?search=${search}&lyrics=${lyrics}&artist=${artist}`}`;
        window.history.pushState({}, '', url);

        matchedRouteObject.action.call(getResults, { search, lyrics, artist });
    },
    matchUrlToRoute(urlSegment) {
        const queryParams = {};
        const segments = urlSegment.segments || [''];

        const matchedRoutes = this.routes.find((route) => {
            const routePathSegments = route.path.split('/').slice(1);

            if (segments.length !== routePathSegments.length) {
                return false;
            }

            const match = routePathSegments
                .every((segment, i) => (segment === segments[i] || segment[0] === ':'));

            if (match) {
                const queryParamsString = window.location.search;
                const paramParser = new URLSearchParams(queryParamsString);
                const searchText = paramParser.get('search');
                const lyrics = paramParser.get('lyrics');
                const artist = paramParser.get('artist');
                queryParams.search = searchText;
                queryParams.lyrics = lyrics;
                queryParams.artist = artist;
            }

            return match;
        });

        return { ...matchedRoutes, query: queryParams };
    },
    loadInitialRoute() {
        /**
         * Identify the first load when browser loads
         */
        const pathnameSplit = window.location.pathname.split('/');
        const pathSegments = pathnameSplit.length > 1 ? pathnameSplit.slice(1) : '';
        const queryParamsString = window.location.search;
        const queryParams = {};
        const paramParser = new URLSearchParams(queryParamsString);
        const searchText = paramParser.get('search');
        const lyrics = paramParser.get('lyrics');
        const artist = paramParser.get('artist');
        queryParams.search = searchText;
        queryParams.lyrics = lyrics;
        queryParams.artist = artist;
        return { segments: pathSegments, query: queryParams };
    },
    renderLyrics(artist, song, album, image) {
        const queryParamsString = window.location.search;
        const paramParser = new URLSearchParams(queryParamsString);
        const searchText = paramParser.get('search');
        const url = `${window.location.pathname}?search=${searchText}&lyrics=${song}&artist=${artist}`;
        window.history.pushState({}, '', url);
        getResults.getLyrics(artist, song, album, image);
    },
};

// eslint-disable-next-line no-unused-vars
const handleInteractions = {
    debounced: utils.debounce(router.loadRoute, 1000, router),
    handleInput() {
        const searchText = document.getElementById('search').value;
        if (!searchText) {
            this.debounced.cancel();
        } else {
            this.debounced({ query: { search: searchText } });
        }
    },
    handleSmallSearch() {
        const searchText = document.getElementById('smallSearch').value;
        if (!searchText) {
            this.debounced.cancel();
        } else {
            this.debounced({ query: { search: searchText } });
        }
    },
    getLyrics(artist, song, album, image) {
        if (artist && song) {
            router.renderLyrics(artist, song, album, image);
        }
    },
};
