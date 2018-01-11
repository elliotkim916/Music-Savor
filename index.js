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

$(function() {
  watchSubmit();
});

function watchSubmit() {
  $('.js-search-form').on('submit', function(event) {
    event.preventDefault();
    const queryTarget = $(event.currentTarget).find('.js-query');
    const query = queryTarget.val();
    initiateRequests(query);
    queryTarget.val('');
    $('.check-out').prop('hidden', false);
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
  // TODO: call me in your submit handler. Use $.when()
  // along with our two `get` methods, but instead of hard-coding `beyonce`,
  // pass through whatever the user has searched for.
  
  $.when(
  getTastediveData(TASTEDIVE_CONFIG, searchTerm), getSeatgeekData(SEATGEEK_CONFIG, searchTerm)
).done(displayData);
}

function displayData(tastediveRes, seatgeekRes){
  /**
   * `$.when()` wraps responses in an array.
   * The data we want is at the zeroeth index of that array
   */
  const tastediveData = tastediveRes[0];
  const seatgeekData = seatgeekRes[0];
  
  // console.log(tastediveData.Similar.Results[0].wUrl);
  
  // Tastedive data
  let initialSearch = tastediveData.Similar.Info[0];
  let name = initialSearch.Name;
  let type = initialSearch.Type;
  let teaser = initialSearch.wTeaser;
  let readMore = initialSearch.wUrl;
  let youtubeURL = initialSearch.yUrl;
  let youtubeID = initialSearch.yID;
  
  // Seatgeek data
  let numberOfShows = seatgeekData.meta.total;
  if (numberOfShows === 0) {
    $('.initial-search-results').html(generateInitalSearchResults(name, type, teaser, readMore, youtubeURL, youtubeID));
    showSearchDataWithNoShows();
      } else {
        let concertSearch = seatgeekData.events[0];
        let title = concertSearch.title;
        let venueName = concertSearch.venue.name;
        let location = concertSearch.venue.display_location;
        let date = moment(concertSearch.datetime_local).format('MMMM Do YYYY, h:mm a');
        let buyTicketsLink = concertSearch.url;
    $('.initial-search-results').html(generateInitalSearchResults(name, type, teaser, readMore, youtubeURL, youtubeID, title, venueName, location, date, buyTicketsLink));
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
}

function showSearchDataWithNoShows() {
  $('.ticket-info').remove();
  $('.ticket-link').remove();
  
  $('.initial-search-results').on('click', '.show-initial-data-btn', function(event) {
    event.stopPropagation();
    $('.js-initial-data').addClass('active');
    $('.show-initial-data-btn').addClass('hidden');
  });
  
  $('.initial-search-results').on('click','.hide-initial-data-btn', function(event) {
    event.stopPropagation();
    $('.js-initial-data').removeClass('active');
    $('.show-initial-data-btn').removeClass('hidden');
  });
}

function showInitialSearchData() {
    $('.initial-search-results').on('click', '.show-initial-data-btn', function(event) {
      event.preventDefault();
      event.stopPropagation();
      $('.js-initial-data').addClass('active');
      $('.show-initial-data-btn').addClass('hidden');
    });
    
    $('.initial-search-results').on('click','.hide-initial-data-btn', function(event) {
      event.stopPropagation();
      $('.js-initial-data').removeClass('active');
      $('.show-initial-data-btn').removeClass('hidden');
    });
} 

function generateInitalSearchResults(title, style, tease, read, ytURL, ytID, name, venueTitle, address, day, purchaseLink) {
  return `
  <div class="js-search-results">
    <h2 class="artist-name">If you like ${title}</h2>
      <iframe style="position:relative; top:-25px; "id="ytplayer" type="text/html" width="500" height="270" src="https://www.youtube.com/embed/${ytID}" frameborder="0" class="initial-iframe"></iframe>
      <div class="artist-name-and-data">
        <button class="show-initial-data-btn">Show &#8595;</button>    
          <div class='js-initial-data initial-data'>
            <div class="read-and-link-container">
              <div class="tease-read-container">
                <p class="tease-read">${tease}</p>
              </div>
              <div style="text-align:center"><a href="${read}" class="read-link" target="_blank" style="text-decoration: none">Learn more&#10064;</a></div>
            </div> 
              <div class="performance-info"> 
                <h3 class="performance-banner">Upcoming Performance</h3>
                  <p class="no-shows-notification">No shows coming up..</p>
                    <div class='ticket-info'>
                      <p class="show-date">${day}</p>
                      <p class="show-name">${name}</p>
                      <p class="show-title-address">${venueTitle} ${address}</p>
                    </div>
                    <div style="text-align:center"><a href="${purchaseLink}" target="_blank" class="ticket-link" style="text-decoration: none">Buy Tickets&#10064;</a></div>
                    
              </div><button class="hide-initial-data-btn">Hide &#8593;</button>
          </div>
      </div>
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
    <a href="#" class="related-artist-name" style="text-decoration: none">${name}</a>
    </div>
  `;
}