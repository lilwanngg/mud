### MÜD (pronounced mood)

See the site here! http://music-mud.herokuapp.com/

MÜD is an interactive viewing experience for a user and his/her music library. It allows users to link their Spotify's recent listening history to see a visualization that maps each song onto a corresponding point on the graph, based on song characteristics gathered through the Spotify API. Users will then be able to plot different characterstics of the songs onto the y axis, such as valence, danceability, energy, & tempo. In addition to that, recommendations will be displayed on the side to help people discover new music!

![gif](https://github.com/lilwanngg/mud/blob/master/public/ezgif.com-gif-maker%20(1).gif)

## `MVPS`
* link their own Spotify accounts for personalized listening history
* build chart rendering of a user's listening history using d3.js
* user's may interact with the chart by changing axis characteristics
* users can view recommendations based on their top played songs 

### `Spotify Login`
* allows for each user to login with his/her own credentials
* makes the appropriate calls to the Spotify Web API with proper OAuth

```
var client_id = '';
var client_secret = '';
var redirect_uri = "http://music-mud.herokuapp.com/callback"
var stateKey = 'spotify_auth_state';

module.exports.spotifyLogin = function (res) {
    var state = generateRandomString(16);
    res.cookie(stateKey, state);
    var scope = 'user-top-read user-read-recently-played';
    res.redirect('https://accounts.spotify.com/authorize?' +
        querystring.stringify({
            response_type: 'code',
            client_id: client_id,
            scope: scope,
            redirect_uri: redirect_uri,
            state: state
        }));
};
```


### `Song transitions`
* using the d3 library, first all songs (circles) are selected and given a set of datapoints for the update, then merged with the original and transitioned to the new points
* can be found under visualization.ejs in the views folder

```  
let u = svg.selectAll("circle")
      .data(data)
    u
      .enter()
      .append("circle")
      .merge(u)
      .transition()
      .duration(1000)
      .attr('cx', function(d) {
        return (d.valence*(width-70)+60)
      })
      .attr('cy', function(d) {
        return new_y(d[feature])
      })
      .attr('r', function(d) {
        return Math.sqrt((50-d.idx)*15)
      })
      .style("opacity", 0.6)
      .attr('stroke', function(d) {
        return strokes[d.idx%7]
      })
      .attr('fill', function(d) {
        return colors[d.idx%7]
      })
```

## `Development Timeline`
* working with Spotify API to gather data and determine key attributes (1.5 days)
* parse through data for a user's recent history to gather all relevant information (1.5 days)
* chart implementation for the visualization using d3.js (2 days)
* application of k-means clustering theory integration (2 days)

