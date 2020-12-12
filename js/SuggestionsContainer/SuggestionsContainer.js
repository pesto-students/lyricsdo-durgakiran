import DOMPurify from 'dompurify';
import { dispatchQueryParamEvent } from '../Router/Router';
import Suggestions from '../Suggestions/Suggestions';
import Delayed from '../Utils/debounced';

function renderResults(id, data = []) {
    const html = Suggestions(data);

    const ele = document.getElementById(id);
    ele.innerHTML = DOMPurify.sanitize(html);
}

function getSuggestions(searchText) {
    if (!searchText) {
        return;
    }

    function fn() {
        fetch(`https://api.lyrics.ovh/suggest/${searchText}`)
            .then((res) => res.json())
            .then((res) => {
                let newSuggestions = JSON.parse(localStorage.getItem('suggestions')) || [];
                newSuggestions.push(searchText);
                newSuggestions = Array.from(new Set(newSuggestions));
                localStorage.setItem('suggestions', JSON.stringify(newSuggestions));
                renderResults('result-container', res.data);
            });
    }
    const debounce = Delayed(fn, 100, searchText);
    debounce();
}

function listenToQueryParamEvent() {
    window.addEventListener('queryParam', () => {
        const queryParamsString = window.location.search;
        const paramParser = new URLSearchParams(queryParamsString);
        const searchText = paramParser.get('suggest');

        if (searchText) {
            getSuggestions(searchText);
        }
    });
}

export default function SuggestionsContainer(searchText) {
    getSuggestions(searchText);
    listenToQueryParamEvent();
    dispatchQueryParamEvent();

    return `
    <div class="inner-container">
        <section class="results">
            <section class="results__list" id="result-container">
            </section>
        </section>
    </div>
    `;
}
