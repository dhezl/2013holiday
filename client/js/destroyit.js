var videoPreFeedID = "wxmceVyA6BA";
var videoPostFeedID = "nHRDs-EtEec";
var videoLiveFeedID = ["2596681", "2596633"];
var videoModalID = ["Z5QQrnRI4uc", "jOOYPCDJsd8", "nHRDs-EtEec"];
var textReplaceArr = ["#techorate", "#ball", "#candycane", "#ball", "#bird", "#tinsel", "#fruitcake", "@T3ThinkTank", " techoratethetree.com"];
var tweetItems = ["candycane", "ball", "tinsel", "nutcracker", "fruitcake", "bird"];
var flipClock;
var urlParam;


$(document).ready(function() {
	/**
	 * Grab URL Parameters. Display DIVs based on value
	 */
	$.urlParam = function(name){
	    var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(window.location.href);
	    if (results==null){ return null; }
	    else{ return results[1] || 0; }
	} 	
	urlParam = $.urlParam('stage');
	if (urlParam == null) urlParam = "pre";

	/**
	 * Load Corresponding Page
	 */
	$('.loadit').load(urlParam + '-launch.html', function(){
		$(this).clone().appendTo("body").remove();
		init();
	});	
});	

function init(){
	
	var currentDate = new Date();
	var futureDate;
	var diffDate;

	/**
	 * Load based on Params
	 */
	switch(urlParam){
		case "pre":
				// Initiate Pre Feed
				updateFeed(videoPreFeedID, urlParam);
				// Initiate CountDown
				futureDate  = new Date(currentDate.getFullYear(), 11, 12, 8);
				diffDate = futureDate.getTime() / 1000 - currentDate.getTime() / 1000;
				flipClock = $('.pre-clock').FlipClock(diffDate, {
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
				break;

		case "down":
				// Video Toggle Listener
				$('input[type=radio]').on('change', function (e) {
					updateLiveFeed($(this).attr("id").substr(5,1) - 1);
				});
				// Initiate Live Feed
				updateLiveFeed(0);		
				// Initiate CountDown
				futureDate  = new Date(currentDate.getFullYear(), 11, 13, 8);
				diffDate = futureDate.getTime() / 1000 - currentDate.getTime() / 1000;
				flipClock = $('.down-clock').FlipClock(diffDate, {
				  countdown: true
				});
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

	updateTwitterFeed({}, 1);
	updateTwitterFeed({}, 2);
	updateTwitterFeed({}, 3);
	updateTwitterFeed({}, 4);
	updateTwitterFeed({}, 5);
}

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
	var searchPattern = new RegExp('('+val+')', 'ig');
	$('.twitter-item-text').each(function() {
   	 	var text = $(this).html();
		$(this).html(text.replace(searchPattern, '<span>'+val+'</span>'));
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

function initTwitterFeed(obj){

}

function updateTwitterFeed(obj, l) {
	var tweet;

	if (l == 1){
		tweet = ''+
				'<h2 class="twitter-now-header">TECHORATING NOW</h2>'+
		        '<div class="twitter-now-countdown">EMPTY</div>'+
		        '<div class="col-sm-2 col-md-2 twitter-now-icon clear">'+
		          '<img src="' + obj.user.profile_image_url + '">'+
		        '</div>'+
		        '<div class="col-sm-8 col-md-8 twitter-now-post">'+
		          '<strong>' +  obj.user.name + '</strong> <small>@' + obj.user.screen_name + '</small>'+
		          '<p class="twitter-now-text">' + obj.text + '</p>'+
		        '</div>'+
		        '<div class="col-sm-2 col-md-2 text-center twitter-now-queue">'+
		          '<img src="img/icon_' + obj.entities.hashtags[0].text + '.png">'+
		        '</div>';
		$('.twitter-now-wrapper').html(tweet);
		// Initiate CountDown
		$('.twitter-now-countdown').countdown({until: 25, compact: true, layout:'{sep}{snn}', onExpiry: shiftTwitterFeed}); 
		console.log("hashtag: " + obj.entities.hashtags[0].text);
	} else {
		tweet = ''+
				'<div class="row" id="' + obj.id + '">'+
		          '<div class="list-group-item twitter-item">'+
		            '<div class="col-sm-2 col-md-2 twitter-item-icon">'+
		              '<img src="' + obj.user.profile_image_url + '">'+
		            '</div>'+
		            '<div class="col-sm-8 col-md-8 twitter-item-post">'+
		              obj.user.name + ' <small>@' + obj.user.screen_name + '</small>'+
		              '<p class="twitter-item-text">' + obj.text + '</p>'+
		            '</div>'+
		            '<div class="col-sm-2 col-md-2 text-center twitter-item-queue">'+
		              '<img src="img/icon_' + obj.entities.hashtags[0].text + '.png">'+
		            '</div>'+
		          '</div>'+
		        '</div>';
		$('.twitter-group').append(tweet);
	}

    // Replace feed text
	for (var i=0; i<textReplaceArr.length; i++){
		replaceText(textReplaceArr[i]);
	}

	console.log("scrollbar: " + $('.twitter-group').hasScrollBar);
}

function shiftTwitterFeed(obj){
	$("#" +  obj.id).remove();
	// $(".twitter-now-wrapper").html('<h2 class="twitter-now-header">TECHORATING NOW</h2><div class="twitter-now-countdown"></div>');
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
  if ($fluidEl != undefined){
	var newWidth = $fluidEl.width();

	  $allVideos.each(function() {	  
	    var $el = $(this);
	    $el
	        .width(newWidth)
	        .height(newWidth * $el.attr('data-aspectRatio'));
	  
	});
  }

}).resize();

/**
 * Detect if ScrollBar is present
 */
$.fn.hasScrollBar = function() {
	return this.get(0).scrollHeight > this.height();
}

