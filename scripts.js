const baseUrl = 'https://api.lyrics.ovh/';
let songsArray = null;
let inputInterval;
let pageIndex = 0;
const pageSize = 5;

/**
 * loaders
 */
function getLoader() {
    return `
      <div class="shimmer" id="result-shimmer"></div>
      <div class="shimmer" id="result-shimmer"></div>
      <div class="shimmer" id="result-shimmer"></div>
      <div class="shimmer" id="result-shimmer"></div>
      <div class="shimmer" id="result-shimmer"></div>
    `;
}

function addLoaderToLyrics() {
    const lyricsNode = document.getElementById('lyrics');
    lyricsNode.innerHTML = `<div class="vertical-center">${getLoader()}</div>`;
}

function addLoaderInGetList() {
    const resultsNode = document.getElementById('result-container');
    resultsNode.innerHTML = `<div class="user-msg">${getLoader()}</div>`;
    const shimmer = document.getElementById('result-shimmer');
    shimmer.style.width = `${resultsNode.offsetWidth}px`;
}

function getLyricsOfSong(artist, song) {
    return (resolve) => {
        try {
            const http = new XMLHttpRequest();
            http.open('get', `${baseUrl}v1/${artist}/${song}`);
            http.send();
            http.onload = () => {
                if (http.status !== 200) {
                    throw new Error('error');
                }
                resolve(JSON.parse(http.response));
            };
            http.onerror = () => {
                throw new Error('Something bad happened');
            };
        } catch {
            resolve('Something bad happened :(');
        }
    };
}

/**
 * To get Lyric Suggestions
 * @param {string} searchText - Text to search
 */
function getSuggestions(searchText) {
    return (resolve) => {
        try {
            const http = new XMLHttpRequest();
            http.open('get', `${baseUrl}suggest/${searchText}`);
            http.send();
            http.onload = () => {
                if (http.status !== 200) {
                    throw new Error('error');
                }
                resolve(JSON.parse(http.response));
            };
            http.onerror = () => {
                throw new Error('Something bad happened');
            };
        } catch {
            resolve('Something bad happened :(');
        }
    };
}

function getNextPageData(index = 0, size = 5) {
    return songsArray.data.slice(index, (size + index));
}

function updatePageActions() {
    const actionsNode = document.getElementById('pageActions');
    if (pageIndex === 0 && songsArray.data.length > pageSize) {
        actionsNode.innerHTML = '<button class="page-buttons" onclick="handlePagination(\'next\')">Next</button>';
    } else if (pageIndex > 0 && pageIndex < (songsArray.data.length - pageSize)) {
        actionsNode.innerHTML = `<button class="page-buttons" onclick="handlePagination('prev')">Prev</button>
    <button class="page-buttons" onclick="handlePagination('next')">Next</button>`;
    } else if (songsArray.data.length !== 0 && pageIndex >= (songsArray.data.length - pageSize)) {
        actionsNode.innerHTML = '<button class="page-buttons" onclick="handlePagination(\'prev\')">Prev</button>';
    } else {
        actionsNode.innerHTML = '';
    }
}

/**
 * update DOM
 * @param {{data: Array<{title: string}>}} results - search results
 */
function updateResults(results) {
    let htmlSchema = '';
    results.forEach((ele, index) => {
        htmlSchema += `
    <div class="result-tile" onclick="selectSong(${Number(index)})">
      <div class="album-image">
        <img src="${ele.album.cover_small}" onerror="this.onerror=null;this.src='./assets/hero-background-small.jpg';"" alt="album cover" />
      </div>
      <div class="search-text">
        <div class="title">${
    ele.title.length > 28 ? `${ele.title.substr(0, 28)}...` : ele.title
}</div>
        <div class='description'>
          <div>Artist: <span class="artist">${ele.artist.name}</span></div>
          <div>Album: <span class="artist">${ele.album.title.length > 20 ? `${ele.album.title.substr(0, 20)}...` : ele.album.title}</span></div>
        </div>
      </div> 
    </div>`;
    });
    return htmlSchema;
}

// eslint-disable-next-line no-unused-vars
function handlePagination(type) {
    const resultsNode = document.getElementById('result-container');
    if (type === 'next' && (pageIndex + pageSize) < songsArray.data.length) {
        pageIndex += pageSize;
        const results = getNextPageData(pageIndex);
        const htmlString = updateResults(results);
        resultsNode.innerHTML = htmlString;
    } else if (type === 'prev' && (pageIndex - pageSize) >= 0) {
        pageIndex -= pageSize;
        const results = getNextPageData(pageIndex);
        const htmlString = updateResults(results);
        resultsNode.innerHTML = htmlString;
    }
    updatePageActions();
}

function openLyricsNode() {
    const contentNode = document.getElementById('content');
    contentNode.style.display = 'block';
}

// eslint-disable-next-line no-unused-vars
function closeLyricsNode() {
    const contentNode = document.getElementById('content');
    contentNode.style.display = 'none';
}

function fetchSearchResults(searchText) {
    if (!searchText) return;
    const resultsNode = document.getElementById('result-container');
    clearTimeout(inputInterval);
    inputInterval = setTimeout(async () => {
        // if (window.innerWidth <= 960) closeLyricsNode();
        addLoaderInGetList();
        const xhrPromise = new Promise(getSuggestions(searchText));
        const response = await xhrPromise;
        songsArray = response;
        pageIndex = 0;
        const firstPageResults = getNextPageData(pageIndex);
        const htmlString = updateResults(firstPageResults);
        updatePageActions();
        resultsNode.innerHTML = htmlString || 'No Results Found';
    }, 1000);
}

// eslint-disable-next-line no-unused-vars
function handleInput(id) {
    const idToRead = id || 'search';
    const searchText = document.getElementById(idToRead).value;
    fetchSearchResults(searchText);
}

/**
 *
 * @param {string} lyrics - lyrics string of the song
 */
function formatTheLyrics(lyrics) {
    return lyrics.replace(/\n/g, '<br />');
}

// eslint-disable-next-line no-unused-vars
async function getLyrics(artist, song) {
    const lyricsNode = document.getElementById('lyrics');
    addLoaderToLyrics();
    const lyricsPromise = new Promise(getLyricsOfSong(artist, song));
    const response = await lyricsPromise;
    lyricsNode.innerHTML = response.lyrics
        ? formatTheLyrics(response.lyrics)
        : '<div class="vertical-center">Lyrics Not Found</div>';

    if (window.innerWidth <= 960) {
        openLyricsNode();
    }
}

function setSelectedTrackMeta(song) {
    const imageNode = document.getElementById('selAlbumImg');
    const titleNode = document.getElementById('selTitleHeading');
    const metaNode = document.getElementById('meta');

    imageNode.innerHTML = `<img src="${song.album.cover_big1}" onerror="this.onerror=null;this.src='./assets/hero-background-small.jpg';" alt="Album image"/>`;
    titleNode.innerHTML = `${song.title}`;
    metaNode.innerHTML = `<div>
                            <span>Artist: </span> <span class="artist" onclick="fetchSearchResults('${song.artist.name}')">${song.artist.name}</span>
                        </div>
                        <div>
                            <span>Album: </span> <span class="album" onclick="fetchSearchResults('${song.album.title}')">${song.album.title}</span>
                        </div>
                        `;
}

// eslint-disable-next-line no-unused-vars
function selectSong(index) {
    const selectedSong = songsArray.data[Number(index)];
    getLyrics(selectedSong.artist.name, selectedSong.title);
    setSelectedTrackMeta(selectedSong);
}
