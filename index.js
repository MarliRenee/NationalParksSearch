'use strict'


const searchUrl = 'https://api.nps.gov/api/v1/parks';
const apiKey = 'LCeW3P2hZIxc5otzH6EWbhM6V2gJKdwaqcwF9k7U';

function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}

function displayResults(responseJson) {
  console.log(responseJson);
  $('#results-list').empty();
  for (let i=0; i<responseJson.data.length; i++) {
    $('#results-list').append(`
      <li><h3>${responseJson.data[i].fullName}</h3>
      <p>${responseJson.data[i].description}</p>
       <a href='${responseJson.data[i].url}'>${responseJson.data[i].url}</a>
      </li>
      `)
  };
  $('#results').removeClass('hidden');
}

function getNationalParkInfo(stateCode,limit=10) {
  const params = {
    api_key: apiKey,
    stateCode: stateCode,
    limit: limit,
  };
  const queryString = formatQueryParams(params)
  const url = searchUrl + '?' + queryString;
  console.log(url);

  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayResults(responseJson))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}

function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
    const stateCode = $('#state').val();
    const limit = $('#js-max-results').val();
    getNationalParkInfo(stateCode,limit);
  });
}

$(watchForm);