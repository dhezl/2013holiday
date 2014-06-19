/**
*	Tweet.js
*	
*	Model class for T3 2013 holiday card.
*	Syncs over socket to twitter stream on Node server,
*	and writes back to Mongo.
*
*	David Hezlep -- 11/2013
*/

define(function (require) {
	"use strict";

	// Set up the model for an individual tweet
	var Tweet = Backbone.Model.extend({
		urlRoot: "news",
		socket: window.socket,
		initialize: function() {
			_.bindAll(this, 'serverChange', 'serverDelete', 'modelCleanup');
			//this.ioBind()
			console.log("tweet model reporting for duty");
		}
	});

	// Define a collection of tweets
	var TweetCollection = Backbone.Collection.extend({
	});

	// Expose methods
	return {
		Tweet: Tweet,
		TweetCollection: TweetCollection
	};
});