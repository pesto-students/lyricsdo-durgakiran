const baseUrl = "https://api.lyrics.ovh/";
let songsArray = null;
let inputInterval;
let pageIndex = 0;
let pageSize = 5;

function getLyricsOfSong(artist, song) {
    return (resolve) => {
        try {
            const http = new XMLHttpRequest();
            http.open("get", `${baseUrl}v1/${artist}/${song}`);
            http.send();
            http.onload = () => {
                if (http.status !== 200) {
                    throw new Error("error");
                }
                resolve(JSON.parse(http.response));
            };
            http.onerror = () => {
              throw new Error("Something bad happened");
          };
        } catch {
          resolve("Something bad happened :(");
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
            http.open("get", `${baseUrl}suggest/${searchText}`);
            http.send();
            http.onload = () => {
                if (http.status !== 200) {
                    throw new Error("error");
                }
                resolve(JSON.parse(http.response));
            };
            http.onerror = () => {
                throw new Error("Something bad happened");
            };
        } catch {
            resolve("Something bad happened :(");
        }
    };
}

function getNextPageData(pageIndex = 0, pageSize = 5) {
  return songsArray.data.slice(pageIndex, (pageSize + pageIndex));
}

function handlePagination(type) {
  const resultsNode = document.getElementById("result-container");
  if(type === 'next' && (pageIndex + pageSize) < songsArray.data.length ) {
    pageIndex = pageIndex + pageSize
    const results = getNextPageData(pageIndex);
    const  htmlString = updateResults(results);
    resultsNode.innerHTML = htmlString;
  } else if(type === 'prev' && (pageIndex - pageSize) >= 0){
    pageIndex = pageIndex - pageSize
    const results = getNextPageData(pageIndex);
    const  htmlString = updateResults(results);
    resultsNode.innerHTML = htmlString;
  }
  updatePageActions();
}


function updatePageActions() {
  const actionsNode = document.getElementById('pageActions');
  if(pageIndex === 0 && songsArray.data.length > pageSize) {
    actionsNode.innerHTML = 
    `<button class="page-buttons" onclick="handlePagination('next')">Next</button>`;
  } else if (pageIndex > 0 && pageIndex < (songsArray.data.length - pageSize)) {
    actionsNode.innerHTML = 
    `<button class="page-buttons" onclick="handlePagination('prev')">Prev</button>
    <button class="page-buttons" onclick="handlePagination('next')">Next</button>`;
  } else if (songsArray.data.length !== 0 &&  pageIndex >= (songsArray.data.length - pageSize) ) {
    actionsNode.innerHTML = 
    `<button class="page-buttons" onclick="handlePagination('prev')">Prev</button>`;
  } else {
    actionsNode.innerHTML = ``;
  }
}

/**
 * update DOM
 * @param {{data: Array<{title: string}>}} results - search results
 */
function updateResults(results) {
    let htmlSchema = "";
    results.forEach((ele, index) => {
        htmlSchema += `
    <div class="result-tile" onclick="selectSong(${Number(index)})">
      <div class="album-image">
        <img src="${ele.album.cover_small}" alt="album cover" />
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
function handleInput() {
    const searchText = document.getElementById("search").value;
    fetchSearchResults(searchText);
}

function fetchSearchResults(searchText) {
    const resultsNode = document.getElementById("result-container");
    clearTimeout(inputInterval);
    inputInterval = setTimeout(async () => {
        if(window.innerWidth <= 960) closeLyricsNode();
        addLoaderInGetList();
        const xhrPromise = new Promise(getSuggestions(searchText));
        const response = await xhrPromise;
        songsArray = response;
        pageIndex = 0;
        const firstPageResults = getNextPageData(pageIndex);
        const htmlString = updateResults(firstPageResults);
        updatePageActions();
        resultsNode.innerHTML = htmlString ? htmlString : 'No Results Found';
    }, 1000);
}

function openLyricsNode() {
    const contentNode = document.getElementById("content");
    contentNode.style.display = "block";
}

// eslint-disable-next-line no-unused-vars
function closeLyricsNode() {
    const contentNode = document.getElementById("content");
    contentNode.style.display = "none";
}

/**
 *
 * @param {string} lyrics - lyrics string of the song
 */
function formatTheLyrics(lyrics) {
    return lyrics.replace(/\n/g, "<br />");
}

// eslint-disable-next-line no-unused-vars
async function getLyrics(artist, song) {
    const lyricsNode = document.getElementById("lyrics");
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
    const imageNode = document.getElementById("selAlbumImg");
    const titleNode = document.getElementById("selTitleHeading");
    const metaNode = document.getElementById("meta");

    imageNode.innerHTML = `<img src="${song.album.cover_big}" alt="Album image"/>`;
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

/**
 * loaders
 */
function addLoaderToLyrics() {
    const lyricsNode = document.getElementById("lyrics");
    lyricsNode.innerHTML = `<div class="vertical-center">${getLoader()}</div>`;
}

function addLoaderInGetList() {
    const resultsNode = document.getElementById("result-container");
    resultsNode.innerHTML = `<div class="user-msg">${getLoader()}</div>`;
}

function getLoader() {
    return `<?xml version="1.0" encoding="utf-8"?>
   <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="margin: auto; background: rgb(255, 255, 255); display: block; shape-rendering: auto;" width="40px" height="40px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
   <g transform="rotate(0 50 50)">
     <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#ff5722">
       <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.9166666666666666s" repeatCount="indefinite"></animate>
     </rect>
   </g><g transform="rotate(30 50 50)">
     <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#ff5722">
       <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.8333333333333334s" repeatCount="indefinite"></animate>
     </rect>
   </g><g transform="rotate(60 50 50)">
     <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#ff5722">
       <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.75s" repeatCount="indefinite"></animate>
     </rect>
   </g><g transform="rotate(90 50 50)">
     <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#ff5722">
       <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.6666666666666666s" repeatCount="indefinite"></animate>
     </rect>
   </g><g transform="rotate(120 50 50)">
     <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#ff5722">
       <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.5833333333333334s" repeatCount="indefinite"></animate>
     </rect>
   </g><g transform="rotate(150 50 50)">
     <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#ff5722">
       <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.5s" repeatCount="indefinite"></animate>
     </rect>
   </g><g transform="rotate(180 50 50)">
     <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#ff5722">
       <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.4166666666666667s" repeatCount="indefinite"></animate>
     </rect>
   </g><g transform="rotate(210 50 50)">
     <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#ff5722">
       <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.3333333333333333s" repeatCount="indefinite"></animate>
     </rect>
   </g><g transform="rotate(240 50 50)">
     <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#ff5722">
       <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.25s" repeatCount="indefinite"></animate>
     </rect>
   </g><g transform="rotate(270 50 50)">
     <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#ff5722">
       <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.16666666666666666s" repeatCount="indefinite"></animate>
     </rect>
   </g><g transform="rotate(300 50 50)">
     <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#ff5722">
       <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.08333333333333333s" repeatCount="indefinite"></animate>
     </rect>
   </g><g transform="rotate(330 50 50)">
     <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#ff5722">
       <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="0s" repeatCount="indefinite"></animate>
     </rect>
   </g>
   <!-- [ldio] generated by https://loading.io/ --></svg>`;
}

