let cards = [];
let countries = [];
const regions = [];
const languages = [];
const timesZone = [];
const currencies = [];

document.addEventListener('DOMContentLoaded', function() {
    init();
}, false);

//get info from api
function getCountries() {
    return new Promise((resolve, reject) => {
        fetch('https://restcountries.eu/rest/v2/all')
            .then(response => response.json())
            .then(data => resolve(data))
            .catch((error) => reject(error));
    })
}

//ccreate cards
function generateCard(country) {
    return `<div class="country-card">
       <div id="image-div"><img src="${country.flag}" alt="flag" id="flag-image"></div>
       <div id="moreInfo-container">
       <div class="info-cards">
       <div>Region: ${country.region}</div>
       <div>Country: ${country.name} </div> 
       <div>Capital: ${country.capital}</div>
       <div>Population: ${country.population}</div> </div>
       <div id="readMore-div"><button id="readMore-button" onclick="readMoreInfo()">Read more</button></div>
        </div>
    </div>`
}


function renderCards() {
    const cardsContainer = document.getElementById("cards")
    if (!cardsContainer) {
        return;
    }

    let cardsHtml = "";
    for (let i = 0; i < cards.length; i++) {
        cardsHtml = cardsHtml + cards[i];
    }
    cardsContainer.innerHTML = cardsHtml;
}

function searchCountries(searchKey, countries) {
    if (!searchKey) {
        return countries;
    }

    return countries.filter((currentCountry) => {
        return currentCountry.name.toLowerCase().indexOf(searchKey) !== -1 ||
            currentCountry.capital.toLowerCase().indexOf(searchKey) !== -1 ||
            currentCountry.alpha2Code.toLowerCase().indexOf(searchKey) !== -1 ||
            currentCountry.alpha3Code.toLowerCase().indexOf(searchKey) !== -1
    })
}


//initialize cards list
async function init() {
    countries = await getCountries();

    for (let i = 0; i < countries.length; i++) {
        const currentCountry = countries[i];

        const currentCard = generateCard(currentCountry);
        cards.push(currentCard);

        //dropDowns
        if (regions.indexOf(currentCountry.region) === -1 && currentCountry.region !== "") {
            regions.push(currentCountry.region);
        }

        for (let j = 0; j < currentCountry.languages.length; j++) {
            const currLanguage = currentCountry.languages[j];
            if (languages.indexOf(currLanguage.name) === -1) {
                languages.push(currLanguage.name)
            }
        }

        for (let j = 0; j < currentCountry.timezones.length; j++) {
            const currTimesZone = currentCountry.timezones[j];
            if (timesZone.indexOf(currTimesZone) === -1) {
                timesZone.push(currTimesZone);
            }
        }

        for (let j = 0; j < currentCountry.currencies.length; j++) {
            const currentCurrecy = currentCountry.currencies[j];
            if (currencies.indexOf(currentCurrecy.name) === -1) {
                currencies.push(currentCurrecy.name);
            }
        }
    }
    populateRegionDropDown();
    populateLanguageDropdown();
    populateTimeZoneDropDown();
    populateCurrencyDropdown();
    renderCards();
}

//search country by different attributes
function triggerCountriesSearch() {
    const searchInputValue = document.getElementById("search").value;
    const regionDropdownValue = document.getElementById("region").value;
    const languageDropdownValue = document.getElementById("languages").value;
    const timeZoneDropdownValue = document.getElementById("timeZone").value;
    const currenciesDropdownValue = document.getElementById("currency").value;
    const minPopulationInputValue = document.getElementById("minPopulation").value;
    const maxPopulationInputValue = document.getElementById("maxPopulation").value;

    let searchedCountries = searchCountries(searchInputValue.toLowerCase(), countries);

    if (regionDropdownValue) {
        searchedCountries = searchedCountries.filter(currentCountry => {
            return currentCountry.region === regionDropdownValue;
        })
    }

    if (languageDropdownValue) {
        searchedCountries = searchedCountries.filter(currentCountry => {
            return currentCountry.languages.some((currentLanguage) => {
                return currentLanguage.name === languageDropdownValue;
            })
        })
    }

    if (timeZoneDropdownValue) {
        searchedCountries = searchedCountries.filter(currentCountry => {
            return currentCountry.timezones.some((currentTime) => {
                return currentTime === timeZoneDropdownValue;
            })
        })
    }

    if (currenciesDropdownValue) {
        searchedCountries = searchedCountries.filter(currentCountry => {
            return currentCountry.currencies.some((currentC) => {
                return currentC.name === currenciesDropdownValue;
            })
        })
    }

    if (minPopulationInputValue) {
        searchedCountries = searchedCountries.filter(currentCountry => {
            return currentCountry.population >= parseInt(minPopulationInputValue);
        })
    }

    if (maxPopulationInputValue) {
        searchedCountries = searchedCountries.filter(currentCountry => {
            return currentCountry.population <= parseInt(maxPopulationInputValue);
        })
    }

    let messageElement = document.getElementById("message");
    if (searchedCountries.length === 0) {
        messageElement.classList.remove("hidden");
        messageElement.classList.add("visible");
    } else {
        messageElement.classList.add("hidden");
        messageElement.classList.remove("visible");
    }

    cards = []
    for (let i = 0; i < searchedCountries.length; i++) {
        const returnedCard = generateCard(searchedCountries[i]);
        cards.push(returnedCard)
    }

    renderCards();
}


//populate the dropdown buttons
function populateRegionDropDown() {
    const listRegion = document.getElementById("region");
    for (let i = 0; i < regions.length; i++) {
        let option = document.createElement("option");
        option.text = regions[i];
        listRegion.add(option);
    }
}

function populateLanguageDropdown() {
    const listLanguage = document.getElementById("languages");
    for (let i = 0; i < languages.length; i++) {
        let option = document.createElement("option");
        option.text = languages[i];
        listLanguage.add(option);

    }
}

function populateTimeZoneDropDown() {
    const listTime = document.getElementById("timeZone");
    for (let i = 0; i < timesZone.length; i++) {
        let option = document.createElement("option");
        option.text = timesZone[i];
        listTime.add(option);
    }
}

function populateCurrencyDropdown() {
    const listCurrency = document.getElementById("currency");
    for (let i = 0; i < currencies.length; i++) {
        let option = document.createElement("option");
        option.text = currencies[i];
        listCurrency.add(option);
    }
}