define(function (require){

	var $ = require("jquery");
	var _ = require("Underscore");
	var Backbone = require("Backbone");
  var Theme = require("Theme");  
	var Model = require("Tweet");
	var io = require("io");
  var BootstrapButton = require("BootstrapButton");
  var BootstrapModal = require("BootstrapModal");
  var TweetArr = [];


  	var App = function() {
  		window.socket = io.connect();
  		socket.on('join', function (data) {
  		  console.log('join: ' + data);
        console.log(typeof data);
        //TweetArr.push(data);
  		}); 
      socket.on('addTweet', function (data) {
        console.log('addTweet: ' + data);
        TweetArr.push(data);
        updateTwitterFeed(data, TweetArr.length);
      });
      socket.on('removeTweet', function (data) {
        console.log('removeTweet: ' + data);
      });

      // test listeners
      socket.on('warning', function (data) {
        console.log("warning: " + data);
      });

      socket.on('launch', function (data) {
        console.log('launch: ' + data);
        shiftTwitterFeed(data);
      });

      socket.on('cannonStatus', function (data) {
        console.log('cannonStatus: ' + JSON.stringify(data));
      });

  	};

  	App.prototype = {};


  	return App;
});