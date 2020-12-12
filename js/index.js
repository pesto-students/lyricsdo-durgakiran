/* eslint-disable no-unused-vars */
/* eslint-disable no-alert */
import '../styles/main.css';
import '../styles/header.css';
import '../styles/suggestions.css';

import DOMPurify from 'dompurify';
import Header from './Header';
import SuggestionsContainer from './SuggestionsContainer/SuggestionsContainer';
import { Router } from './Router/Router';

const id = document.getElementById('app');

const routes = new Router();

// render Header
const headerHTML = Header();

// render home page
// default search string for home page
const searchFor = 'Lenka';
const suggestions = SuggestionsContainer(searchFor);

const finalHTML = `${headerHTML} ${suggestions}`;

// add home route
routes.setUri('/', () => finalHTML);

/**
 * =======================================
 * find initial route
 * =======================================
 */
const initialRoute = window.location.pathname;

// load initial route
const { callback } = routes.getUri(initialRoute);

id.innerHTML = DOMPurify.sanitize(callback());
