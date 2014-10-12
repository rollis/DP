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

<%@ taglib uri="http://java.sun.com/portlet_2_0" prefix="portlet" %>
<%@ taglib uri="http://liferay.com/tld/aui" prefix="aui" %>

<%@ page import="javax.portlet.PortletPreferences" %>
<%@ page import="com.liferay.portal.service.UserLocalServiceUtil" %>
<%@ page import="com.liferay.portal.model.User" %>
<%@ page import="com.liferay.portal.model.Address" %>
<%@ page import="java.util.List" %>
<%@ page import="com.dateplanner.util.Utility" %>

<portlet:actionURL var="saveURL"/>

<portlet:renderURL var="renderURL">
    <portlet:param name="jspPage" value="/report.jsp" />
</portlet:renderURL>

<portlet:resourceURL var="jsURL" id="js" escapeXml="false" />

<portlet:defineObjects />

<%
	Utility util = new Utility();

	String saved = renderRequest.getParameter("saved") != null ? renderRequest.getParameter("saved") : "false";
	
	String userId = renderRequest.getRemoteUser();
	User user = util.getUser(userId);
	
	String userName = user.getScreenName();
	List<Address> addresses = user.getAddresses();
	
	String userAddress = "";
	
	for(Address address : addresses){
		if(address.isPrimary())
			userAddress = util.toJson(address);			
	}
	
	//PortletPreferences prefs = renderRequest.getPreferences();

	//String greeting = (String)prefs.getValue()


%>
<link rel="stylesheet" href="http://cdn.leafletjs.com/leaflet-0.7/leaflet.css">
<script src="http://cdn.leafletjs.com/leaflet-0.7/leaflet-src.js"></script>
<script src="/PlanningMap-portlet/js/OSMBuildings-Leaflet.js"></script>
<script type="text/javascript" src="/PlanningMap-portlet/js/jquery-1.11.1.min.js"></script>
<script type="text/javascript" src="http://maps.googleapis.com/maps/api/js?key=AIzaSyBhzZJIOGZWs2Jes80c5Oxy6zA-kqhuEQQ"></script>
<script src="/PlanningMap-portlet/js/MyMap.js"></script>


<script>
	var saved = <%=saved%>;
	var user = new Object();
	user.userId = '<%=userId%>';
	user.userName = '<%=userName%>';
	user.userAddress = $.parseJSON('<%=userAddress%>');

	var resUrl ='<%=renderResponse.encodeURL(jsURL.toString())%>';
	var saveForm;
</script>

<div id="map" style="width:900px;height:540px;"></div>
<div class="alert alert-info fade in" id="alert">
  <button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button>
  <h4>Add New Venue</h4>
  <p>Do you want add new venue?</p>
  <p>
      <a class="btn-u btn-u-xs btn-u-default" id="add_venue" href="#"><i class="fa fa-cog"></i>OK</a> 
      <a class="btn-u btn-u-xs btn-u-dark" id="cancel" href="#"><i class="fa fa-flask"></i>Cancel</a>
  </p>
</div>

<aui:script>
	var myMap = new MyMap('map');

	function saveForm(){
		saveForm = $('#<portlet:namespace />saveForm');
		var venues = myMap.getVenues();
		var venuesString = $.getJSON(venues);
		saveForm.find("input[name='venues']").val(venuesString);
		saveForm.submit();
	};
	
	function goToReport(){
		reportForm = $('#<portlet:namespace />reportForm');
		if(saved){
			reportForm.submit();
		} else {
			if(confirm("Do you want to disregard changes?")){
				reportForm.submit();
			}
		}
	};
</aui:script>
<aui:form name="saveForm" action="<%=saveURL%>" method="post" cssClass="inline">
    <aui:input type="hidden" name="method" value="save"/>
    <aui:input type="hidden" name="venues" value=""/>    
    <aui:button type="button" value="Save" cssClass="btn btn-primary" onclick="saveForm();"/>
</aui:form>

<aui:form name="reportForm" action="<%=renderURL%>" method="post" cssClass="inline">
	<aui:input type="hidden" name="method" value="report"/>
	
	<aui:button type="button" value="Report" cssClass="btn btn-primary" onclick="goToReport();"/>
</aui:form>