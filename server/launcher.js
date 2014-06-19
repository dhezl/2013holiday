/**
*	launcher.js
*
*	Manages the queue timing and launch messaging for our 2013 holiday app.
*	This module extends EventEmitter.
*
*	Author: David Hezlep, 12/2013
*/
"use strict";


//	INCLUDES

var EventEmitter = require('events').EventEmitter;
var util = require('util');
var Database = require('./database');



//	VARS

var LAUNCH_INTERVAL = 25000;		//	time between launch events, in milliseconds
var WARNING_TIME = 10000;			//	time before launch to trigger warning (also in milliseconds)
var currentQueue = [];				//	placeholder for our launch queue
var database;						//	...you know, since we have to tie to SQL and all...
var timerIsRunning = false;			//	flag for determining if timer is currently active/running
var queueIsBuilt = false;			//	we really only wanna fuck with this once.


//	CONSTRUCTOR

module.exports = Launcher;

function Launcher(db) {
	console.log("Launcher reporting for duty");
	currentQueue = [];
	database = db;
	//	on instantiation, we want to gather all of our tweets.
	//	first step in this is to set up a listener...
	database.on('success', function(obj) {
		Launcher.prototype.buildQueue(obj);
	});
	//	...and then, we trigger our SQL query.
	database.returnAllTweets();

	database.on('push', function() {
		console.log("push caught");
	});

	
}

util.inherits(Launcher, EventEmitter);



//	METHODS

/**
*	Rebuilds our queue of tweet ID's
*
*	This is triggered by the completion of our SQL query that we
*	fire at module instantiation.  Once the array is built, it then
*	passes the ball to the init() method to begin our queue.
*
*	@param			obj 		Database content
*/
Launcher.prototype.buildQueue = function (obj) {
	if (currentQueue.length === 0 && !queueIsBuilt) {
		console.log("launcher buildQueue");
		obj.forEach(function(entry) {
			var tweet = JSON.parse(entry);
			currentQueue.push( { id: tweet.id, ordnance: tweet.entities.hashtags[0].text } );
		});
		queueIsBuilt = true;
		//console.log(currentQueue);
		//this.init();
	}
}

/**
*	Begins our queue
*
*	This is the third and final step in our instantiation routine (the first 
*	two being our SQL query and the building of our queue array)
*/
Launcher.prototype.init = function() {
	console.log("INIT: " + currentQueue.length);
	var self = this;

	if (currentQueue.length > 0 && !timerIsRunning) {

		console.log("starting launch sequence");
		timerIsRunning = true;

		// 	5 seconds before launch, let's emit our warning event
		setTimeout(function() {
			console.log("warning");
			self.notifyOfImpendingLaunch();
		}, LAUNCH_INTERVAL - WARNING_TIME);

		

	} 
	//else {
	//	console.log("stopping launch loop");
	//	timerIsRunning = false;
	//}
}

/**
*	Adds pertinent info to our launch queue based on incoming tweet object.
*
*	We really only care about the id and what we're launching 'round these parts, 
*	so that's all we're gonna store.
*/
Launcher.prototype.notifyOfAddition = function(obj) {
	currentQueue.push( { id: obj.id, ordnance: obj.entities.hashtags[0].text } );
	if (!timerIsRunning) this.init();	//	start us back up if we're not currently running
}

/**
*	Dispatches an event noting that a launch is impending in the time specified by the
*	WARNING_TIME variable.
*/
Launcher.prototype.notifyOfImpendingLaunch = function() {
	var self = this;
	self.emit('warning', {});
	//	and then we emit our launch event.  Fire in the hole!!
		setTimeout(function(){
			console.log("launching");
			self.launch();
		}, 10000);
}

/**
*	Dispatches launch of first item in queue, and then returns
*	to init() for processing of any additional items in queue
*/
Launcher.prototype.launch = function() {
	var thisTweet = currentQueue.shift();
	console.log(currentQueue);
	console.log('attempting launch');
	database.pop(thisTweet);
	this.emit('launch', thisTweet);
	timerIsRunning = false;
	if (currentQueue.length > 0) this.init();	
}


