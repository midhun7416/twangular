var express = require('express');
var router = express.Router();
var Twit = require('twit');
var config = require('../config');

// instantiate Twit module
var twitter = new Twit(config.twitter);


router.get('/:q', function(req, res) {
    var oEmbedTweets = [], tweets =[],
    params = {
        q: req.params.q
    };
    console.log(params);
    twitter.get('search/tweets', params, function (err, reply) {
        if(err) 
            return handleError(err);
        tweets = reply.results;    
    });
    console.log(tweets);
    res.setHeader('Content-Type', 'application/json');
    res.send(tweets);    
});




module.exports = router;