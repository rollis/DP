
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

<style type="text/css">
@import '/PlanningMap-portlet/css/venuecell.css';

@import
	'/PlanningMap-portlet/html/assets/css/pages/feature_timeline2.css';

@import '/PlanningMap-portlet/html/assets/css/app.css';

@import
	'/PlanningMap-portlet/html/assets/plugins/bootstrap/css/bootstrap.min.css'
	;
</style>

<script src="/PlanningMap-portlet/js/jquery-1.11.1.min.js"></script>
<script type="text/javascript" src="/PlanningMap-portlet/js/mustache.js"></script>
<script type="text/javascript"
	src="/PlanningMap-portlet/js/venuelist.js"></script>

<script src="http://cdn.leafletjs.com/leaflet-0.7/leaflet-src.js"></script>
<script src="/PlanningMap-portlet/js/OSMBuildings-Leaflet.js"></script>
<script type="text/javascript"
	src="/PlanningMap-portlet/js/jquery-1.11.1.min.js"></script>
<script type="text/javascript"
	src="http://maps.googleapis.com/maps/api/js?key=AIzaSyBhzZJIOGZWs2Jes80c5Oxy6zA-kqhuEQQ"></script>
<script src="/PlanningMap-portlet/js/MyMap.js"></script>

<%
	System.out.println(renderRequest.getParameter("method"));
%>

<script>
	var portletURL = '/PlanningMap-portlet/html/';

	new MyMap('map');
</script>

<body>
	<script>
		$(document).ready(function() {
			renderMapWrapper();
			$.getJSON(portletURL + 'sample.json', renderVenueList);
		});

		function renderMapWrapper() {
			$.get(portletURL + 'mapwrapper.mustache', function(template) {
				$('.map-wrapper').html(Mustache.render(template, {}));
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

	<div></div>

</body>