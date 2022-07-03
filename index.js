"use strict";

window.onload = function RefeschData() {
  UpdateTablesPrices();
};

let date = new Date();
date = date.toDateString().split(' ');
let year = date[3];
let month = date[1];
const months = { // Le da formato de 2 digitos a los meses
  'Jan': '01',
  'Feb': '02',
  'Mar': '03',
  'Apr': '04',
  'May': '05',
  'Jun': '06',
  'Jul': '07',
  'Aug': '08',
  'Sep': '09',
  'Oct': '10',
  'Nov': '11',
  'Dec': '12'
}
let day = date[2];

// cryptocurrency es el top4 criptomonedas del mercado, posicion:[nombre, clave, precio]
const cryptocurrency = {
  'first': ['Bitcoin', 'BTC', 0],
  'second': ['Ethereum', 'ETH', 0],
  'third': ['Binance USD', 'BUSD', 0],
  'fourth': ['Cardano', 'ADA', 0]
}
// currency es el top4 monedas del mercado, posicion:[nombre, clave, precio]
const currency = {
  'first': ['Euro', 'EUR', 0],
  'second': ['Dolar', 'USD', 0],
  'third': ['Dolar Canada', 'CAD', 0],
  'fourth': ['Peso Colombia', 'COP', 0]
}

const BaseCurrency = 'USD';
const SourceData = 'crypto';
let startDate = `${year}-${months[month]}-${day}`;
const BaseUrl = `https://api.exchangerate.host`;
let parameters = `/timeseries?start_date=${startDate}&end_date=${startDate}&source=${SourceData}&base=${BaseCurrency}`;

async function GetDataFromAPI() {
  try {
    let res = await fetch(BaseUrl + parameters);
    let data = await res.json();
    let rates = data.rates;
    return rates;
  } catch (error) {
      let msg = error;
      console.error(msg);
  }
}

// FormatData: agrega en cada elemento el precio obtenido desde la API.
// Si el elemento es Bitcoin realiza la operacion para mostrar el precio en dolares.
function FormatData(data, object) {
  for (let coin of Object.values(object)) {
    (coin[0] == 'Bitcoin' || coin[0] == 'Peso Colombia') ? coin[2] = (1 / data[coin[1]]).toFixed(5) : coin[2] = data[coin[1]].toFixed(2);
  }
}

// ReplaceDataInTable: reemplaza los datos en la estructura de la tabla del HTML.
function ReplaceDataInTable(currency) {
  return `
    <tr>
      <td class="table__left table__top-left">${currency.first[0]}</td>
      <td class="table__right table__top-right">$ ${currency.first[2]} <span class="trending-up"></span></td>
    </tr>
    <tr>
      <td class="table__left">${currency.second[0]}</td>
      <td class="table__right">$ ${currency.second[2]} <span class="trending-down"></span></td>
    </tr>
    <tr>
      <td class="table__left">${currency.third[0]}</td>
      <td class="table__right">$ ${currency.third[2]} <span class="trending-up"></span></td>
    </tr>
    <tr>
      <td class="table__left table__bottom-left">${currency.fourth[0]}</td>
      <td class="table__right table__bottom-right">$ ${currency.fourth[2]} <span class="trending-down"></span></td>
    </tr>
  `;
}

// LastUpdateTime: reemplaza la fecha de la ultima actualizacion de los datos.
function LastUpdateTime() {
  let htmlElement = document.getElementsByClassName('last-update');

  htmlElement[0].innerHTML = `<p><b>Actualizado:</b> ${startDate.split('-').join(' / ')}</p>`;
  htmlElement[1].innerHTML = `<p><b>Actualizado:</b> ${startDate.split('-').join(' / ')}</p>`;
}

async function UpdateTablesPrices() {
  let tableCryptocurrency = document.getElementById('table--currency');
  let tableCurrency = document.getElementById('table--commision');

  let dataFromApi = await GetDataFromAPI();
  
  FormatData(dataFromApi[startDate], cryptocurrency);
  FormatData(dataFromApi[startDate], currency);

  let newTableCryptocurrency = ReplaceDataInTable(cryptocurrency);
  let newTableCurrency = ReplaceDataInTable(currency);

  LastUpdateTime();

  tableCryptocurrency.firstElementChild.innerHTML = newTableCryptocurrency;
  tableCurrency.firstElementChild.innerHTML = newTableCurrency;
}

// Modal de seleccion de un plan
function showModal() {
  let modal = document.getElementsByClassName('modal-container');
  modal[0].classList.remove('hide');
}

function hideModal() {
  let modal = document.getElementsByClassName('modal-container');
  modal[0].classList.add('hide');
}
