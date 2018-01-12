/*global $ */
'use strict';

const TASTEDIVE_CONFIG = {
  baseUrl: 'https://tastedive.com/api',
  endpoint: '/similar'
};

const SEATGEEK_CONFIG = {
  baseUrl: 'https://api.seatgeek.com/2',
  endpoint: '/events',
  client_id: 'MTAxOTEwMDl8MTUxNTAxMzk2My43OQ'
};

$(watchSubmit);

function watchSubmit() {
  $('.js-search-form').on('submit', function(event) {
    event.preventDefault();
    $('.search-results').removeClass('hidden');
    const queryTarget = $(event.currentTarget).find('.js-query');
    const query = queryTarget.val();
    initiateRequests(query);
    queryTarget.val('');
  });
}

function getTastediveData(config, artist){
  const url = config.baseUrl + config.endpoint;
  const query = {
        data: {
            q: `${artist}`,
            type: 'music',
            info: 1,
            limit: 20,
            k: '293729-MusicSav-F68RALT7'
        },
        dataType: 'jsonp',
        method: 'get', 
        url
    };
  return $.ajax(query);
}

function getSeatgeekData(config, artist){
  const url = config.baseUrl + config.endpoint;
  const query = {
    data: {
      'performers.slug': artist.replace(/\s/g, '-').toLowerCase(),
      client_id: config.client_id
    },
    dataType: 'json',
    method: 'get',
    url
  };
  return $.ajax(query);
}

function initiateRequests(searchTerm) {
  $.when(
  getTastediveData(TASTEDIVE_CONFIG, searchTerm), getSeatgeekData(SEATGEEK_CONFIG, searchTerm)
  ).done(displayData);
}

function displayData(tastediveRes, seatgeekRes) {
  const tastediveData = tastediveRes[0];
  const seatgeekData = seatgeekRes[0];
  // console.log(tastediveData.Similar.Results[0].wUrl);
  
  // Tastedive data
  let initialSearch = tastediveData.Similar.Info[0];
  const tdData = {
    musicianName: initialSearch.Name,
    type: initialSearch.Type,
    teaser: initialSearch.wTeaser,
    readMore: initialSearch.wUrl,
    youtubeUrl: initialSearch.yUrl,
    youtubeID: initialSearch.yID
  };
  
  // Seatgeek data
  let numberOfShows = seatgeekData.meta.total;
  if (numberOfShows === 0) {
    $('.initial-search-results').html(generateInitalSearchResults(tdData));
    showSearchDataWithNoShows();
      } else {
        let concertSearch = seatgeekData.events[0];
        let title = concertSearch.title;
        let venueName = concertSearch.venue.name;
        let location = concertSearch.venue.display_location;
        let date = moment(concertSearch.datetime_local).format('MMMM Do YYYY, h:mm a');
        let buyTicketsLink = concertSearch.url;
    $('.initial-search-results').html(generateInitalSearchResults(tdData, title, venueName, location, date, buyTicketsLink));
    $('.no-shows-notification').remove();
    showInitialSearchData();
  }
  
  // Tastedive related data
  let relatedSearch = tastediveData.Similar.Results;
  let results = '';
  let current;
  for (let i = 0; i < relatedSearch.length; i++) {
    current = relatedSearch[i];
    const relatedData = {
      name: current.Name,
      type: current.Type,
      teaser: current.wTeaser,
      readMore: current.wUrl,
      youtubeUrl: current.yUrl,
      youtubeID: current.yID
      };
        results += generateRelatedSearchResults(relatedData);
      }
        $('.related-search-results').html(results);
        showRelatedSearchData();
  
  // No search results
  let noType = tastediveData.Similar.Info[0].Type;
  if (noType === 'unknown') {
    $('.no-search-results').removeClass('hidden').html(generateNoResults);
    $('.search-results').addClass('hidden');
  }
}

