
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

<%@ page import="com.liferay.portal.kernel.util.ParamUtil" %>
<%@ page import="com.liferay.portal.kernel.util.Validator" %>
<%@ page import="com.liferay.portlet.PortletPreferencesFactoryUtil" %>
<%@ page import="javax.portlet.PortletPreferences" %>

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
<link rel="stylesheet" href="//code.jquery.com/ui/1.11.1/themes/smoothness/jquery-ui.css">
<script src="//code.jquery.com/ui/1.11.1/jquery-ui.js"></script>
<script type="text/javascript"
src="http://maps.googleapis.com/maps/api/js?key=AIzaSyBhzZJIOGZWs2Jes80c5Oxy6zA-kqhuEQQ"></script>
<script src="/PlanningMap-portlet/js/MyMap.js"></script>
<script type="text/javascript" src="/PlanningMap-portlet/html/assets/plugins/back-to-top.js"></script>

<link rel="stylesheet" href="/PlanningMap-portlet/html/assets/plugins/bootstrap/css/bootstrap.min.css">
<link rel="stylesheet" href="/PlanningMap-portlet/html/assets/css/style.css">

<!-- CSS Implementing Plugins -->
<link rel="stylesheet" href="/PlanningMap-portlet/html/assets/plugins/line-icons/line-icons.css">
<link rel="stylesheet" href="/PlanningMap-portlet/html/assets/plugins/font-awesome/css/font-awesome.min.css">

<!-- CSS Theme -->    
<link rel="stylesheet" href="/PlanningMap-portlet/html/assets/css/themes/default.css" id="style_color">

<!-- CSS Customization -->
<link rel="stylesheet" href="/PlanningMap-portlet/html/assets/css/custom.css">

<%
	PortletPreferences preferences = renderRequest.getPreferences();
	
	 
	String portletResource = ParamUtil.getString(request, "portletResource");
	
	if (Validator.isNotNull(portletResource)) {
	    preferences = PortletPreferencesFactoryUtil.getPortletSetup(request, portletResource);
	}
	String venues = preferences.getValue("venues", "[]");
%>

<body>
	<script>
		var map;
		var portletURL = '/PlanningMap-portlet/html/';
		var venues = $.parseJSON('<%=venues%>');
		
		function renderMapPanel() {
			$.get(portletURL + 'mappanel.mustache', function(template) {
				$('.map-wrapper').html(Mustache.render(template, {}));
				map = new MyMap('map', venues);
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
		
		$(document).ready(function() {
			renderMapPanel();
			$.getJSON(portletURL + 'sample.json', renderVenueList);
		});
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

	<div id="topcontrol" title="Scroll Back to Top" style="position: fixed; bottom: 5px; right: 5px; opacity: 1; cursor: pointer;"><img src="/PlanningMap-portlet/html/assets/img/up.png" style="width:51px; height:42px"></div>
</body>