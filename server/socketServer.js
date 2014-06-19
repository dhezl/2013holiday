/**
*	SocketServer.js
*
*	Handles socket connections for our app.
*/
"use strict";


//	INCLUDES
var Database = require('./database');
//var events = require('events');


//	VARIABLES
var self = SocketServer.prototype;
var io;
var database;
var lastClientJoined;
var appStatus;




//	CONSTRUCTOR
module.exports = SocketServer;

function SocketServer(server, db) {
	var self = this;
	console.log("SocketServer reporting for duty");
	//var self = this;
	database = db;
	io = require('socket.io').listen(server, { log: false });
	io.sockets.on('connection', function (socket) {
		lastClientJoined = socket;
		database.getStatus();
		database.returnAllTweets();
		//	store our just-joined socket for use in a bit...
		//
 	 	//socket.emit('join', { hello: 'world' } );
 	 	//socket.on('switchEvent', function () {
  	  	//	console.log("switch event received");
  		//});
		socket.on('ralphie', function(data) {
			console.log("ralphie you'll shoot  your eye out");
			console.log("appStatus is: " + appStatus[0].status);
			console.log("data 0 status is " + Number(Boolean(data.tinsel)));
			appStatus[0].status = Number(Boolean(data.tinsel));
			appStatus[1].status = Number(Boolean(data.candycane));
			appStatus[2].status = Number(Boolean(data.nutcracker));
			appStatus[3].status = Number(Boolean(data.bird));
			appStatus[4].status = Number(Boolean(data.fruitcake));
			appStatus[5].status = Number(Boolean(data.ball));

			appStatus[7].status = Number(data.page_status);

			self.broadcastStatus();
			database.writeStatusUpdate(data);
		});
	});



	io.sockets.on('switchEvent', function() {
		console.log("switch event collected");
	});

	io.sockets.on('requestCompleteQueue', function() {
		console.log("queue request collected");
	});

	database.on('success', function(obj) {
		//console.log("success! \n"+obj);
		self.broadcastTweetQueue(obj);
	});

	database.on('statusUpdate', function(obj){ 
		appStatus = obj;
		self.broadcastStatus();
	});

	database.on('pop', function(obj) {
		console.log("pop caught");
	});
	
}







//	METHODS

/**
*
*/
SocketServer.prototype.broadcastTweetQueue = function(obj) {
	if (lastClientJoined) lastClientJoined.emit('join', obj);
}

/**
*
*/
SocketServer.prototype.broadcastStatus = function() {
	if (appStatus) io.sockets.emit('status', appStatus);
}

/**
*	Broadcasts the addition of a new tweet in the queue to all clients
*
*	@param			obj 			JSON tweet object 		
*/
SocketServer.prototype.notifyOfAddition = function(obj) {
	console.log("notifying of new tweet");
	io.sockets.emit('addTweet', obj);
}

/**
*	Broadcasts the removal of a tweet from queue to all clients
*/
SocketServer.prototype.notifyOfRemoval = function(obj) {
	io.sockets.emit('removeTweet', { test: 'this is a test'});
}

/**
*	Broadcasts a launch event to connected sockets
*	(principally the 'alive.js' node app)
*
*	@param			obj 			JSON tweet object containing launch data
*/
SocketServer.prototype.launch = function(obj) {
	io.sockets.emit('launch', obj);
}

/**
*	Notifies clients of an impending launch
*
*	This is used for triggering the warning lights on the stage when a cannon
*	is about to fire... you know, because nobody really wants to get smacked in 
*	the face by a nutcracker.  Unless they're into that sort of thing.
*/
SocketServer.prototype.notifyOfImpendingLaunch = function() {
	io.sockets.emit('warning');
}

/**
*	Broadcasts a state change event to connected sockets.
*	
*	This is used for notifying clients when certain cannons/launchers
*	are toggled between active and inactive states.
*/
SocketServer.prototype.notifyOfStatus = function() {
	io.sockets.emit('stateChange', {});
}





