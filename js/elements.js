function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

/**
 * dynamically change the search placeholder
 */
function changePlaceHolderValue() {
    const inputElement = document.getElementById('search');
    const placeHolders = ['Search Artist...', 'Search Album...', 'Search Title...'];
    setInterval(() => {
        inputElement.placeholder = placeHolders[randomIntFromInterval(0, 2)]
    }, 1000);
}