'use strict';

class ShowData {
  showInitialSearchData() {
    $('.no-search-results').addClass('hidden');

    $('.initial-search-results').on('click', '.show-initial-data-btn', function(event) {
      event.preventDefault();
      $('.js-initial-data').addClass('active');
      $('.show-initial-data-btn').addClass('hidden');
      $('.tease-read').removeClass('hide-overflow');
      $('.read-link').removeClass('hidden');
      $('.performance-info').prop('hidden', false);
    });
      
    $('.initial-search-results').on('click', '.hide-initial-data-btn', function(event) {
      event.preventDefault();
      $('.js-initial-data').removeClass('active');
      $('.show-initial-data-btn').removeClass('hidden');
      $('.hide-initial-data-btn').addClass('hidden');
      setTimeout(function(){
        $('.tease-read').addClass('hide-overflow');
        $('.performance-info').prop('hidden', true);
      }, 800);  
    });
  }
}