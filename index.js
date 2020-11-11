"use strict";

function formatQueryParams(params) {
  const queryItems = Object.keys(params).map(
    (key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
  );
  return queryItems.join("&");
}

function displayResults(responseJson, maxResults) {
  $("#results-list").empty();
  if (responseJson.data.length) {
    for (let i = 0; (i < responseJson.data.length) & (i < maxResults); i++) {
      $("#results-list").append(
        `<li>
        <h3><a href="${responseJson.data[i].url}" target="_blank">${responseJson.data[i].fullName}</a></h3>
        <p>${responseJson.data[i].description}</p>
        <p>Address:</p>
        <p>City: ${responseJson.data[i].addresses[0].city}</p>
        <p>${responseJson.data[i].addresses[0].line1}</p>
        <p>${responseJson.data[i].addresses[0].line2}</p>
        <p>${responseJson.data[i].addresses[0].line3}</p>
        <p>${responseJson.data[i].addresses[0].postalCode}</p>
        <br>
          </li>`
      );
    }
  } else {
    $("#results-list").append(
      `<li>
      No parks for this state or State code is not right
        </li>`
    );
  }

  $("#results").removeClass("hidden");
  $("#max-results").val(10);
}

function getParks(state, maxResults = 10) {
  const params = {
    stateCode: state,
    limit: maxResults,
  };
  const queryString = formatQueryParams(params);

  let searchURL =
    "https://developer.nps.gov/api/v1/parks?api_key=oIEZUlME1mdKBqKdJebcVMddJRWDiRqEzMjbynFA";
  searchURL += "&" + queryString;

  fetch(searchURL)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then((responseJson) => displayResults(responseJson, maxResults))
    .catch((err) => {
      $("#error-message").text(`Something went wrong: ${err.message}`);
    });
}

function watchForm() {
  $("form").submit((event) => {
    event.preventDefault();
    const state = $("#state").val();
    const maxResults = $("#max-results").val();
    getParks(state, maxResults);
  });
}

$(watchForm);
