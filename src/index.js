var debounce = require('lodash.debounce');
import Notiflix from 'notiflix';
import { fetchCountries } from './fetchCountries';
import './css/styles.css';
const DEBOUNCE_DELAY = 300;
const inputRef = document.querySelector('#search-box');
const divRef = document.querySelector('.country-info');
const listRef = document.querySelector('.country-list');

inputRef.addEventListener(
  'input',
  debounce(evt => {
    if (evt.target.value.trim() === '') {
      divRef.innerHTML = '';
      listRef.innerHTML = '';
    } else {
      fetchCountries(evt.target.value)
        .then(data => {
          divRef.innerHTML = '';
          listRef.innerHTML = '';
          if (data.length > 10) {
            Notiflix.Notify.info(
              'Too many matches found. Please enter a more specific name.'
            );
          } else if (data.length === 1) {
            divRef.innerHTML = `<div style="display:flex; align-items: center;">
        <img src=${
          data[0].flags.png
        } alt="" width="30" style="margin-right: 10px;">
    <h2>${data[0].name.official}</h2>
    </div>
    <ul style="list-style: none; padding: 0">
      <li><b>Capital: </b>${data[0].capital}</li>
      <li><b>Population: </b>${data[0].population}</li>
      <li><b>Languages: </b>${Object.values(data[0].languages)}</li>
    </ul>`;
          } else {
            data.map(country => {
              listRef.insertAdjacentHTML(
                'beforeend',
                `<li style="display: flex; align-items: center;"><img src=${country.flags.png} alt="" width="40" height="100%" style="margin-right: 20px;">
    <h2>${country.name.official}</h2></li>`
              );
            });
          }
        })
        .catch(error => {
          Notiflix.Notify.failure('Oops, there is no country with that name');
          divRef.innerHTML = '';
          listRef.innerHTML = '';
        });
    }
  }, DEBOUNCE_DELAY)
);