function generateNoResults() {
  return `
    <h3>Sorry that search does not exist.<br> Please try a different search.</h3>
    `;
}

function showSearchDataWithNoShows() {
  $('.ticket-info').remove();
  $('.ticket-link').remove();
  $('.no-search-results').addClass('hidden');

  $('.initial-search-results').on('click', '.show-initial-data-btn', function(event) {
    $('.js-initial-data').addClass('active');
    $('.show-initial-data-btn').addClass('hidden');
    $('.tease-read').removeClass('hide-overflow');
    $('.read-link').addClass('hidden');
  });
  
  $('.initial-search-results').on('click','.hide-initial-data-btn', function(event) {
    $('.js-initial-data').removeClass('active');
    $('.show-initial-data-btn').removeClass('hidden');
    $('.tease-read').addClass('hide-overflow');
    $('.read-link').removeClass('hidden');
  });
}

function showInitialSearchData() {
  $('.no-search-results').addClass('hidden');

  $('.initial-search-results').on('click', '.show-initial-data-btn', function(event) {
    event.preventDefault();
    $('.js-initial-data').addClass('active');
    $('.show-initial-data-btn').addClass('hidden');
    $('.tease-read').removeClass('hide-overflow');
    $('.read-link').removeClass('hidden');
    $('.performance-info').prop('hidden', false);
  });
    
  $('.initial-search-results').on('click','.hide-initial-data-btn', function(event) {
    $('.js-initial-data').removeClass('active');
    $('.show-initial-data-btn').removeClass('hidden');
    $('.hide-initial-data-btn').addClass('hidden');
    $('.tease-read').addClass('hide-overflow');
    // $('.read-link').addClass('hidden');
    $('.performance-info').prop('hidden', true);
  });
} 

function generateInitalSearchResults(tDiveData, name, venueTitle, address, day, purchaseLink) {
  const {musicianName, type, teaser, readMore, youtubeUrl, youtubeID} = tDiveData;
  return `
  <div class="js-search-results">
    <h2 class="artist-name">If you like<br> ${musicianName}</h2>
      <iframe id="ytplayer" type="text/html" allowfullscreen="allowfullscreen" src="https://www.youtube.com/embed/${youtubeID}" frameborder="0" class="initial-iframe" title="Youtube Video"></iframe>
      <div class="artist-name-and-data">
          <div class='js-initial-data initial-data'>
            <div class="read-and-link-container">
              <div class="tease-read-container">
                <p class="tease-read hide-overflow">${teaser}</p>
              </div>
              <div class="center-link">
                <a href="${readMore}" class="read-link hidden" target="_blank">Learn more&#10064;</a>
              </div>
            </div> 
            <div class="performance-info" hidden> 
              <h3 class="performance-banner">Upcoming Performance</h3>
                <p class="no-shows-notification">No shows coming up..</p>
                  <div class='ticket-info'>
                    <p class="show-date">${day}</p>
                    <p class="show-name">${name}</p>
                    <p class="show-title-address">${venueTitle} ${address}</p>
                  </div>
                  <div class="center-link">
                    <a href="${purchaseLink}" target="_blank" class="ticket-link">Buy Tickets&#10064;</a>
                  </div>
            </div>
            <button class="hide-initial-data-btn">See less</button>
          </div>
          <button class="show-initial-data-btn">See more</button>
      </div>
  </div>
  <div class="center-check-out">
    <h2 class="check-out">Check out</h2>
  </div>
  `;
}

function showRelatedSearchData() {
  $('.related-search-results').on('click', '.related-artist-name', function(event) {
    initiateRequests(event.target.text.toLowerCase());
    $('.initial-iframe').remove();
  });
}


function generateRelatedSearchResults(data) {
  const {name, type, teaser, readMore, youtubeUrl, youtubeID} = data;
  return `
    <div class="related-music-container">
      <a href="#" class="related-artist-name hover">${name}</a>
    </div>
  `;
}