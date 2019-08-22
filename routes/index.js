var express = require('express');
var router = express.Router();
var spotifyBackend = require('../backend/spotify-api-calls');

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


router.get('/yourmud', function(req, res, next) {
    const { audio_features, recommendations } = req.session
    res.render('visualization', {
        audio_features: audio_features, 
        recommendations: recommendations
    })
})

module.exports = router;

