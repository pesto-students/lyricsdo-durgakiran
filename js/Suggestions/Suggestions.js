/* eslint-disable no-unused-vars */
function changeRoute(artist, song) {
    if (typeof artist !== 'string' && !artist) {
        throw new TypeError(`Artist must be string, given ${typeof artist}`);
    }

    if (typeof song !== 'string' && !song) {
        throw new TypeError(`Artist must be string, given ${typeof song}`);
    }
}

export default function Suggestions(resultsArray) {
    let html = '';
    if (!Array.isArray(resultsArray)) {
        throw new TypeError(`resultsArray must be an array, got ${typeof resultsArray}`);
    }

    resultsArray.forEach((value) => {
        html += `<div class="results__list-item"
                    id="${value.artist.name}-${value.title}">
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
        document.addEventListener('click', (event) => {
            if (event.target.attributes.id.value === `${value.artist.name}-${value.title}`) {
                const url = new URL(window.location);
                url.pathname = `/${value.artist.name}/${value.title}`;
                window.history.pushState({}, '', url);
            }
        });
    });

    return html;
}
