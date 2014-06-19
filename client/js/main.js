/**
*	T3 2013 Holiday Card -- MAIN.JS
*
*	This is the main entry point for the 2013 interactive holiday card app.
*/

requirejs.config({
	baseUrl: '/js/',

	paths: {
		Tweet: "models/Tweet",
		TweetQueue: "views/TweetQueue",
		jquery: "https://s3-us-west-2.amazonaws.com/t3holiday/jquery",
		Underscore: "http://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.3.3/underscore-min",
		Backbone: "http://cdnjs.cloudflare.com/ajax/libs/backbone.js/0.9.2/backbone-min",
		io: "https://s3-us-west-2.amazonaws.com/t3holiday/socket",
		Bootstrap: "vendor/bootstrap.min",
		// Bootstrap: "http://netdna.bootstrapcdn.com/bootstrap/3.0.2/js/bootstrap.min.js",
		BootstrapButton: "vendor/bootstrap/button",
		BootstrapModal: "vendor/bootstrap/modal",

		Theme: "destroyit"
	},

	shim: {
	}
});

require(['app'], function(App) {
	window.bTask = new App();
});

