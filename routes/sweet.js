var express = require('express');
var router = express.Router();
var Twit = require('twit');
var config = require('../config');

// instantiate Twit module
var twitter = new Twit(config.twitter);

var TWEET_COUNT = 15;
var MAX_WIDTH = 305;
var OEMBED_URL = 'statuses/oembed';
var USER_TIMELINE_URL = 'statuses/user_timeline';
var STREAM_URL = 'user.json';

/**
 * GET tweets json.
 */
router.get('/user_timeline/:user', function(req, res) {

  var oEmbedTweets = [], tweets = [],
  res.send([]);
  return;
  params = {
    //screen_name: req.params.user, // the user id passed in as part of the route
    //count: TWEET_COUNT // how many tweets to return
    q: 'polo'
  };
  console.log(params);

  // the max_id is passed in via a query string param
  if(req.query.max_id) {
    //params.max_id = req.query.max_id;
  }

  // request data twitter.get('search/tweets', params, function (err, reply) {
        //if(err) 
          //  return handleError(err);
        //tweets = reply.results;    
    //});
  //twitter.get(USER_TIMELINE_URL, params, function (err, data, resp) {
  twitter.get('search/tweets', params, function (err, reply) {
    //tweets = data;
    tweets = reply.tweets;

    var i = 0, len = tweets.length;

    for(i; i < len; i++) {
      getOEmbed(tweets[i]);
    }
  });

  /**
   * requests the oEmbed html
   */
  function getOEmbed (tweet) {

    // oEmbed request params
    var params = {
      "id": tweet.id_str,
      "maxwidth": MAX_WIDTH,
      "hide_thread": true,
      "omit_script": true
    };

    // request data 
    twitter.get(OEMBED_URL, params, function (err, data, resp) {
      tweet.oEmbed = data;
      oEmbedTweets.push(tweet);

      // do we have oEmbed HTML for all Tweets?
      if (oEmbedTweets.length == tweets.length) {
        res.setHeader('Content-Type', 'application/json');
        res.send(oEmbedTweets);
      }
    });
  }
});


/*router.get('/query/:q', function(req, res) {
    var oEmbedTweets = [], tweets =[],
    params = {
        q: req.params.q
    };
    console.log(params);
    twitter.get('search', params, function (err, reply) {
        if(err) 
            return handleError(err);
        tweets = reply.results;    
    });
    console.log(tweets);
    res.setHeader('Content-Type', 'application/json');
    res.send(tweets);    
});*/

module.exports = router;
