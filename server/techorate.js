/**
*
*/
"use strict";



//	INCLUDES

var twitterConfig = require('./twitterConfig.json');
var twit = require("twit");
var events = require('events');
var util = require('util');
var Database = require("./database");
var SocketServer = require('./socketServer');
var Launcher = require('./launcher');


//	VARS

var socket;
var	database = new Database();
var	launcher = new Launcher(database);

//	Authenticate and instantiate our Twitter helper class (twit.js)
var twitter = new twit({
	consumer_key: twitterConfig.consumer_key,
	consumer_secret: twitterConfig.consumer_secret,
	access_token: twitterConfig.access_token,
	access_token_secret: twitterConfig.access_token_secret
});

// 	these are all of the additional hashtags that relate to the various things we're going to launch
var additionalHashtags = [
	'nutcracker',
	'ball',
	'fruitcake',
	'candycane',
	'bird',
	'tinsel'
];

//	Listen to our Twitter stream...
var stream = twitter.stream('statuses/filter', { track: '#techorate' });




//	CONSTRUCTOR

module.exports = Techorate;

function Techorate(server) {
	socket = new SocketServer(server, database);
}



util.inherits(Techorate, events.EventEmitter);



//	METHODS

//	let's extend the Array prototype:
//	(this will make it easy to check to see if an array contains an item)
Array.prototype.contains = function(obj) {
    var i = this.length;
    while (i--) {
        if (this[i] === obj) {
            return true;
        }
    }
    return false;
}

Techorate.prototype.init = function() {
	console.log("techorate initiated");
}



//	EVENT LISTENERS

stream.on('tweet', function (tweet) {

	//	first, let's build our abridged tweet object...
	var tweetObj = {};
 	tweetObj.id = tweet.id;
 	tweetObj.text = tweet.text;
 	tweetObj.user = {};
 	tweetObj.user.id = tweet.user.id;
 	tweetObj.user.name = tweet.user.name;
 	tweetObj.user.screen_name = tweet.user.screen_name;
 	tweetObj.user.profile_image_url = tweet.user.profile_image_url;
 	tweetObj.entities = tweet.entities;
 	tweetObj.retweeted = tweet.retweeted;
 	console.log(tweetObj);

 	//	then let's see if our tweet is evan actually valid...
 	var tweetIsValid = false;
	// 	we don't want to fuss with tweets that have a crapload of hashtags, because people will *probably* try that.  Because they are assholes.
	//	we also don't want retweets...because that would just be dumb.
	//	and lastly, we want to make sure that the additional hashtag is actually one we accept and can act on.
	//	If a tweet doesn't conform to all of these criteria, then it's not one that originated from our app and we could care less about it.
	if (tweetObj.entities.hashtags.length === 2 && !tweetObj.retweeted && additionalHashtags.contains(tweetObj.entities.hashtags[0].text)) tweetIsValid = true;

 	//	[TO DO]:  We also want to add profanity filtering in here.  And maybe some other content filtering.  Nothing like "GSDM RULEZ T3 DROOLZ" 
 	//	should get through, probably.  Use WebPurify.com API (Login: T3creativedev@t-3.com / 1801Lamar!)

 	//	send our tweet object to our clients and to the database...
 	//	(but we only want to do this if our tweet passed the test)
 	if (tweetIsValid) {
 		database.push(tweetObj, function() {
 			socket.notifyOfAddition(tweetObj);
 			launcher.notifyOfAddition(tweetObj);
 		});
	}

});


/*
database.on('success', function() {
	console.log("booyah");
});
*/
Launcher.prototype.on('warning', function(obj) {
	socket.notifyOfImpendingLaunch(obj);
});

Launcher.prototype.on('launch', function(obj) {
	socket.launch(obj);
});



