'use strict';

const acceptHeader = "application/vnd.github.mercy-preview+json";

function displayUserOrRepoNotFound(userHandle){
  $('#js-status-message').text(`The user ${userHandle} cannot found or doesn't have any repos`);
  $('#js-status-message').removeClass('hidden');
}
function displayResults(responseJson) {
  $('#results-list').empty();
  responseJson.forEach( repo => {
    $('#results-list').append(
      `<li><h4><a href="${repo.html_url}">${repo.name}</a></h4></li>`
    );
  });
  $('#results').removeClass('hidden');
};

function getRepoInfo(userHandle) {
  const searchURL = `https://api.github.com/users/${userHandle}/repos`;

  const options = {
    headers: new Headers({
      "Accept": acceptHeader})
  };

  fetch(searchURL, options)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => {
      if(responseJson.length > 0){
        displayResults(responseJson)
      }else{
        displayUserOrRepoNotFound(userHandle);
      }
    })
    .catch(err => {
      $('#js-status-message').text(`Something went wrong: ${err.message}`);
    });
}

function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
    $('#js-status-message').addClass('hidden');
    $('#results').addClass('hidden');
    const searchHandle = $('#js-search-term').val();
    getRepoInfo(searchHandle);
  });
}

$(watchForm);