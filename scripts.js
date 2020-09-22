const baseUrl = 'https://api.lyrics.ovh/';

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
    } catch {
      resolve('error');
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
          // resolve();
        }
        resolve(JSON.parse(http.response));
      };
    } catch {
      resolve('error');
    }
  };
}

/**
 * update DOM
 * @param {{data: Array<{title: string}>}} results - search results
 */
function updateResults(results) {
  let htmlSchema = '';
  results.data.forEach((ele) => {
    htmlSchema += `
    <div class="result-tile" onclick="getLyrics('${ele.artist.name}', '${ele.title}')">
      <div class="album-image">
        <img src="${ele.album.cover_small}" alt="album cover" />
      </div>
      <div class="search-text">
        <div class="title">${ele.title}</div>
        <div class='description'>
          <div>Artist: <span class="artist">${ele.artist.name}</span></div>
          <div>Album: <span class="artist">${ele.album.title}</span></div>
        </div>
      </div> 
    </div>`;
  });
  return htmlSchema;
}

// eslint-disable-next-line no-unused-vars
function handleInput() {
  const searchText = document.getElementById('search').value;
  const resultsNode = document.getElementById('result-container');
  setTimeout(async () => {
    const xhrPromise = new Promise(getSuggestions(searchText));
    const response = await xhrPromise;
    const htmlString = updateResults(response);
    resultsNode.innerHTML = htmlString;
  }, 1000);
}

// eslint-disable-next-line no-unused-vars
async function getLyrics(artist, song) {
  const lyrics = document.getElementById('lyrics');
  const lyricsPromise = new Promise(getLyricsOfSong(artist, song));
  const response = await lyricsPromise;
  lyrics.innerHTML = response.lyrics;
}
