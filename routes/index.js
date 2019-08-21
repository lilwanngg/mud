var express = require('express');
var router = express.Router();
var spotifyBackend = require('../backend/spotify-api-calls');
var clusterMaker = require('clusters')

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
    const { audio_features, recommendations, clusters } = req.session
    res.render('visualization', {
        audio_features: audio_features, 
        recommendations: recommendations,
        clusters: clusters
    })
})

module.exports = router;

