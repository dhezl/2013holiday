var videoPreFeedID = "nHRDs-EtEec";
var videoPostFeedID = "nHRDs-EtEec";
var videoLiveFeedID = ["2596681", "2596633"];
var videoModalID = ["nHRDs-EtEec", "jOOYPCDJsd8", "nHRDs-EtEec"];
var textReplaceArr = ["#techorate", "#ball", "@T3ThinkTank"];
var tweetItems = ["candycane", "ball", "tinsel", "nutcracker", "fruitcake", "bird"];
var flipClock;


$(document).ready(function() {
	console.log("test")
	$('.testload').load('prelaunch.html');

	/**
	 * Grab URL Parameters. Display DIVs based on value
	 */
	$.urlParam = function(name){
	    var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(window.location.href);
	    if (results==null){ return null; }
	    else{ return results[1] || 0; }
	} 	
	var urlParam = $.urlParam('stage');
	var currentDate = new Date();
	var futureDate;
	var diff;

	// Show appropriate stage
	if (urlParam != undefined) $('.stage-' + urlParam).show();	

	/**
	 * Load based on Params
	 */
	switch(urlParam){
		case "pre":
				// Initiate Pre Feed
				updateFeed(videoPreFeedID, "pre");
				// Initiate CountDown
				futureDate  = new Date(currentDate.getFullYear(), 11, 12, 8);
				diff = futureDate.getTime() / 1000 - currentDate.getTime() / 1000;
				flipClock = $('.pre-clock').FlipClock(diff, {
				  clockFace: 'DailyCounter',
				  countdown: true
				});
				break;

		case "live":
				// Video Toggle Listener
				$('input[type=radio]').on('change', function (e) {
					updateLiveFeed($(this).attr("id").substr(5,1) - 1);
				});
				// Initiate Live Feed
				updateLiveFeed(0);
				// Replace feed text
				for (var i=0; i<textReplaceArr.length; i++){
					replaceText(textReplaceArr[i]);
				}
				break;

		case "down":
				// Hide Twitter Column
				$('.twitter-column').hide();
				// Show
				$('.twitter-column-down').show();
				// Video Toggle Listener
				$('input[type=radio]').on('change', function (e) {
					updateLiveFeed($(this).attr("id").substr(5,1) - 1);
				});
				// Initiate Live Feed
				updateLiveFeed(0);		
				// Initiate CountDown
				futureDate  = new Date(currentDate.getFullYear(), 11, 8, 8);
				diff = futureDate.getTime() / 1000 - currentDate.getTime() / 1000;
				flipClock = $('.down-clock').FlipClock(diff, {
				  countdown: true
				});
				// Disable Tweets
				disableTweet(tweetItems)

				break;

		case "post":
				// Initiate Pre Feed
				updateFeed(videoPostFeedID, "post");
				break;				
		default:
				break;
	}

	/*
	 * Add Listeners
	 */
	$('#modalVideo').on('hide.bs.modal', function (e) {
        clearModal();
    });

    $('img[data-toggle=modal]').click(function (e) {
		updateModal($(this).attr("id").substr(5,1) - 1);
	});	
	
});

function updateFeed(token, target) {	
	$('.videoContainer-' + target).html('<figure><iframe src="http://www.youtube.com/embed/' + token + '?autoplay=0&showinfo=0&modestbranding=1&rel=0" width="1000" height="563" frameborder="0" allowfullscreen></iframe></figure>');
	sniffVideo();
}

function updateLiveFeed(token) {	
	$('.videoContainer-live').html('<figure><iframe src="http://new.livestream.com/accounts/6199820/events/' + videoLiveFeedID[token] + '/player?width=800&height=450&autoPlay=true&mute=false" width="640" height="360" frameborder="0" scrolling="no"> </iframe></figure>');
	sniffVideo();
}

function updateModal(token) {
	$('.modal-body').html('<iframe src="//www.youtube.com/embed/' + videoModalID[token] + '?autoplay=1&showinfo=0&modestbranding=1&rel=0" width="100%" height="360" frameborder="0" allowfullscreen></iframe>');
}

function clearModal(){
	$('.modal-body').html('');
}

function replaceText(val) {
	$('.twitter-item-text').each(function() {
   	 	var text = $(this).html();
		$(this).html(text.replace(val, '<span>'+val+'</span>'));
	});
}

function disableTweet(arr){
	for (var i=0; i<arr.length; i++){
		$(".tweet-"+arr[i]).parent().addClass('tweet-disable');
		$(".tweet-"+arr[i]).parent().click(function(e) {
	    	return false;
		});
	}
}

function enableTweet(){
	for (var i=0; i<tweetItems.length; i++){
		$(".tweet-"+tweetItems[i]).parent().removeClass('tweet-disable');
		$(".tweet-"+tweetItems[i]).parent().unbind( "click");
	}
}

/**
 * Video Resize 
 */    
var $allVideos;
var $fluidEl;

function sniffVideo(){
	$allVideos = $("iframe[src^='http://player.vimeo.com'], iframe[src^='http://www.youtube.com'], iframe[src^='http://new.livestream.com'], object, embed"),
	$fluidEl = $("figure");
	    	
	$allVideos.each(function() {

	  $(this)
	    // jQuery .data does not work on object/embed elements
	    .attr('data-aspectRatio', this.height / this.width)
	    .removeAttr('height')
	    .removeAttr('width');
	});
	$(window).trigger('resize');
}

$(window).resize(function() {
  var newWidth = $fluidEl.width();

  $allVideos.each(function() {	  
    var $el = $(this);
    $el
        .width(newWidth)
        .height(newWidth * $el.attr('data-aspectRatio'));
  
  });

}).resize();

