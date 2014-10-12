var start_latlng;
var businesses;

// It gets a latitude and a longitude about the location, and then,
// it returns the latitude and longitude to the callback function.
function requestLatLng(address, callback) {
	var lat_long;
	new google.maps.Geocoder().geocode({"address": address}, function(results, status) {
		if(status == google.maps.GeocoderStatus.OK) {
			lat_long = {
				latitude: results[0]["geometry"]["location"]["k"],
				longitude: results[0]["geometry"]["location"]["B"]
			};
			callback(lat_long);
		}
	});
}

function getLatLng(latlng){
	start_latlng = latlng;
}

// It gets businesses related with keyword near with the latitude
// and longitude, and then, it returns the businesses to the callback
// function.
function getBusinesses(latlng, keyword, callback) {
	var request = {
		ajaxStep: "search",
		term: keyword,
		latitude: latlng["latitude"],
		longitude: latlng["longitude"]
	};

	console.log(request);	
	$.get("../yelp_api.php", request).done(function(response) {
		callback(response);
	});
}

function setBusinesses(response) {
	businesses = response;
}

/* Just remain it.
function getDirection() {
	// Make a request according to the start and end infomation
	var request;
	request = makeRequest();

	directionsService.route(request, function(result, status) {
		if(status == google.maps.DirectionsStatus.OK) {
			var lls = getLL(result);
			$("#googleOutput").val(lls);
		}
	});
}
*/

// It creates a request and return it
/* Just remain it.
function makeRequest() {
	var start = $("#start").val();
	var end = $("#end").val();

	var request = {
		origin: start,
		destination: end,
		travelMode: google.maps.TravelMode.DRIVING
	};

	return request;
}
*/

// Get all latitudes and longitudes from the paths
/*
function getLL(result) {
	var leg = result["routes"][0]["legs"][0];

	var startLL = {
		latitude: leg["start_location"]["k"],
		longitude: leg["start_location"]["B"]
	};
	var endLL = {
		latitude: leg["end_location"]["k"],
		longitude: leg["end_location"]["B"]
	};

	var paths = new Array();
	paths.push(startLL);

	for(var s=0 ; s<leg["steps"].length ; s++) {
		var step = leg["steps"][s];

		for(var p=0 ; p<step["path"].length ; p++) {
			var path = step["path"][p];
			paths.push({
				latitude: path["k"],
				longitude: path["B"]
			});
		}
	}
	paths.push(endLL);

	var pathInfo = {
		paths: paths,
		distance: leg["distance"]["value"]
	};

	return pathInfo;
}
*/
