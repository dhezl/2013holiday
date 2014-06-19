/**
*	server.js
*
*	This is our main node.js file to start up the server.
*	All it really does is handle some URL routing and listen on port 80.
*
*	Author: David Hezlep
*/
"use strict";



//	INCLUDES
var app = require('express')();
var server = require('http').createServer(app);
var connect = require('connect');
var Techorate = require('./techorate');



//	VARS
var techorate = new Techorate(server);



//	Set up our URL router...
app.use(connect.static('client'))
.use('/js/lib/', connect.static('node_modules/requirejs/'))
.use('/node_modules', connect.static('node_modules'))
.use('/test', connect.static('test/'))
.use('/test', connect.static('client'))
;

//	Start up our server
server.listen(80, function() {
	console.log('Running on 80');
});

//	...aaaaaaaaand, let's kick this thing off!
techorate.init();





