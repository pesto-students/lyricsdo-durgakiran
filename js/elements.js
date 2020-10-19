/* eslint-disable no-unused-vars */
// responsive layout

const breakingPointSmall = 600;
const breakingPointMedium = 1000;

function calculateCurrentWindowSize() {
    return window.innerWidth;
}

function showLyricsForSmallScreen() {
    const lyrics = document.getElementById('lyrics-node');
    if (window.innerWidth < 960) {
        lyrics.style.display = 'inherit';
        lyrics.style.position = 'absolute';
        lyrics.style.background = '#222222';
        lyrics.style.width = '100%';
        lyrics.style.height = 'calc( 100% - 150px )';
        lyrics.style.left = '0';
    }
}
function closeLyricsForSmallScreen() {
    const lyrics = document.getElementById('lyrics-node');
    if (window.innerWidth < 960) {
        lyrics.style.display = 'none';
    }
}

function addSearchSuggestions() {
    const suggestionsNode = document.getElementById('search-suggestions');
    let html = `<div class="suggestion-actions">
                    <span class="suggestions-title">
                        Recent Searches
                    </span>
                    <span class="suggestions-btn"
                        onclick="clearSearchHistory()"
                        >
                        clear search history
                    </span>
                </div>`;
    const items = JSON.parse(localStorage.getItem('suggestions')) || [];
    items.forEach((value) => {
        html += `<div class="suggestions-item" onclick="handleInputFromHistory('${value}')">${value}</div>`;
    });
    suggestionsNode.style.display = 'block';
    suggestionsNode.innerHTML = html;
}
function clearSearchHistory() {
    localStorage.removeItem('suggestions');
    const suggestionsNode = document.getElementById('search-suggestions');
    suggestionsNode.style.display = 'none';
}

function closeSearchHistory() {
    setTimeout(() => {
        const suggestionsNode = document.getElementById('search-suggestions');
        suggestionsNode.style.display = 'none';
    }, 300);
}

function handleInputFromHistory(searchText) {
    const search = document.getElementById('search');
    search.value = searchText;
    search.dispatchEvent(new Event('input', { bubbles: true }));
}

function copyLyrics() {
    try {
        const textArea = document.getElementById('lyrics').innerText;
        const input = document.createElement('textarea');
        input.innerHTML = textArea;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
    } catch (err) {
        console.log(err);
    }
}
