title = "Click to open the video"
if (!String.prototype.format) {
	String.prototype.format = function() {
		var args = arguments;
		return this.replace(/{(\d+)}/g, function(match, number) { 
			return typeof args[number] != 'undefined' ? args[number] : match;
		});
	};
}

function remove_videos(){

	// get the page url
	page_url = $(location).attr('href');
	
	// if the page is not the video player page,
	// remove the video from streaming 
	// else
	// don't remove the video or gif
	if(page_url.match(/\/videos\/\d+/ig) 
		|| page_url.match(/\/posts\/\d+/ig) 
		|| page_url.match(/permalink\.php/ig)
		|| page_url.match(/permalink\/\d+/ig)){
		return;
	}

	// get the video tags
	// loop over those tags
	$.each($("video"), function(){

		// define video link as null
		video_original_link = getSharedVideoLink($(this));

		// get the 6th root parent of video node
		video_grand_parent = $(this).parents().eq(4);

		// get the grand parent div of the video
		parent_div = $(this).closest('div');
		
		// get the parent of the image shown
		// video_image_holder_div = $(this).closest('div').find('div');

		// get the image tag 
		video_image_holder = $(parent_div).find('img');

		// it's a gif
		// leave the following part 
		// return now.
		if(!video_image_holder.css('background-image')) return;

		// wrap the image div with a new link,
		// on click will take him to the next tab and will open the video
		wrapper(video_image_holder, video_original_link);

		// play button
		play_button_image_holder = $(parent_div).parent().find('i').last();

		//wrap the play button with the link
		// on click, it'll open in new tab.
		wrapper(play_button_image_holder, video_original_link);


		// change video source url
		changeVideoSource($(this));

		// remove the video
		//$(this).remove();
	});
}

function wrapper(context, link){
	$(context).wrap(function(){
		return "<a href='{0}' target='_blank' title='{1}'></a>".format(link, title);
	});
}

function getSharedVideoLink(context){
	// get the root of the div for the video holder
	user_content_wrapper = context.closest("div.userContentWrapper");
	// return the post url from the anchor one level top to the timestamp
	return $(user_content_wrapper).find('span.timestampContent').closest('a').attr('href');
}

function changeVideoSource(context){
	// get the video tag
	videoTag = $(context).find('source').context;
	// get the id
	id = "video#" + videoTag.id;
	// get the firts item
	video = $(id).get(0);
	// if the video has different source than empty
	if(video.src){
		// point source to null
		video.src = "";
		// load the video
		video.load();
	}
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	// if a message is received from the background 
	// and the message is remove_videos
	if( request.message === "remove_videos" ) {
		// wait for few seconds, and remove the video
		waitAndRemoveVideo();
	}
});

function waitAndRemoveVideo(){
	// wait for X seconds.
	setTimeout(function() {
		// call method to remove the video / videos
		remove_videos();
	}, 5000);
}

// call the method to wait and remove the video
waitAndRemoveVideo();