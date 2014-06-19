/**
*	alive.js
*
*	Quick node.js application for 2013 T3 holiday site that listens for socket events and drives
*	the various machines connected to the laptop running the app via Arduino.
*/
"use strict";


//	INCLUDES & VARS
var j5 = require('johnny-five'), board, ball, socket, nutcracker, fruitcake, bird, tinsel, candycane, warningLight;




//	CONSTRUCTOR (of sorts)

// initialize the board
board = new j5.Board();
board.on("ready", function() {
  console.log("board ready");
	nutcracker = new j5.Pin({ addr: 9 });
	candycane = new j5.Pin({ addr: 8 });
	fruitcake = new j5.Pin({ addr: 11 });
	bird = new j5.Pin({ addr: 10 });
  ball = new j5.Pin({ addr: 12 });
  tinsel = new j5.Pin({ addr: 7 });
  warningLight = new j5.Pin({ addr: 6 });
}); 

// initialize the socket connection
//socket = require('socket.io-client').connect('http://localhost:8080');
socket = require('socket.io-client').connect('http://techoratethetree.com');
socket.on('connect', function(){
   	console.log('Johnny Five is alive!');
});




// EVENT LISTENERS

/**
*   Listens for a warning of impending launch
*/
socket.on('warning', function(){
    console.log('LAUNCH IMPENDING');
    warningLight.high();
});

/**
*	Listens for fire event for cannon 1 (balls)
*/
socket.on('launch', function(data){
    console.log("FIRE IN THE HOLE!");
    
    switch(data.ordnance) {

    	case "nutcracker":
    	console.log("*** NUTCRACKER ***");
    	nutcracker.high();
  		board.wait(300, function() {
    		nutcracker.low();
        warningLight.low();
  		});
    	break;

    	case "candycane":
    	console.log("*** CANDYCANE ***");
    	candycane.high();
  		board.wait(300, function() {
    		candycane.low();
        warningLight.low();
  		});
    	break;

    	case "fruitcake":
    	console.log("*** FRUITCAKE ***");
    	fruitcake.high();
  		board.wait(300, function() {
    		fruitcake.low();
        warningLight.low();
  		});
    	break;

    	case "bird":
    	console.log("*** BIRD ***");
    	bird.high();
  		board.wait(300, function() {
    		bird.low();
        warningLight.low();
  		});
    	break;

      case "ball":
      console.log("*** BALL ***");
      ball.high();
      board.wait(8000, function() {
        ball.low();
        warningLight.low();
      }); 
      break;

      case "tinsel":
      console.log("*** TINSEL ***");
      tinsel.high();
      board.wait(3000, function() {
        tinsel.low();
        warningLight.low();
      }); 
      break;

    	default:
      warningLight.low();
    	console.log("-- that's not hooked up right now --")
    }
});




