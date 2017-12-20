'use strict';

const MUSICSAVOR_SEARCH_URL = 'https://tastedive.com/api/similar';

function getDataFromApi(searchTerm, callback) {
    const query = {
        url: MUSICSAVOR_SEARCH_URL,
        method: 'get', 
        data: {
            q: `${searchTerm}`,
            type: 'music',
            info: 1,
            limit: 10,
            k: '293729-MusicSav-F68RALT7'
        },
        dataType: 'jsonp',
        success: callback
    };
    $.ajax(query);
}

function removeYoutubeVideo() {
    $('.initial-search-results').on('click', '.artist-name', function(event) {
        console.log('clicked');
        event.preventDefault();  
        $('iframe').remove();
    });
}

function appendYoutubeVideo() {
    let youtubeVideo = $('.youtube-video').attr('videoID');
    $('.initial-search-results').append(`<iframe id="ytplayer" type="text/html" width="475" height="260" 
    src="https://www.youtube.com/embed/${youtubeVideo}" data-hidden="true" frameborder="0" class="iframe"></iframe>`);
}

function showInitialSearchData() {
    $('.initial-search-results').on('click', '.artist-name', function(event) {
    event.preventDefault();  
    appendYoutubeVideo();
    removeYoutubeVideo();
    
    if ($('.tease-read').attr('hidden'),
        $('.read-link').attr('hidden'),
        $('.youtube-video').attr('hidden') ){

        $('.tease-read').prop('hidden', false);
        $('.read-link').prop('hidden', false);
        $('.youtube-video').prop('hidden', false);
         
    } else {
        $('.tease-read').prop('hidden', true);
        $('.read-link').prop('hidden', true);
        $('.youtube-video').prop('hidden', true);  
    } 
});
}

function renderInitalSearchResults(title, style, tease, read, ytURL, ytID) {
    return `
    <h3>If you like</h3>
    <a href="${title}" class="artist-name">${title}</a>
    <h2>${style}</h2>
    <p class="tease-read" hidden>${tease}</p>
    <a href="${read}" class="read-link" target="_blank" hidden>Learn more</a>
    <a href="${ytURL}" videoID="${ytID}" class="youtube-video" hidden>Youtube Video</a>
    `;
}

function renderRelatedSearchResults(data) {
    const {name, type, teaser, readMore, youtubeUrl, youtubeID} = data;
    return `
    <a href="${name}">${name}</a>
    <h3>${type}</h3>
    `;
}

function displayMusicSavorSearchData(data) {
    // console.log(JSON.stringify(data, null, 2));
    let initialSearch = data.Similar.Info[0];
    let name = initialSearch.Name;
    let type = initialSearch.Type;
    let teaser = initialSearch.wTeaser;
    let readMore = initialSearch.wUrl;
    let youtubeURL = initialSearch.yUrl;
    let youtubeID = initialSearch.yID;
    
    
    $('.initial-search-results').html(renderInitalSearchResults(name, type, teaser, readMore, youtubeURL, youtubeID));
    showInitialSearchData();
    
    let relatedSearch = data.Similar.Results;
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
        results += renderRelatedSearchResults(relatedData);
        // console.log(results);
    }
    $('.related-search-results').html(results);
}

function watchSubmit() {
    $('.js-search-form').on('submit', function(event) {
        event.preventDefault();
        const queryTarget = $(event.currentTarget).find('.js-query')
        const query = queryTarget.val();
        queryTarget.val('');
        getDataFromApi(query, displayMusicSavorSearchData);
        // $('.check-out').prop('hidden', false);
    })
}

