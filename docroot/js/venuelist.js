function addIndexToBusiness(businessJson) {
	var venueArray = businessJson.businesses;
	for ( idx in venueArray) {
		venueArray[idx]['index'] = parseInt(idx)+1;	
	}
	return businessJson;
}