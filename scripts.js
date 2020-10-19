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
    createSearchResultsHtml(resultsArray) {
        let html = '';
        if (!Array.isArray(resultsArray)) {
            throw new TypeError(`resultsArray must be an array, got ${typeof resultsArray}`);
        }

        resultsArray.forEach((value) => {
            html += `<div class="results__list-item" 
                    onclick="handleInteractions.getLyrics('${value.artist.name}', '${value.title}', '${value.album.title}', '${value.album.cover_medium}')">
                    <img src="${value.album.cover_small}"
                        class="results__list-item-logo"
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
        if (!resultsArray.length) {
            html += '<div class="result__list-item">We could not find any results</div>';
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
                        <div class="results__lyrics-content-options">
                            <div class="option">
                                Favorite
                                <div class="header__icon">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        xmlns:xlink="http://www.w3.org/1999/xlink"
                                        aria-hidden="true"
                                        focusable="false"
                                        width="1em"
                                        height="1em"
                                        style="
                                            -ms-transform: rotate(360deg);
                                            -webkit-transform: rotate(360deg);
                                            transform: rotate(360deg);
                                        "
                                        preserveAspectRatio="xMidYMid meet"
                                        viewBox="0 0 32 32"
                                    >
                                        <path
                                            d="M22.45 6a5.47 5.47 0 0 1 3.91 1.64a5.7 5.7 0 0 1 0 8L16 26.13L5.64 15.64a5.7 5.7 0 0 1 0-8a5.48 5.48 0 0 1 7.82 0l2.54 2.6l2.53-2.58A5.44 5.44 0 0 1 22.45 6m0-2a7.47 7.47 0 0 0-5.34 2.24L16 7.36l-1.11-1.12a7.49 7.49 0 0 0-10.68 0a7.72 7.72 0 0 0 0 10.82L16 29l11.79-11.94a7.72 7.72 0 0 0 0-10.82A7.49 7.49 0 0 0 22.45 4z"
                                            fill="#ffffff"
                                        />
                                    </svg>
                                </div>
                            </div>
                            <div class="option" onclick="copyLyrics()">
                                copy
                                <div class="header__icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" focusable="false" width="1em" height="1em" style="-ms-transform: rotate(360deg); -webkit-transform: rotate(360deg); transform: rotate(360deg);" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path d="M16 1H2v16h2V3h12V1zm5 4H6v18h15V5zm-2 16H8V7h11v14z" fill="white"/></svg>
                                </div>
                            </div>
                            <div class="option" onclick="closeLyricsForSmallScreen();">
                                close
                                <div class="header__icon">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        xmlns:xlink="http://www.w3.org/1999/xlink"
                                        aria-hidden="true"
                                        focusable="false"
                                        width="1em"
                                        height="1em"
                                        style="
                                            -ms-transform: rotate(360deg);
                                            -webkit-transform: rotate(360deg);
                                            transform: rotate(360deg);
                                        "
                                        preserveAspectRatio="xMidYMid meet"
                                        viewBox="0 0 42 42"
                                    >
                                        <path
                                            fill-rule="evenodd"
                                            d="M21.002 26.588l10.357 10.604c1.039 1.072 1.715 1.083 2.773 0l2.078-2.128c1.018-1.042 1.087-1.726 0-2.839L25.245 21L36.211 9.775c1.027-1.055 1.047-1.767 0-2.84l-2.078-2.127c-1.078-1.104-1.744-1.053-2.773 0L21.002 15.412L10.645 4.809c-1.029-1.053-1.695-1.104-2.773 0L5.794 6.936c-1.048 1.073-1.029 1.785 0 2.84L16.759 21L5.794 32.225c-1.087 1.113-1.029 1.797 0 2.839l2.077 2.128c1.049 1.083 1.725 1.072 2.773 0l10.358-10.604z"
                                            fill="rgb(195, 195, 195)"
                                        />
                                    </svg>
                                </div>
                            </div>
                        </div>
                        ${lyrics ? `<div id="lyrics">${lyrics.replace(/\n/g, '<br />')}</div>` : '<div style="text-align:center; font-size: 24px">Hmm! It seems we could not find lyrics</div>'}
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

        let searchHistory = JSON.parse(localStorage.getItem('suggestions')) || [];
        searchHistory.push(search);
        searchHistory = Array.from(new Set(searchHistory));
        localStorage.setItem('suggestions', JSON.stringify(searchHistory));

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
        const searchText = paramParser.get('search') || 'lenka';
        const lyrics = paramParser.get('lyrics') || 'skipalong';
        const artist = paramParser.get('artist') || 'lenka';
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
    searchText: '',
    handleInput() {
        const searchText = document.getElementById('search').value;
        if (!searchText) {
            this.debounced.cancel();
        } else {
            this.searchText = searchText;
            this.debounced({ query: { search: searchText } });
        }
    },
    handleSmallSearch() {
        const searchText = document.getElementById('smallSearch').value;
        this.searchText = searchText;
        if (!searchText) {
            this.debounced.cancel();
        } else {
            this.searchText = searchText;
            this.debounced({ query: { search: searchText } });
        }
    },
    getLyrics(artist, song, album, image) {
        if (artist && song) {
            router.renderLyrics(artist, song, album, image);
            // eslint-disable-next-line no-undef
            showLyricsForSmallScreen();
        }
    },
};
