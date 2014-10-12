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
	User user = UserLocalServiceUtil.getUser(Long.parseLong(userId));
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
<script type="text/javascript" src="/PlanningMap-portlet/js/jquery-1.11.1.min.js"></script>
<script src="/PlanningMap-portlet/js/three.min.js"></script>
<script src="/PlanningMap-portlet/js/Color.js"></script>
<script type="text/javascript" src="http://maps.googleapis.com/maps/api/js?key=AIzaSyBhzZJIOGZWs2Jes80c5Oxy6zA-kqhuEQQ"></script>
<script src="/PlanningMap-portlet/js/map.js"></script>

<script>
	var saved = <%=saved%>;
	var user = new Object();
	user.userId = '<%=userId%>';
	user.userName = '<%=userName%>';
	user.userAddress = $.parseJSON('<%=userAddress%>');

	var resUrl ='<%=renderResponse.encodeURL(jsURL.toString())%>';
</script>

<div id="map"></div>

<aui:form action="<%=saveURL%>" method="post">
    <aui:input type="hidden" name="method" value="save"/>
    <aui:button type="submit" value="Save"/>
</aui:form>

<aui:form action="<%=renderURL%>" method="post">
	<aui:input type="hidden" name="method" value="report"/>
	<aui:button type="submit" value="Report"/>
</aui:form>

<script>
	var map = new Map($("#map")[0]);
</script>


