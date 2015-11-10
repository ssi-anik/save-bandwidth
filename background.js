// is next execution true
var execute = false;
// valid facebook request host name
var valid_hosts = [
	'akamaihd',
	'facebook',
	'fbcdn'
];
// optional information
optional_extra_information = ["responseHeaders"];

// filters to catch the urls
filter = {
	urls: ["<all_urls>"]
};

// on click callable
// responsible for 
var onClickCallback = function(tab) {
	sendMessage(tab);
};

// on http request complete callback
// will receive call when an http call is complete
var onHttpRequestCompleteCallback = function(request) {
	// if the next execution is valid, 
	// nothing to do next
	if(execute) 
		return;
	// check if the requested hosts are valid for the next execution
	for(var i in valid_hosts){
		url = request.url;
		// if the url contain a valid host
		if(url.indexOf(valid_hosts[i]) >= 0){
			// make execution true for next time
			// and break
			execute = true;
			break;
		}
	}
};

// send a message on different activity
// remove videos that are active
function sendMessage(tab){
	// check the avilable tabs
	chrome.tabs.query({}, function(tabs) {
	    var message = {
	    	"message": "remove_videos"
	    };
	    for (var i=0; i<tabs.length; ++i) {
	    	// pass message to the tabs
	        chrome.tabs.sendMessage(tabs[i].id, message);
	    }
	});
}

// register a listener for on icon click
chrome.browserAction.onClicked.addListener(onClickCallback);

// register http request listener
chrome.webRequest.onCompleted.addListener(onHttpRequestCompleteCallback, filter, optional_extra_information);

// an observer for sending message if a new request is made
// data is received from the server
function observer(){
	if(execute){
		execute = false;
		sendMessage(null);
	}
}

// run observer in every 20 seconds
setInterval(observer, 20000);