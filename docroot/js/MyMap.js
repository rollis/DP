MyMap = function(id){

var map = new L.Map(id).setView([40.75831, -73.99151], 17);

new L.TileLayer(
  'http://{s}.tiles.mapbox.com/v3/osmbuildings.gm744p3p/{z}/{x}/{y}.png',
  { attribution: 'Map tiles &copy; <a href="http://mapbox.com">MapBox</a>', maxNativeZoom: 19, maxZoom: 21 }
).addTo(map);

var osmb = new OSMBuildings(map)
  .date(new Date(2014, 5, 15, 17, 30))
  .load()
  .click(function(id) {
    console.log('feature id clicked:', id);
  });

L.control.layers({}, { Buildings: osmb }).addTo(map);

var path = [];

var request = {
    ajaxStep: "search",
    term: "restaurant",
    latitude: 40.75831,
    longitude: -73.99151
};
$(".leaflet-map-pane").on('click', ".thumb", function(e){
  
  console.log(e.target);
});

$.get("http://edwardrockhands.com/Edward_Map/yelp_api.php",request, function(res){
  var data = $.parseJSON(res);
  $.each(data, function(index, value){
    console.log(value);
    var address = value.location.display_address.toString();
    new google.maps.Geocoder().geocode({"address": address}, function(results, status) {
      if(status == google.maps.GeocoderStatus.OK) {
        lat_long = {
          latitude: results[0]["geometry"]["location"]["k"],
          longitude: results[0]["geometry"]["location"]["B"]
        };

        var myIcon = L.divIcon({className: 'my-div-icon', iconSize: L.point(50, 50), html:"<img class='thumb' src='"+value.image_url+"'>"});
        console.log(myIcon);
        L.marker([lat_long.latitude, lat_long.longitude], {icon: myIcon}).addTo(map);
      }
    });
  });
});

map.on("click", function(e){
  path.push(e.latlng);
  if(path.length === 2){    
    var latlngs = [];
    var directionsService = new google.maps.DirectionsService();
        var request = makeRequest(path[0].lat, path[0].lng, path[1].lat, path[1].lng);
        path.shift();
        directionsService.route(request, function(result, status) {
            if (status === google.maps.DirectionsStatus.OK) {
              result.routes[0].overview_path.forEach(function(item) {
                latlngs.push(L.latLng(item.k, item.B));
              });
              L.polyline(latlngs, {color: 'red'}).addTo(map);
            }
        });
  }
});



function makeRequest(start_lat, start_long, end_lat, end_long) {
    var start = new google.maps.LatLng(start_lat, start_long);
    var end = new google.maps.LatLng(end_lat, end_long);
    var request = {
        origin: start,
        destination: end,
        travelMode: google.maps.TravelMode.DRIVING
    };

    return request;
};

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
}