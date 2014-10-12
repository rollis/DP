package com.dateplanner;

import java.io.IOException;

import javax.portlet.PortletException;
import javax.portlet.PortletRequestDispatcher;
import javax.portlet.RenderRequest;
import javax.portlet.RenderResponse;
import javax.portlet.ResourceRequest;
import javax.portlet.ResourceResponse;

import com.liferay.portal.kernel.log.Log;
import com.liferay.portal.kernel.log.LogFactoryUtil;
import com.liferay.util.bridges.mvc.MVCPortlet;

/**
 * Portlet implementation class NewPortlet
 */
public class PlanningMapPortlet extends MVCPortlet {
	private static Log log = LogFactoryUtil.getLog(PlanningMapPortlet.class.toString()); 
	
	public void test(){
		System.out.println("TEST");
	}

	public void serveResource(ResourceRequest resourceRequest,
            ResourceResponse resourceResponse) throws IOException{
		log.info("wintin serveResource method ");
		
		//resourceResponse.getWriter().write("'TEST':{}");
	}
	
	@Override
	public void doView(RenderRequest renderRequest, RenderResponse renderResponse) throws IOException, PortletException {
		LogFactoryUtil.getLog(PlanningMapPortlet.class.toString()).error("GGG");
		String name = (String) renderRequest.getParameter("Name");
		String pass = (String) renderRequest.getParameter("pass");
		renderRequest.setAttribute("name", name);
		renderRequest.setAttribute("pass", pass);
	
		System.out.println("wintin do view method ");
	
		PortletRequestDispatcher dispatcher = null;
		dispatcher = getPortletContext().getRequestDispatcher("/view.jsp");
		System.out.println("dispatching to view.jsp ");
		dispatcher.include(renderRequest, renderResponse);
	}
	
}
