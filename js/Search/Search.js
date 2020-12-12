/* eslint-disable no-unused-vars */
import DOMPurify from 'dompurify';
import SearchIcon from '../Assets/SearchIcon';
import { dispatchQueryParamEvent } from '../Router/Router';
import Delayed from '../Utils/debounced';

function addSearchParam(text) {
    const url = new URL(window.location);
    url.searchParams.set('suggest', text);
    window.history.pushState({}, '', url);
    dispatchQueryParamEvent();
}

function addBackDrop() {
    const existingBackdrop = document.getElementById('backdrop');
    if (existingBackdrop) {
        return;
    }
    const ele = document.createElement('div');
    ele.setAttribute('class', 'backdrop');
    ele.setAttribute('id', 'backdrop');
    document.body.appendChild(ele);
}

function renderSuggestions(id, suggestions = [], suggestionsTitle) {
    const suggestionsNode = document.getElementById(id);
    let html = `<div class="suggestion-actions">
                    <span class="suggestions-title">
                        ${suggestionsTitle || 'Recent Searches'}
                    </span>
                    <span class="suggestions-btn">
                        ${suggestionsTitle ? '' : 'clear search history'}
                    </span>
                </div>`;

    suggestions.forEach((value, i) => {
        html += `<div class="suggestions-item" id="${value}-i" onclick="addSearchParam('${value}')">${value}</div>`;
        document.addEventListener('click', (event) => {
            if (event.target.attributes.id.value === `${value}-i`) {
                addSearchParam(value);
                suggestionsNode.innerHTML = '';
                suggestionsNode.style.display = 'none';
                document.body.removeChild(document.getElementById('backdrop'));
            }
        });
    });
    suggestionsNode.style.display = 'block';
    suggestionsNode.innerHTML = DOMPurify.sanitize(html);
    addBackDrop();
}

export default function Search() {
    let suggestions = '';

    const showSuggestions = (event) => {
        if (event.srcElement.id === 'search') {
            suggestions = JSON.parse(localStorage.getItem('suggestions')) || [];
            renderSuggestions('search-suggestions', suggestions);
        }
    };

    const hideSuggestions = (event) => {
        if (event.srcElement.id === 'backdrop') {
            const suggestionsNode = document.getElementById('search-suggestions');
            suggestionsNode.innerHTML = '';
            suggestionsNode.style.display = 'none';
            document.body.removeChild(document.getElementById('backdrop'));
        }
    };

    const getSuggestions = (event) => {
        if (event.srcElement.id !== 'search') {
            return;
        }

        const searchText = document.getElementById('search').value;

        if (!searchText) {
            return;
        }

        function fn() {
            fetch(`https://api.lyrics.ovh/suggest/${searchText}`)
                .then((res) => res.json())
                .then((res) => {
                    // const newSuggestions = JSON.parse(localStorage.getItem('suggestions')) || [];
                    // newSuggestions.push(searchText);
                    // localStorage.setItem('suggestions', JSON.stringify(newSuggestions));
                    renderSuggestions('search-suggestions', res.data.map((value) => value.title), 'Suggestions');
                });
        }
        const debounce = Delayed(fn, 300, Search);
        debounce();
    };

    // event listener so that dynamically append suggestions
    document.addEventListener('click', showSuggestions);
    // event listener to close suggestions
    document.addEventListener('click', hideSuggestions);
    document.addEventListener('input', getSuggestions);

    return `
    <div class="header__search">
        <div class="header__search-icon">
            ${DOMPurify.sanitize(SearchIcon())}
        </div>
        <input
            type="search"
            placeholder="Search for lyrics you love..."
            id="search"
            autocomplete="off"
        />
        <div class="header__search-suggestions" id="search-suggestions">
        </div>
    </div>`;
}
