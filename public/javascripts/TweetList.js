var app = angular.module('Twitter', ['ngResource', 'ngSanitize']);

app.controller('TweetList', function($scope, $resource, $timeout) {

    /**
     * init controller and set defaults
     */
    function init () {

      // set a default username value
      $scope.username = "twitterdev";
      $scope.query = "twitter";
      
      // empty tweet model
      $scope.tweetsResult = [];
      $scope.searchResult = [];

      // initiate masonry.js
      $scope.msnry = new Masonry('#tweet-list', {
        columnWidth: 320,
        itemSelector: '.tweet-item',
        transitionDuration: 0,
        isFitWidth: true
      });

      // layout masonry.js on widgets.js loaded event
      twttr.events.bind('loaded', function () {
        $scope.msnry.reloadItems();
        $scope.msnry.layout();
      });

      $scope.getTweets();
    }

    /**
     * requests and processes tweet data
     */
    function getTweets (paging) {

      var params = {
        action: 'user_timeline',
        user: $scope.username
      };
      /*var params = {
        action: 'search'
        , q: $scope.query
      };*/

      if ($scope.maxId) {
        params.max_id = $scope.maxId;
      }
        
      // create Tweet data resource https://stream.twitter.com/1.1/statuses/sample.json
      $scope.tweets = $resource('/tweets/:action/:user', params);

      // GET request using the resource
      $scope.tweets.query( { }, function (res) {

        if( angular.isUndefined(paging) ) {
          $scope.tweetsResult = [];
        }

        $scope.tweetsResult = $scope.tweetsResult.concat(res);

        // for paging - https://dev.twitter.com/docs/working-with-timelines
        $scope.maxId = res[res.length - 1].id;

        // render tweets with widgets.js
        $timeout(function () {
          twttr.widgets.load();
        }, 30);
      });
    }

    /**
     * binded to @user input form
     */
    $scope.getTweets = function () {
      $scope.maxId = undefined;
      getTweets();
    }

    /**
     * binded to 'Get More Tweets' button
     */
    $scope.getMoreTweets = function () {
      getTweets(true);
    }

    init();
});

///tweets/user_timeline/twitterdev  /search/search/twitter
app.controller('TweetSearch', function($scope, $resource) {
    function init () {
        $scope.query = 'twitter';
        $scope.searchResult = [];
        $scope.search();
    };
    
    function search() {
        console.log($scope.query);
        params = {
            //action: 'query',
            q: $scope.query
        };
        /*$scope.tweets = $resource('/search/:q', params);
        $scope.tweets.query( {}, function(res) {
            if(angular.isUndefined(paging)) {
                $scope.searchResult= [];
            }
            
            $scope.searchResult = $scope.searchResult.concat(res);
            console.log($scope.searchResult);
        });*/
    };
    
    $scope.search = function() {
        search();
    };
    
    init();
});
    