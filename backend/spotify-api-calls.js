var SpotifyWebApi = require('spotify-web-api-node');
var querystring = require('querystring');
var fetch = require('node-fetch')

var client_id = '583c0d1b7bd648bebe57b116c74af394';
var client_secret = '00072bb35b20455382d8d92db10322f5';
var redirect_uri = 'http://localhost:3000/callback';
var stateKey = 'spotify_auth_state';


//Spotify Login
module.exports.spotifyLogin = function (res) {
    var state = generateRandomString(16);
    res.cookie(stateKey, state);
    // your application requests authorization
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

function generateRandomString(length) {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};

//Spotify callback + sessions

const spotifyApi = new SpotifyWebApi({
    clientId: client_id,
    clientSecret: client_secret,
    redirectUri: redirect_uri
});

function getTopTracks(access_token) {
    return fetch("https://api.spotify.com/v1/me/top/tracks",{
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": `Bearer ${access_token}`
        }
    })
}

module.exports.spotifyAuth = function (req, res) {
    let access_token
    spotifyApi.authorizationCodeGrant(req.query.code).then(function(data) {
        spotifyApi.setAccessToken(data.body.access_token);
        spotifyApi.setRefreshToken(data.body.refresh_token);
        access_token = data.body.access_token
        return spotifyApi.getMe()

    }).then(function(data) {
        console.log(access_token)
        // getTopTracks(access_token).then( function(data))
        res.redirect('/viz')
    })
}
    
    
    