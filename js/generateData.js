'use strict';

class GenerateData {
  generateRelatedSearchResults(data) {
    const {Name} = data;
    return `
      <div class="related-music-container">
        <a href="#" class="related-artist-name" id="relatedArtist">${Name}</a>
      </div>
    `;
  }

  generateInitalSearchResults(tDiveData, name, venueTitle, address, day, purchaseLink) {
    const {musicianName, teaser, readMore, youtubeID} = tDiveData;
    return `
      <div class="js-search-results">
        <h2 class="artist-name">If you like<br> ${musicianName}</h2>
          <iframe id="ytplayer" type="text/html" allowfullscreen="allowfullscreen" src="https://www.youtube.com/embed/${youtubeID}" frameborder="0" class="initial-iframe" title="Youtube Video"></iframe>
          <div class="artist-name-and-data">
              <div class='js-initial-data initial-data'>
                <div class="read-and-link-container">
                    <p class="tease-read hide-overflow">${teaser}</p>
                    <div class="center-link">
                      <a href="${readMore}" class="read-link hidden" target="_blank">Learn more</a>
                    </div>
                </div> 
                <div class="performance-info" hidden> 
                  <h3 class="performance-banner">Upcoming Performance</h3>
                    <p class="no-shows-notification">No shows coming up..</p>
                      <div class='ticket-info'>
                        <p class="show-date">${day}</p>
                        <p class="show-name">${name}</p>
                        <p class="show-title-address">${venueTitle} ${address}</p>
                        <div class="center-link">
                          <a href="${purchaseLink}" target="_blank" class="ticket-link">Buy Tickets</a>
                        </div>
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

  generateNoResults() {
    return `
      <h3>Sorry that search does not exist.<br> Please try a different search.</h3>
    `;
  }
};