// $(watchSubmit);
$(function(){
    watchSubmit();
    const sampleData = {
        "Similar": {
          "Info": [
            {
              "Name": "Jay-Z",
              "Type": "music",
              "wTeaser": "Shawn Corey Carter (born December 4, 1969), known professionally as JAY-Z, is an American rapper and businessman. He is one of the best-selling musicians of all time, having sold more than 100 million records, while receiving 21 Grammy Awards for his music. MTV ranked him the \"Greatest MC of all time\" in 2006. Rolling Stone ranked three of his albums—Reasonable Doubt (1996), The Blueprint (2001), and The Black Album (2003)—among The 500 Greatest Albums of All Time. In 2017, Forbes estimated his net worth at $810 million, making him the second-richest hip hop artist in the U.S.As an artist, Jay-Z holds the record for most number one albums by a solo artist on the US Billboard 200 with 14. He has also had four number ones on the Billboard Hot 100, one (\"Empire State of Mind\") as lead artist. In 2009, he was ranked the tenth-most successful artist of the 2000s by Billboard as well as the fifth top solo male artist and fourth top rapper behind Eminem, Nelly, and 50 Cent. He was also ranked the 88th-greatest artist of all time by Rolling Stone.",
              "wUrl": "http://en.wikipedia.org/wiki/Jay_Z",
              "yUrl": "https://www.youtube-nocookie.com/embed/RM7lw0Ovzq0",
              "yID": "RM7lw0Ovzq0"
            }
          ],
          "Results": [
            {
              "Name": "Rick Ross",
              "Type": "music",
              "wTeaser": "William Leonard Roberts II (born January 28, 1976), known professionally by his stage name Rick Ross, is an American rapper and entrepreneur.In 2009, Ross founded the record label Maybach Music Group, on which he released his studio albums Deeper Than Rap (2009), Teflon Don (2010), God Forgives, I Don't (2012), Mastermind, Hood Billionaire (2014), Black Market (2015), and Rather You Than Me (2017). Ross was also the first artist signed to Diddy's management company Ciroc Entertainment. In early 2012, MTV named Ross as the Hottest MC in the Game.William Leonard Roberts II was born in Clarksdale, Mississippi, and raised in Carol City, Florida. After graduating from Miami Carol City Senior High School, he attended the historically black college Albany State University on a football scholarship. Roberts worked as a correctional officer for 18 months from December 1995, until his resignation in June 1997.",
              "wUrl": "http://en.wikipedia.org/wiki/Rick_Ross",
              "yUrl": "https://www.youtube-nocookie.com/embed/gI8JrMnG-_M",
              "yID": "gI8JrMnG-_M"
            },
            {
              "Name": "Big Sean",
              "Type": "music",
              "wTeaser": "Sean Michael Leonard Anderson (born March 25, 1988), known professionally as Big Sean, is an American rapper from Detroit, Michigan. Sean signed with Kanye West's GOOD Music in 2007, Def Jam Recordings in 2008 and Roc Nation in 2014. After releasing a number of mixtapes, Sean released his debut studio album, Finally Famous, in 2011. He released his second studio album, Hall of Fame, in 2013. Sean's third studio album, Dark Sky Paradise, was released in 2015 and earned him his first number one album in the US. In 2017, he released his fourth studio album, I Decided, which debuted at number one on the US Billboard 200 chart.Sean Michael Leonard Anderson was born on March 25, 1988 in Santa Monica, California to Myra and James Anderson. When he was 3 months old, he moved to Detroit, Michigan, where he was raised by his mother, a school teacher, and grandmother. He attended the Detroit Waldorf School and graduated from Cass Technical High School with a 3.7 GPA. Big Sean is often heard saying \"west side\" in his songs; he is referring to the west side of his hometown Detroit, Michigan. In his later years in high school, Sean gained a valuable relationship with Detroit hip-hop station WHTD; he would show his rhyming skills on a weekly basis as part of a rap battle contest held by the station. In 2005, Kanye West was doing a radio interview at 102.7 FM. Hearing about this, Sean headed over to the station to meet West and perform some freestyle. Initially West was reluctant to hear him, however he gave Sean 16 bars to rap for him. According to Big Sean, West enjoyed his freestyle: \"As we get to the entrance of the radio station ... we stopped in the middle of the doorway. He starts looking at me and bobbing his head,\". After the freestyle, Sean left West his demo tape. Two years later, West signed Big Sean to GOOD Music. Sean has cited West, Eminem, The Notorious B.I.G., and J Dilla as his influences.",
              "wUrl": "http://en.wikipedia.org/wiki/Finally_Famous_Vol._2:_U_Know_Big_Sean",
              "yUrl": "https://www.youtube-nocookie.com/embed/uI7obr7suNg",
              "yID": "uI7obr7suNg"
            },
            {
              "Name": "Common",
              "Type": "music",
              "wTeaser": "Lonnie Rashid Lynn, Jr. (born March 13, 1972), better known by his stage name Common (formerly Common Sense), is an American hip hop recording artist, actor, poet and film producer from Chicago, Illinois. Common debuted in 1992 with the album Can I Borrow a Dollar? and maintained a significant underground following into the late 1990s, after which he gained notable mainstream success through his work with the Soulquarians. In 2011, Common launched Think Common Entertainment, his own record label imprint, and, in the past, has released music under various other labels such as Relativity, Geffen and GOOD Music, among others.Common's first major-label album, Like Water for Chocolate, received widespread critical acclaim and tremendous commercial success. His first Grammy Award was in 2003, winning Best R&B Song for \"Love of My Life\", with Erykah Badu. Its popularity was matched by May 2005's Be, which was nominated for Best Rap Album, at the 2006 Grammy Awards. Common was awarded his second Grammy for Best Rap Performance by a Duo or Group, for \"Southside\" (featuring Kanye West), from his July 2007 album Finding Forever. His best-of album, Thisisme Then: The Best of Common, was released on November 27, 2007.",
              "wUrl": "http://en.wikipedia.org/wiki/Common_(entertainer)",
              "yUrl": "https://www.youtube-nocookie.com/embed/OjHX7jf-znA",
              "yID": "OjHX7jf-znA"
            },
            {
              "Name": "Lupe Fiasco",
              "Type": "music",
              "wTeaser": "Wasalu Muhammad Jaco (born February 16, 1982), better known by his stage name Lupe Fiasco ( LOO-pay), is an American rapper, record producer, and entrepreneur. He rose to fame in 2006 following the success of his debut album, Lupe Fiasco's Food & Liquor. He also performs as the frontman of rock band Japanese Cartoon under his real name. As an entrepreneur, Fiasco is the chief executive officer of 1st and 15th Entertainment.Raised in Chicago, Jaco developed an interest in hip hop after initially disliking the genre for its use of vulgarity and misogyny. After adopting the name Lupe Fiasco and recording songs in his father's basement, 19-year-old Fiasco joined a group called Da Pak. The group disbanded shortly after its inception, and Fiasco soon met rapper Jay-Z who helped him sign a record deal with Atlantic Records. In September 2006, Fiasco released his debut album Lupe Fiasco's Food & Liquor on the label, which received three Grammy nominations. He released his second album, Lupe Fiasco's The Cool, in December 2007. The lead single \"Superstar\" became his first top 40 hit on the Billboard Hot 100. After a two-year delay, Lasers was released in March 2011 to mixed reviews; however, it became his first album to debut at number one on the Billboard 200. His latest album, Drogas Light, was released in February 2017.",
              "wUrl": "http://en.wikipedia.org/wiki/Lupe_Fiasco",
              "yUrl": "https://www.youtube-nocookie.com/embed/Rmp6zIr5y4U",
              "yID": "Rmp6zIr5y4U"
            },
            {
              "Name": "T.I.",
              "Type": "music",
              "wTeaser": "Clifford Joseph Harris Jr. (born September 25, 1980), known professionally as T.I. and Tip (often stylized as TIP or T.I.P.), is an American rapper and actor from Atlanta, Georgia. Harris signed his first major-label record deal in 1999, with Arista subsidiary LaFace. In 2001, Harris formed the Southern hip hop group P$C, alongside his longtime friends and fellow Atlanta-based rappers Big Kuntry King, Mac Boney and C-Rod. Upon being released from Arista, Harris signed to Atlantic and subsequently became the co-chief executive officer (CEO) of his own label imprint, Grand Hustle Records, which he launched in 2003. Harris is also perhaps best known as one of the artists who popularized the hip hop subgenre trap music, along with Young Jeezy and Gucci Mane.",
              "wUrl": "http://en.wikipedia.org/wiki/T.I.",
              "yUrl": "https://www.youtube-nocookie.com/embed/etfIdtm-OC8",
              "yID": "etfIdtm-OC8"
            }
          ]
        }
      };
    displayMusicSavorSearchData(sampleData);
});

// * initial search results
    // name = data.Similar.Info[0].Name
    // type = data.Similar.Info[0].Type
    // picture

    // * selecting initial search result
    // name = data.Similar.Info[0].Name
    // teaser = data.Similar.Info[0].wTeaser
    // read more = data.Similar.Info[0].wUrl
    // youtubeUrl = data.Similar.Info[0].yUrl
    // youtubeID = data.Similar.Info[0].yID

    // * similar artists search results
    // name = data.Similar.Results[0].Name
    // type = data.Similar.Results[0].Type
    // picture

    // * selecting similar artist
    // name = data.Similar.Results[0].Name
    // teaser = data.Similar.Results[0].wTeaser
    // read more = data.Similar.Results[0].wUrl
    // youtubeUrl = data.Similar.Results[0].yUrl
    // youtubeID = data.Similar.Results[0].yID