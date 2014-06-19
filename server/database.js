/**
*	database.js
*
*	mysql connections for our app
*	includes push and pop, and a method to return all stored tweets.
*/
"use strict";


//	INCLUDES
var mysql = require('mysql');
var format = require('util').format;
var eventEmitter = require('events').EventEmitter;
var util = require('util');


//	VARIABLES

var db = {
  	host     : 't3holiday.cfg5n9zjqo9p.us-west-2.rds.amazonaws.com',
  	user     : 'helpdesk',
  	password : '1801NLamar!',
  	database : 'techorate',
};


//	CONSTRUCTOR
module.exports = Database;

function Database() {
	console.log("Database reporting for duty");
}

util.inherits(Database, eventEmitter);
var self = Database.prototype;



//	METHODS

/**
*	Pushes a new tweet object into the document store
*
*	@param			tweet 			tweet JSON to be pushed
*	@param			callback 		function to trigger on completion
*/
Database.prototype.push = function(tweet, callback) {

	var tweetString = JSON.stringify(tweet)
	tweetString = tweetString.replace(/"([^"]*)'([^"]*)"/g, "$1\\'$2");

	var cxn = mysql.createConnection( db );	
	cxn.connect(function(err){
		//tests
	});
	console.log("inserting tweet "+tweet.id);
	var query = "INSERT INTO tweets VALUES ("+tweet.id+", '"+tweetString+"')";
	cxn.query(query, function(err) {
  		if (err) throw err;
	});

	cxn.end();
	this.emit('push', tweet);
	if (callback) callback();
}

/**
*	Removes a tweet from the document store
*
*	@param			tweet 			tweet to be removed
*	@param			callback 		function to trigger on completion
*/
Database.prototype.pop = function(tweet, callback) {

	this.emit('pop', tweet );

	//	define our connection
	var cxn = mysql.createConnection( db );
	cxn.connect(function(err){
		if(err) throw err;	
	});

	// 	then let's pop our tweet off of the stack...
	var query = "DELETE FROM tweets WHERE id=" + tweet.id;
	cxn.query(query, function(err) {
		if (err) throw err;
	});

	// 	then let's log our launch
	var query2 = "UPDATE launch_counts SET count = count + 1 WHERE name = " + tweet.ordnance;
	//cxn.query(query2, function(err) {
	//	if (err) throw err;
	//});

	//	and close our connection
	cxn.end();
}

/**
*	Returns all tweets currently in the document store.
*/
Database.prototype.returnAllTweets = function() {
	var self = this;
	var returnArray = [];

	//	create our connection
	var cxn = mysql.createConnection( db );	
	cxn.connect(function(err){
	});

	//	perform our query
	var query = "SELECT content FROM tweets";
	cxn.query(query, function(err, rows) {
  		if (err) throw err;
		rows.forEach(function(entry) {
			returnArray.push(entry.content);
		});
		self.emit('success', returnArray);
	});

	//	close connection
	cxn.end();
}

/**
*	Returns current status of all cannons
*/
Database.prototype.getStatus = function() {
	var self = this;

	//	create our connection
	var cxn = mysql.createConnection( db );
	cxn.connect(function(err) {
		if (err) throw err;
	});

	//	perform our query
	var query = "SELECT * FROM status";
	cxn.query(query, function(err, rows){
		if (err) throw err;
		//console.log(rows);
		self.emit('statusUpdate', rows);
	});

	//	close connection
	cxn.end();
}

/**
*	Refreshes cannon status table on RDS.
*/
Database.prototype.writeStatusUpdate = function(obj) {
	var self = this;

	//	create our connection
	//var cxn = mysql.createConnection( db );
	//cxn.connect(function(err) {
	//	if (err) throw err;
	//});

	//	perform our queries
	//var query = "UPDATE status SET status = CASE name WHEN tinsel THEN hhh WHEN candycane THEN hhh WHEN nutcracker THEN hhh WHEN bird THEN hhh WHEN fruitcake THEN hhh WHEN ball THEN hhh WHEN page_status THEN hhh"

	//	close connection
}




