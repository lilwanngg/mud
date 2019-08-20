var SpotifyWebApi = require('spotify-web-api-node');
var querystring = require('querystring');
var fetch = require('node-fetch')

var client_id = '583c0d1b7bd648bebe57b116c74af394';
var client_secret = '00072bb35b20455382d8d92db10322f5';
// var redirect_uri = 'http://localhost:3000/callback';
var redirect_uri = "http://music-mud.herokuapp.com/callback"
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

module.exports.spotifyAuth = function (req, res) {
    let info_medium = []
    let info_short = []
    let info_long = []
    let audio_features_medium = []
    let seeds_medium = []
    let audio_features_long = []
    let seeds_long = []
    let audio_features_short = []
    let seeds_short = []
    let recommendations_short = []
    let recommendations_medium = []
    let recommendations_long = []
    let song_name
    let artist_name
    spotifyApi.authorizationCodeGrant(req.query.code).then(function(data) {
        spotifyApi.setAccessToken(data.body.access_token);
        spotifyApi.setRefreshToken(data.body.refresh_token);
        return spotifyApi.getMe()

    }).then(function(data) {
        spotifyApi
            .getMyTopTracks({limit: 50})
            .then(function(data) {
                return data.body.items.map(track => {
                    if (!track.name.includes(" ")) {
                        track.name += " "
                    }
                    info_medium.push({ [track.id] : [track.name, track.artists[0].name] })
                    return track.id
                })
            })
            .then(function(trackIds) {
                return spotifyApi.getAudioFeaturesForTracks(trackIds)
            })
            .then(function(data) {
                data.body.audio_features.forEach((track, idx) => {
                    song_name = info_medium[idx][track.id][0]
                    artist_name = info_medium[idx][track.id][1]
                    if (idx <= 4) {
                        seeds_medium.push(track.id)
                    }
                    audio_features_medium.push({
                        "title": song_name,
                        "id": track.id,
                        "artist": artist_name,
                        "idx": idx,
                        //how danceable a song is 0-1
                        "danceability": track.danceability, 
                        //perceptual measure of intensity and activity
                        //fast, loud, noisy -> 1
                        "energy": track.energy,
                        "key": track.key,
                        //loudness in decibels, between -60 and 0db
                        "loudness": track.loudness,
                        "mode": track.mode,
                        //0-1, 0.5-1 being instrumentals w/ increasing confidence
                        "instrumentalness": track.instrumentalness,
                        //musical positiveness 0-1, sad, depressed, angry -> happy, cheerful, euphoric
                        "valence": track.valence,
                        //averaged tempo for a song
                        "tempo": track.tempo,
                    })
                })
            }).then(function(data) {
                return spotifyApi.getRecommendations({ seed_tracks: seeds_medium, min_popularity: 50, limit: 10 })
            }).then(function(data) {
                req.session.audio_features = { short: "", medium: "", long: ""}
                req.session.info = { short: "", medium: "", long: "" }
                req.session.recommendations = { short: "", medium: "", long: "" }
                data.body.tracks.forEach(track => {
                    recommendations_medium.push([track.artists[0].name, track.name])
                })
                // req.session.audio_features.medium_term = audio_features_medium
                // req.session.info.medium_term = info_medium
                // req.session.recommendations.medium_term = recommendations_medium
            })
    }).then(function (data) {
        spotifyApi
            .getMyTopTracks({ limit: 50, time_range: "short_term" })
            .then(function (data) {
                return data.body.items.map(track => {
                    if (!track.name.includes(" ")) {
                        track.name += " "
                    }
                    info_short.push({ [track.id]: [track.name, track.artists[0].name] })
                    return track.id
                })
            })
            .then(function (trackIds) {
                return spotifyApi.getAudioFeaturesForTracks(trackIds)
            })
            .then(function (data) {
                data.body.audio_features.forEach((track, idx) => {
                    song_name = info_short[idx][track.id][0]
                    artist_name = info_short[idx][track.id][1]
                    if (idx <= 4) {
                        seeds_short.push(track.id)
                    }
                    audio_features_short.push({
                        "title": song_name,
                        "id": track.id,
                        "artist": artist_name,
                        "idx": idx,
                        //how danceable a song is 0-1
                        "danceability": track.danceability,
                        //perceptual measure of intensity and activity
                        //fast, loud, noisy -> 1
                        "energy": track.energy,
                        "key": track.key,
                        //loudness in decibels, between -60 and 0db
                        "loudness": track.loudness,
                        "mode": track.mode,
                        //0-1, 0.5-1 being instrumentals w/ increasing confidence
                        "instrumentalness": track.instrumentalness,
                        //musical positiveness 0-1, sad, depressed, angry -> happy, cheerful, euphoric
                        "valence": track.valence,
                        //averaged tempo for a song
                        "tempo": track.tempo,
                    })
                })
            }).then(function (data) {
                return spotifyApi.getRecommendations({ seed_tracks: seeds_short, min_popularity: 50, limit: 10 })
            }).then(function (data) {
                data.body.tracks.forEach( track => {
                    recommendations_short.push([ track.artists[0].name, track.name ])
                })
                // recommendations_short = data.body
                // req.session.audio_features.short_term = audio_features_short
                // req.session.info.short_term = info_short
                // req.session.recommendations.short_term = data.body
            })
    }).then(function (data) {
        spotifyApi
            .getMyTopTracks({ limit: 50, time_range: "long_term" })
            .then(function (data) {
                return data.body.items.map(track => {
                    if (!track.name.includes(" ")) {
                        track.name += " "
                    }
                    info_long.push({ [track.id]: [track.name, track.artists[0].name] })
                    return track.id
                })
            })
            .then(function (trackIds) {
                return spotifyApi.getAudioFeaturesForTracks(trackIds)
            })
            .then(function (data) {
                data.body.audio_features.forEach((track, idx) => {
                    song_name = info_long[idx][track.id][0]
                    artist_name = info_long[idx][track.id][1]
                    if (idx <= 4) {
                        seeds_long.push(track.id)
                    }
                    audio_features_long.push({
                        "title": song_name,
                        "id": track.id,
                        "artist": artist_name,
                        "idx": idx,
                        //how danceable a song is 0-1 
                        "danceability": track.danceability,
                        //perceptual measure of intensity and activity
                        //fast, loud, noisy -> 1
                        "energy": track.energy,
                        "key": track.key,
                        //loudness in decibels, between -60 and 0db
                        "loudness": track.loudness,
                        "mode": track.mode,
                        //0-1, 0.5-1 being instrumentals w/ increasing confidence
                        "instrumentalness": track.instrumentalness,
                        //musical positiveness 0-1, sad, depressed, angry -> happy, cheerful, euphoric
                        "valence": track.valence,
                        //averaged tempo for a song
                        "tempo": track.tempo,
                        // danceability, energy, loudness, mode, valence, tempo
                    })
                })
            }).then(function (data) {
                return spotifyApi.getRecommendations({ seed_tracks: seeds_long, min_popularity: 50, limit: 10 })
            }).then(function (data) {
                data.body.tracks.forEach(track => {
                    recommendations_long.push([track.artists[0].name, track.name])
                })
                req.session.audio_features.medium = audio_features_medium
                req.session.info.medium = info_medium
                req.session.recommendations.medium = recommendations_medium
                req.session.audio_features.short = audio_features_short
                req.session.info.short = info_short
                req.session.recommendations.short = recommendations_short
                req.session.audio_features.long = audio_features_long
                req.session.info.long = info_long
                req.session.recommendations.long = recommendations_long
                res.redirect('/yourmud')
            })
    })
}
    
    