import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './js/fetchCountries';

const DEBOUNCE_DELAY = 300;

const searchBox = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

searchBox.addEventListener('input', debounce(renderCountry, DEBOUNCE_DELAY));

function renderCountry() {
  const searchBoxValue = searchBox.value.trim();
  clearRender();

  if (searchBoxValue !== '') {
    fetchCountries(searchBoxValue).then(checkValue);
  }
}

function clearRender() {
  countryInfo.textContent = '';
  countryList.textContent = '';
}

function checkValue(string) {
  if (string.length > 10) {
    Notify.info('Too many matches found. Please enter a more specific name.');
  } else if (string.length === 0) {
    Notify.failure('Oops, there is no country with that name');
  } else if (string.length >= 2 && string.length <= 10) {
    renderListCountry(string);
  } else {
    renderListCountry(string);
    renderInfoOneCountry(string);
  }
}

function renderListCountry(countries) {
  const markup = countries
    .map(country => {
      return `<li class="country-list__item">
        <img src="${country.flags.svg}" alt="flag" width="40" hight="30"/>
        <p><b>${country.name.official}</b></p>
      </li>`;
    })
    .join('');
  countryList.innerHTML = markup;
}

function renderInfoOneCountry(countries) {
  const markup = countries
    .map(country => {
      const lang = Object.values(country.languages).join(', ');
      return `
          <p><b>Capital:</b> ${country.capital}</p>
          <p><b>Population:</b> ${country.population}</p>
          <p><b>Languages:</b> ${lang}</p>`;
    })
    .join('');
  countryInfo.innerHTML = markup;
}
