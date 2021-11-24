import './css/styles.css';
import { fetchCountries } from './js/fetchCountries.js';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const inputEl = document.querySelector('#search-box');
const listEl = document.querySelector('.country-list');
const infoEl = document.querySelector('.country-info');

const DEBOUNCE_DELAY = 300;
const cleanEl = el => (el.innerHTML = '');

const inputHandler = e => {
  const textEl = e.target.value.trim();
  if (!textEl) {
    cleanEl(listEl);
    cleanEl(infoEl);
    return;
  }
  fetchCountries(textEl)
    .then(data => {
      if (data.length > 10) {
        Notify.info('Too many matches found. Please enter a more specific name.');
        return;
      }
      renderHtml(data);
    })
    .catch(error => {
      cleanEl(listEl);
      cleanEl(infoEl);
      Notify.failure('Oops, there is no country with that name');
    });
};

const renderHtml = data => {
  if (data.length === 1) {
    cleanEl(listEl);
    const markupOneCountry = createMarkupOneCountry(data);
    infoEl.innerHTML = markupOneCountry;
  } else {
    cleanEl(infoEl);
    const markupManyCountry = createarkupManyCountry(data);
    listEl.innerHTML = markupManyCountry;
  }
};

const createarkupManyCountry = data => {
  return data
    .map(
      ({ name, flags }) =>
        `<li><img src="${flags.png}" alt="${name.official}" width="60" height="40">${name.official}</li>`,
    )
    .join('');
};

const createMarkupOneCountry = data => {
  return data.map(
    ({ name, capital, population, flags, languages }) => `<h1><img src="${flags.png}" alt="${
      name.official
    }" width="40" height="40">${name.official}</h1>
      <p>Capital: ${capital}</p>
      <p>Population: ${population}</p>
      <p>Languages: ${Object.values(languages)}</p>`,
  );
};

inputEl.addEventListener('input', debounce(inputHandler, DEBOUNCE_DELAY));
