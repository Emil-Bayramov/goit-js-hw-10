import './css/styles.css';

const DEBOUNCE_DELAY = 300;

import Notiflix from 'notiflix';
var debounce = require('lodash.debounce');
import { fetchCountries } from './fetchCountries';

const countryDataWrapper = document.querySelector('.country-info');
const countriesList = document.querySelector('.country-list');
const inputRef = document.querySelector('#search-box');

inputRef.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));
function onInput(event) {
  countryDataWrapper.innerHTML = '';
  countriesList.innerHTML = '';
  if (event.target.value === '' || event.target.value.match(/\s/)) {
    return;
  }

  fetchCountries(event.target.value.trim())
    .then(data => {
      if (data.length > 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        return;
      }

      if (data.length === 1) {
        renderCountryData(data);
        stylizeCountryData();
      } else {
        renderCountriesList(data);
        stylizeCountriesList();
      }
    })

    .catch(error =>
      Notiflix.Notify.failure('"Oops, there is no country with that name"')
    );
}

function renderCountryData(arr) {
  const markup = arr
    .map(({ name, capital, population, flags, languages }) => {
      return `<div class='country-info__header'><img src='${
        flags.svg
      }' alt='flag of ${name.official}' width=30><p>${
        name.official
      }</p></div><p><b>Capital:</b> ${capital}</p><p><b>Population:</b> ${population}</p><p><b>Languages:</b> ${Object.values(
        languages
      ).join(', ')}</p>
      `;
    })
    .join('');
  countryDataWrapper.innerHTML = markup;
}
function stylizeCountryData() {
  const header = document.querySelector('.country-info__header');
  header.style.display = 'flex';
  header.style.alignItems = 'center';
  header.lastElementChild.style.marginLeft = '10px';
  header.lastElementChild.style.marginTop = '0';
  header.lastElementChild.style.marginBottom = '0';
  header.lastElementChild.style.fontSize = '35px';
  header.lastElementChild.style.fontWeight = 'bold';
}

function renderCountriesList(arr) {
  const markupList = arr
    .map(country => {
      return `<li><img src='${country.flags.svg}' alt='flag of ${country.name.official}' width=30><p>${country.name.official}</p></li>`;
    })
    .join('');
  countriesList.innerHTML = markupList;
}
function stylizeCountriesList() {
  countriesList.style.listStyle = 'none';
  countriesList.style.margin = '0';
  countriesList.style.padding = '0';

  const countriesListItems = document.querySelectorAll('li');
  countriesListItems.forEach(item => {
    item.style.display = 'flex';
    item.style.alignItems = 'center';
    item.lastElementChild.style.marginLeft = '10px';
    item.lastElementChild.style.marginTop = '0';
    item.lastElementChild.style.marginBottom = '0';
    item.lastElementChild.style.fontSize = '20px';
    item.lastElementChild.style.fontWeight = 'medium';
  });
}
