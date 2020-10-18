// responsive layout

const breakingPointSmall = 600;
const breakingPointMedium = 1000;

function calculateCurrentWindowSize() {
    return window.innerWidth;
}

// eslint-disable-next-line no-unused-vars
function openSmallSearch() {
    const btn = document.getElementById('header-search-btn');
    btn.style.display = 'none';
    const smSearch = document.getElementById('header-search-sm');
    smSearch.style.display = 'inherit';
}

// eslint-disable-next-line no-unused-vars
function closeSmallSearch() {
    const btn = document.getElementById('header-search-btn');
    btn.style.display = 'inherit';
    const smSearch = document.getElementById('header-search-sm');
    smSearch.style.display = 'none';
}

function makeAppResponsive() {
    const currentWidth = calculateCurrentWindowSize();
    if (currentWidth <= breakingPointSmall) {
        const headerNavNormal = document.getElementById('header-nav-normal');
        if (headerNavNormal) headerNavNormal.style.display = 'none';
        const headerNavSmall = document.getElementById('header-nav-sm');
        if (headerNavNormal) headerNavSmall.style.display = 'flex';
    } else if (currentWidth <= breakingPointMedium) {
        const headerNavNormal = document.getElementById('header-nav-normal');
        if (headerNavNormal) headerNavNormal.style.display = 'flex';
        const headerNavSmall = document.getElementById('header-nav-sm');
        if (headerNavNormal) headerNavSmall.style.display = 'none';
    } else {
        const headerNavNormal = document.getElementById('header-nav-normal');
        if (headerNavNormal) headerNavNormal.style.display = 'flex';
        const headerNavSmall = document.getElementById('header-nav-sm');
        if (headerNavNormal) headerNavSmall.style.display = 'none';
    }
}

window.onresize = makeAppResponsive();
