'use strict';

const getData = new GetData();
const renderData = new RenderData();

const searchButton = document.querySelector('#searchButton');
searchButton.addEventListener('click', function(e) {
  e.preventDefault();
  let query = document.querySelector('#query');
  let searchValue = query.value;
  getData.initiateRequests(searchValue)
    .done(renderData.displayData); 
});

const relatedResults = document.querySelector('.related-search-results');
relatedResults.addEventListener('click', function(e) {
  e.preventDefault();
  getData.initiateRequests(e.target.text)
    .done(renderData.displayData); 
});