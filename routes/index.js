var express = require('express');
var router = express.Router();
var spotifyBackend = require('../backend/spotify-api-calls')

router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'müd'
  });
});

router.get('/login', function(req, res) {
    spotifyBackend.spotifyLogin(res);
});

router.get('/callback', function(req, res) {
  spotifyBackend.spotifyAuth(req, res)
});


router.get('/viz', function(req, res, next) {
    const songs = req.session.songs
    console.log(songs)
    res.render('visualisation', {
        songs: songs
    })
})

module.exports = router;

