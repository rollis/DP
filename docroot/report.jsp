
<%
	/**
 * Copyright (c) 2000-2013 Liferay, Inc. All rights reserved.
 *
 * This library is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Lesser General Public License as published by the Free
 * Software Foundation; either version 2.1 of the License, or (at your option)
 * any later version.
 *
 * This library is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for more
 * details.
 */
%>

<%@ taglib uri="http://java.sun.com/portlet_2_0" prefix="portlet"%>

<portlet:defineObjects />

<!-- styles -->
<style type="text/css">
	@import '/PlanningMap-portlet/css/venuecell.css';
	@import '/PlanningMap-portlet/html/assets/css/pages/feature_timeline2.css';
	@import '/PlanningMap-portlet/html/assets/css/app.css';
	@import '/PlanningMap-portlet/html/assets/plugins/bootstrap/css/bootstrap.min.css';
	@import '/PlanningMap-portlet/html/assets/plugins/font-awesome/css/font-awesome.min.css';
</style>
<link rel="stylesheet" href="http://cdn.leafletjs.com/leaflet-0.7/leaflet.css">


<!-- scripts -->
<script src="/PlanningMap-portlet/js/jquery-1.11.1.min.js"></script>
<script type="text/javascript" src="/PlanningMap-portlet/js/mustache.js"></script>
<script type="text/javascript"
src="/PlanningMap-portlet/js/venuelist.js"></script>

<script src="http://cdn.leafletjs.com/leaflet-0.7/leaflet-src.js"></script>
<script src="/PlanningMap-portlet/js/OSMBuildings-Leaflet.js"></script>
<script type="text/javascript" src="/PlanningMap-portlet/js/jquery-1.11.1.min.js"></script>
<script type="text/javascript"
src="http://maps.googleapis.com/maps/api/js?key=AIzaSyBhzZJIOGZWs2Jes80c5Oxy6zA-kqhuEQQ"></script>
<script src="/PlanningMap-portlet/js/MyMap.js"></script>
<script type="text/javascript" src="/PlanningMap-portlet/html/assets/plugins/back-to-top.js"></script>

<%
System.out.println(renderRequest.getParameter("method"));
%>

<body>
	<div class='map-wrapper'>
		<div id="map" style="width:100%;height:35%;"></div>
	</div>
	<script>
		var map;
		var portletURL = '/PlanningMap-portlet/html/';
		$(document).ready(function() {
			renderMapPanel();
			$.getJSON(portletURL + 'sample.json', renderVenueList);
		});

		function renderMapWrapper() {
			$.get(portletURL + 'mappanel.mustache', function(template) {
				$('.map-wrapper').html(Mustache.render(template, {}));
				map = new MyMap('map');
			});
		}

		function renderVenueList(jsondata) {
			if (!jsondata.Error) {
				jsondata = addIndexToBusiness(jsondata);
				$.get(portletURL + 'venuecell.mustache', function(template) {
					$('.venue-list-wrapper').html(
						Mustache.render(template, jsondata));
				});
			} else {
				alert(json.Message);
			}
		};
	</script>
	<div class='map-wrapper'></div>
	<div class="venue-list-wrapper"></div>
	<div class="venue-detail-wrapper"></div>

	<div class="print-pdf-wrapper">
		<script>
		var pfHeaderImgUrl = '';var pfHeaderTagline = '';var pfdisableClickToDel = 0;var pfHideImages = 0;var pfImageDisplayStyle = 'right';var pfDisablePDF = 0;var pfDisableEmail = 0;var pfDisablePrint = 0;var pfCustomCSS = '';var pfBtVersion='1';(function(){var js, pf;pf = document.createElement('script');pf.type = 'text/javascript';if('https:' == document.location.protocol){js='https://pf-cdn.printfriendly.com/ssl/main.js'}else{js='http://cdn.printfriendly.com/printfriendly.js'}pf.src=js;document.getElementsByTagName('head')[0].appendChild(pf)})();
		</script>

		<button class="btn-u btn-u-orange" type="button" onclick="window.print();return false;">
			<i class="fa fa-print"></i>Printer Friendly and PDF
		</button>
	</div>

	<div id="topcontrol" title="Scroll Back to Top" style="position: fixed; bottom: 5px; right: 5px; opacity: 1; cursor: pointer;"><img src="assets/img/up.png" style="width:51px; height:42px"></div>
</body>