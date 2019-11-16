'use strict';

class RenderData {
  displayData(tastediveRes, seatgeekRes) {
    const generateData = new GenerateData();
    const showData = new ShowData();
    const tastediveData = tastediveRes[0];
    const seatgeekData = seatgeekRes[0];
    
    // Tastedive data
    let initialSearch = tastediveData.Similar.Info[0];
    let tdData = {
      musicianName: initialSearch.Name,
      type: initialSearch.Type,
      teaser: initialSearch.wTeaser,
      readMore: initialSearch.wUrl,
      youtubeUrl: initialSearch.yUrl,
      youtubeID: initialSearch.yID
    };
    
    // Tastedive related data
    const relatedSearch = tastediveData.Similar.Results;
    let htmlTemplate = '';
    relatedSearch.forEach(result => htmlTemplate += generateData.generateRelatedSearchResults(result));
    document.querySelector('.related-search-results').innerHTML = htmlTemplate;
    showData.showRelatedSearchData();

    // Seatgeek data
    let numberOfShows = seatgeekData.meta.total;
    let tastediveHtml = '';

    if (numberOfShows === 0) {
      tastediveHtml = generateData.generateInitalSearchResults(tdData);
      document.querySelector('.initial-search-results').innerHTML = tastediveHtml;
      $('.ticket-info').remove();
      $('.ticket-link').remove();
      showData.showInitialSearchData();
    } else {
      let concertSearch = seatgeekData.events[0];
      let title = concertSearch.title;
      let venueName = concertSearch.venue.name;
      let location = concertSearch.venue.display_location;
      let date = moment(concertSearch.datetime_local).format('MMMM Do YYYY, h:mm a');
      let buyTicketsLink = concertSearch.url;

      tastediveHtml = generateData.generateInitalSearchResults(tdData, title, venueName, location, date, buyTicketsLink);
      document.querySelector('.initial-search-results').innerHTML = tastediveHtml;
      $('.no-shows-notification').remove();
      showData.showInitialSearchData();
    }
    
    // No search results
    let noType = tastediveData.Similar.Info[0].Type;
    if (noType === 'unknown') {
      $('.no-search-results').removeClass('hidden');
      document.querySelector('.no-search-results').innerHTML = generateData.generateNoResults();
      $('.search-results').addClass('hidden');
    } else {
      $('.search-results').removeClass('hidden');
      $('.no-search-results').addClass('hidden');
    }
  }
}