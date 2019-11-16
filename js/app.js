'use strict';

const getData = new GetData();
const renderData = new RenderData();
const searchButton = document.querySelector('#searchButton');
const query = document.querySelector('#query');

searchButton.addEventListener('click', function(e) {
  e.preventDefault();
  const searchValue = query.value;
  getData.initiateRequests(searchValue)
    .done(renderData.displayData); 
});