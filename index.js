'use strict';

const MUSICSAVOR_SEARCH_URL = 'https://tastedive.com/api/similar'

function getDataFromApi(searchTerm, callback) {
    const query = {
        url: MUSICSAVOR_SEARCH_URL,
        method: 'get', 
        q: `${searchTerm}`,
        type: 'music',
        info: 1,
        limit: 5,
        k: '293729-MusicSav-30GOJZ0S',
        callback: 'test',
        datatype: 'jsonp'
    }
    $.ajax(query, callback);
}

function displayMusicSavorSearchData(data) {
    console.log(JSON.stringify(data, null, 2));
}

function watchSubmit() {
    $('.js-search-form').on('submit', function(event) {
        event.preventDefault();
        const queryTarget = $(event.currentTarget).find('.js-query')
        const query = queryTarget.val();
        queryTarget.val('');
        getDataFromApi(query, displayMusicSavorSearchData);
    })
}

$(watchSubmit);