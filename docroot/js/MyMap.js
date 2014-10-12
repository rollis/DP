var path=[], venues= [], track=[];
var elapedtime = 0;
var detail;


MyMap = function(id, report){
  $("#"+id).append('<div id="radius_input">\
    <div><button class="btn-u travel-type" type="button" value="DRIVING" style="margin-right:5px;"><i class="fa fa-car"></i></button><button class="btn-u travel-type" value="WALKING" type="button"><i class="fa fa-paw"></i></button>\
    </div>\
    <p><label for="amount">Radius:</label>\
    <input type="text" id="amount" readonly style="width:100px;border:0; color:#f6931f; font-weight:bold;"></p>\
    <div id="slider"></div>\
    <div>\
    <label for="keyword">Keyword:</label>\
    <input type="text" id="keyword" value="restaurant" style="margin-bottom:10px;">\
    </div>\
    <button class="btn btn-success btn-xs" type="button" id="search"><i class="fa fa-search"></i>Search</button>\
    </div>');

  this.searchResultVenues=[];
  this.selectedVenues=[];
  var currentVenue = null;
  var drivingtype = google.maps.TravelMode.DRIVING;

  $(".travel-type").click(function(e){
    if($(e.target).val() === "WALKING"){
      drivingtype = google.maps.TravelMode.WALKING;
    }else{
      drivingtype = google.maps.TravelMode.DRIVING;    
    }
  });


$( "#slider" ).slider({
  value:500,
  min: 0,
  max: 10000,
  step: 100,
  slide: function( event, ui ) {
    $( "#amount" ).val( ui.value + " meter ");
  }
});
$( "#amount" ).val($( "#slider" ).slider( "value" ) + " meter" );

  $( "#slider" ).slider({
    value:500,
    min: 0,
    max: 10000,
    step: 100,
    slide: function( event, ui ) {
      $( "#amount" ).val( ui.value + " meter ");
    }
  });

  $( "#amount" ).val($( "#slider" ).slider( "value" ) + " meter" );
  var self = this;
  $("#search").click(function(e){
    $(".my-thumb-icon").remove();
    var request = {
      ajaxStep: "search",
      term: "restaurant",
      latitude: 40.75831,
      longitude: -73.99151,
      term: $("#keyword").val(),
      radius: $("#amount").val().split(" ")[0],
      limit:20
    };
    getSearchResultFromAPI(request);
  });

  function getSearchResultFromAPI(request)
  {
    $.get("http://edwardrockhands.com/Edward_Map/yelp_api.php",request, function(res){
      var data = $.parseJSON(res);
      $.each(data, function(index, value){
        self.searchResultVenues.push(value);
        var address = value.location.display_address.toString();
        new google.maps.Geocoder().geocode({"address": address}, function(results, status) {
          if(status == google.maps.GeocoderStatus.OK) {
            lat_long = {
              latitude: results[0]["geometry"]["location"]["k"],
              longitude: results[0]["geometry"]["location"]["B"]
            };
            var markerElement = L.divIcon({className: 'my-thumb-icon', iconSize: L.point(50, 50), html:"<div class='counters'><span class='counter-icon'><i class='map-marker bubble fa fa-coffee rounded'></i></span><div class='thumb' id='"+value.id+"' data-lat='"+lat_long.latitude+"' data-lng='"+lat_long.longitude+"'>"+value.html+"</div>"});
            L.marker([lat_long.latitude, lat_long.longitude], {icon: markerElement}).addTo(map);
          }
        });
      });
    });
  }

  var map = new L.Map(id).setView([40.75831, -73.99151], 17);

  var myIcon = L.divIcon({className: 'current-location-icon', iconSize: L.point(50, 50), html:"<i class='fa fa-child' style='font-size:30px;'></i>"});
  var center = map.getCenter();
  this.selectedVenues.push(['start',[center.lat, center.lng],'C']);
  L.marker([center.lat, center.lng], {icon: myIcon}).addTo(map);


  new L.TileLayer(
    'http://{s}.tiles.mapbox.com/v3/osmbuildings.gm744p3p/{z}/{x}/{y}.png',
    { attribution: 'Map tiles &copy; <a href="http://mapbox.com">MapBox</a>', maxNativeZoom: 19, maxZoom: 21 }
    ).addTo(map);

 
 var osmb = new OSMBuildings(map)
  .date(new Date(2014, 5, 15, 17, 30))
  .load()
  .click(function(id) {
    //console.log('feature id clicked:', id);
  });
  L.control.layers({}, { Buildings: osmb }).addTo(map);

  //var path = [];
  path.push(center);

  if(typeof report !== "undefined"){
    console.log(report);
    var savedPath = [];
    report.forEach(function(item){
      savedPath.push(L.latLng(item[1][0], item[1][1]));
    });
    L.polyline(savedPath, {color: 'red'}).addTo(map);
  }
  
  $('.leaflet-map-pane').on('click', '.my-thumb-icon', function(e) {
    var target = $(e.currentTarget).find('.thumb');
    currentVenue = {id:target.attr('id'), lat:target.data('lat'), lng:target.data('lng')};
    $('.my-thumb-icon').find('.output_controls').hide();
    $(this).find('.output_controls').show();
  });
  console.log($('.my-thumb-icon'));

$(".leaflet-map-pane").on('click', ".thumb", function(e){
  $("#alert").show();
  console.log(e);
  currentVenue = {id:$(e.target).attr('id'), lat:$(e.currentTarget).data('lat'), lng:$(e.currentTarget).data('lng')};
  var current = map.getCenter();

    var latlngs = [current, currentVenue];
    var directionsService = new google.maps.DirectionsService();
    var request = makeRequest(latlngs[0].lat, latlngs[0].lng, latlngs[1].lat, latlngs[1].lng);
    var duration, distance;
    directionsService.route(request, function(result, status) {
      if (status === google.maps.DirectionsStatus.OK) {
        duration = result.routes[0].legs[0].duration;
        distance = result.routes[0].legs[0].distance;
        console.log(duration, distance);
      }
    });
});

$("#alert .close, #alert #cancel").click(function(e){
  $("#alert").hide();
});

  $("#add_venue").click(function(e){
    self.selectedVenues.push([currentVenue.id, [currentVenue.lat, currentVenue.lng], 'Y']);
    console.log(self.selectedVenues);
    map.panTo(new L.LatLng(currentVenue.lat, currentVenue.lng));
    $(".my-thumb-icon").remove();
    $(".current-location-icon").remove();

    currentVenue = null;
    $("#alert").hide();

    var myIcon = L.divIcon({className: 'current-location-icon', iconSize: L.point(50, 50), html:"<i class='fa fa-child' style='font-size:30px;'></i>"});
    var center = map.getCenter();
    L.marker([center.lat, center.lng], {icon: myIcon}).addTo(map);

    path.push(center);
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
      travelMode: drivingtype
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


MyMap.prototype.getPath = function(){
  return path;
}

MyMap.prototype.getSelectedVenues = function(){
  return this.selectedVenues;
}
