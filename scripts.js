const baseUrl = 'https://api.lyrics.ovh/';
let songsArray = null;
let selectedSong = {
  "id": 88003859,
  "readable": true,
  "title": "Stairway to Heaven (Remaster)",
  "title_short": "Stairway to Heaven",
  "title_version": "(Remaster)",
  "link": "http://www.deezer.com/track/88003859",
  "duration": 482,
  "rank": 923172,
  "explicit_lyrics": false,
  "explicit_content_lyrics": 6,
  "explicit_content_cover": 0,
  "preview": "http://cdn-preview-0.deezer.com/stream/c-00bd440c9ec8b85f26d638febfda5e7c-6.mp3",
  "md5_image": "460a0edd96f743be03b7405eac38c633",
  "artist": {
    "id": 848,
    "name": "Led Zeppelin",
    "link": "http://www.deezer.com/artist/848",
    "picture": "http://api.deezer.com/artist/848/image",
    "picture_small": "http://cdn-images.deezer.com/images/artist/abb38a8ec624344816b92e24070a4f1c/56x56-000000-80-0-0.jpg",
    "picture_medium": "http://cdn-images.deezer.com/images/artist/abb38a8ec624344816b92e24070a4f1c/250x250-000000-80-0-0.jpg",
    "picture_big": "http://cdn-images.deezer.com/images/artist/abb38a8ec624344816b92e24070a4f1c/500x500-000000-80-0-0.jpg",
    "picture_xl": "http://cdn-images.deezer.com/images/artist/abb38a8ec624344816b92e24070a4f1c/1000x1000-000000-80-0-0.jpg",
    "tracklist": "http://api.deezer.com/artist/848/top?limit=50",
    "type": "artist"
  },
  "album": {
    "id": 8887733,
    "title": "Led Zeppelin IV (Deluxe Edition)",
    "cover": "http://api.deezer.com/album/8887733/image",
    "cover_small": "http://cdn-images.deezer.com/images/cover/460a0edd96f743be03b7405eac38c633/56x56-000000-80-0-0.jpg",
    "cover_medium": "http://cdn-images.deezer.com/images/cover/460a0edd96f743be03b7405eac38c633/250x250-000000-80-0-0.jpg",
    "cover_big": "http://cdn-images.deezer.com/images/cover/460a0edd96f743be03b7405eac38c633/500x500-000000-80-0-0.jpg",
    "cover_xl": "http://cdn-images.deezer.com/images/cover/460a0edd96f743be03b7405eac38c633/1000x1000-000000-80-0-0.jpg",
    "md5_image": "460a0edd96f743be03b7405eac38c633",
    "tracklist": "http://api.deezer.com/album/8887733/tracks",
    "type": "album"
  },
  "type": "track"
};

/**
 * temperaroy variables
 */
const imageURL = '';
const title = "Stairway to Heaven (Remaster)";
const preview = "http://cdn-preview-0.deezer.com/stream/c-00bd440c9ec8b85f26d638febfda5e7c-6.mp3";
const artist = "Led Zeppelin";
const artistLink = "http://api.deezer.com/artist/848/top?limit=50";
const album = "Led Zeppelin IV (Deluxe Edition)";
const albumLink = "http://api.deezer.com/album/8887733/tracks";
const lyrics = {"lyrics":"There's a lady who's sure\r\nAll that glitters is gold\r\nAnd she's buying a stairway to heaven.\r\nWhen she gets there she knows\r\nIf the stores are all closed\r\nWith a word she can get what she came for.\n\nOoh, ooh, and she's buying a stairway to heaven.\n\nThere's a sign on the wall\n\nBut she wants to be sure\n\n'Cause you know sometimes words have two meanings.\n\nIn a tree by the brook\n\nThere's a songbird who sings,\n\nSometimes all of our thoughts are misgiven.\n\nOoh, it makes me wonder,\n\nOoh, it makes me wonder.\n\nThere's a feeling I get\n\nWhen I look to the west,\n\nAnd my spirit is crying for leaving.\n\nIn my thoughts I have seen\n\nRings of smoke through the trees,\n\nAnd the voices of those who stand looking.\n\nOoh, it makes me wonder,\n\nOoh, it really makes me wonder.\n\nAnd it's whispered that soon, If we all call the tune\n\nThen the piper will lead us to reason.\n\nAnd a new day will dawn\n\nFor those who stand long\n\nAnd the forests will echo with laughter.\n\nIf there's a bustle in your hedgerow, don't be alarmed now\n\nIt's just a spring clean for the May queen.\n\nYes, there are two paths you can go by\n\nBut in the long run\n\nThere's still time to change the road you're on.\n\nAnd it makes me wonder.\n\nYour head is humming and it won't go\n\nIn case you don't know,\n\nThe piper's calling you to join him,\n\nDear lady, can you hear the wind blow,\n\nAnd did you know\n\nYour stairway lies on the whispering wind.\n\nAnd as we wind on down the road\n\nOur shadows taller than our soul.\n\nThere walks a lady we all know\n\nWho shines white light and wants to show\n\nHow ev'rything still turns to gold.\n\nAnd if you listen very hard\n\nThe tune will come to you at last.\n\nWhen all are one and one is all\n\nTo be a rock and not to roll.\n\nAnd she's buying a stairway to heaven"};



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
  songsArray = results;
  results.data.forEach((ele, index) => {
    htmlSchema += `
    <div class="result-tile" onclick="getLyrics('${ele.artist.name}', '${ele.title}'); selectSong('${index}')">
      <div class="album-image">
        <img src="${ele.album.cover_small}" alt="album cover" />
      </div>
      <div class="search-text">
        <div class="title">${ele.title.length > 28 ? `${ele.title.substr(0, 28)}...` : ele.title}</div>
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

function openLyricsNode() {
  const contentNode = document.getElementById('content');
  contentNode.style.display = 'block';
}

// eslint-disable-next-line no-unused-vars
function closeLyricsNode() {
  const contentNode = document.getElementById('content');
  contentNode.style.display = 'none';
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
  const lyricsPromise = new Promise(getLyricsOfSong(artist, song));
  const response = await lyricsPromise;
  lyricsNode.innerHTML = formatTheLyrics(response.lyrics);
  if (window.innerWidth <= 960) {
    openLyricsNode();
  }
}

// eslint-disable-next-line no-unused-vars
function selectSong(index) {
  selectedSong = songsArray.data[Number(index)];
}
