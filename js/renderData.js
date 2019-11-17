'use strict';

class RenderData {
  displayData(tastediveRes, seatgeekRes) {
    const generateData = new GenerateData();
    const showData = new ShowData();
    const tastediveData = tastediveRes[0];
    const seatgeekData = seatgeekRes[0];
    
    // Tastedive data
    const initialSearch = tastediveData.Similar.Info[0];
    const tdData = {
      musicianName: initialSearch.Name,
      type: initialSearch.Type,
      teaser: initialSearch.wTeaser,
      readMore: initialSearch.wUrl,
      youtubeUrl: initialSearch.yUrl,
      youtubeID: initialSearch.yID
    };
    
    // Tastedive related data
    const relatedSearch = tastediveData.Similar.Results;
    const relatedResultsDOM = document.querySelector('.related-search-results');
    let relatedArtistsHtml = '';

    relatedSearch.forEach(result => relatedArtistsHtml += generateData.generateRelatedSearchResults(result));
    relatedResultsDOM.innerHTML = relatedArtistsHtml;
    
    // Seatgeek data
    const numberOfShows = seatgeekData.meta.total;
    const initialResultsDOM = document.querySelector('.initial-search-results');
    let tastediveHtml = '';

    if (numberOfShows === 0) {
      tastediveHtml = generateData.generateInitalSearchResults(tdData);
      initialResultsDOM.innerHTML = tastediveHtml;
      $('.ticket-info').remove();
      $('.ticket-link').remove();
      showData.showInitialSearchData();
    } else {
      const concertSearch = seatgeekData.events[0];
      const title = concertSearch.title;
      const venueName = concertSearch.venue.name;
      const location = concertSearch.venue.display_location;
      const date = moment(concertSearch.datetime_local).format('MMMM Do YYYY, h:mm a');
      const buyTicketsLink = concertSearch.url;

      tastediveHtml = generateData.generateInitalSearchResults(tdData, title, venueName, location, date, buyTicketsLink);
      initialResultsDOM.innerHTML = tastediveHtml;
      $('.no-shows-notification').remove();
      showData.showInitialSearchData();
    }
    
    // No search results
    const noType = tastediveData.Similar.Info[0].Type;
    const noResultsDOM = document.querySelector('.no-search-results');
    
    if (noType === 'unknown') {
      $('.no-search-results').removeClass('hidden');
      noResultsDOM.innerHTML = generateData.generateNoResults();
      $('.search-results').addClass('hidden');
    } else {
      $('.search-results').removeClass('hidden');
      $('.no-search-results').addClass('hidden');
    }
  }
}