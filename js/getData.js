'use strict';

class GetData {
  constructor() {
    this.tastediveConfig = {
      baseUrl: 'https://tastedive.com/api',
      endpoint: '/similar'
    };

    this.seatGeekConfig = {
      baseUrl: 'https://api.seatgeek.com/2',
      endpoint: '/events',
      client_id: 'MTAxOTEwMDl8MTUxNTAxMzk2My43OQ'
    };
  }

  getTastediveData(config, artist) {
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

  getSeatgeekData(config, artist) {
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

  initiateRequests(searchTerm) {
    return $.when(
      this.getTastediveData(this.tastediveConfig, searchTerm), 
      this.getSeatgeekData(this.seatGeekConfig, searchTerm)
    );
  }
};