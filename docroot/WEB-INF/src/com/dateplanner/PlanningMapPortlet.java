package com.dateplanner;

import java.io.IOException;

import javax.portlet.ActionRequest;
import javax.portlet.ActionResponse;
import javax.portlet.PortletException;
import javax.portlet.PortletRequestDispatcher;
import javax.portlet.RenderRequest;
import javax.portlet.RenderResponse;
import javax.portlet.ResourceRequest;
import javax.portlet.ResourceResponse;

import com.dateplanner.util.Utility;
import com.liferay.portal.kernel.log.Log;
import com.liferay.portal.kernel.log.LogFactoryUtil;
import com.liferay.portal.model.User;
import com.liferay.util.bridges.mvc.MVCPortlet;

/**
 * Portlet implementation class NewPortlet
 */
public class PlanningMapPortlet extends MVCPortlet {
	private static final String className = PlanningMapPortlet.class.toString();
	private static Log log = LogFactoryUtil.getLog(className); 
	
	@Override
	public void processAction(ActionRequest actionRequest, ActionResponse actionResponse) throws IOException, PortletException{
		log.info("starting processAction method");
		log.info("Method: " + actionRequest.getParameter("method"));
		
		String method = actionRequest.getParameter("method") != null ? actionRequest.getParameter("method") : ""; 
		
		if(method.equalsIgnoreCase("save")){
			log.info("TODO: Save map");
			
			String userId = actionRequest.getRemoteUser();
			log.info("UserId: " + userId);
			
			
			actionResponse.setRenderParameter("saved", "true");
		}
	
	    super.processAction(actionRequest, actionResponse);
	}
	
	public void serveResource(ResourceRequest resourceRequest,
            ResourceResponse resourceResponse) throws IOException{
		log.info("starting serveResource method");
		
		if(resourceRequest.getParameter("method").equalsIgnoreCase("save")){
			
		}
		
		
		//resourceResponse.getWriter().write("'TEST':{}");
	}
	
	@Override
	public void doView(RenderRequest renderRequest, RenderResponse renderResponse) throws IOException, PortletException {
		log.info("starting doView method");
		
		String saved = (String) renderRequest.getParameter("saved");
		log.info("Saved: " + saved);
		/*
		
		String pass = (String) renderRequest.getParameter("pass");
		renderRequest.setAttribute("name", name);
		renderRequest.setAttribute("pass", pass);
		 */
	
		PortletRequestDispatcher dispatcher = null;
		dispatcher = getPortletContext().getRequestDispatcher("/view.jsp");
		
		log.info("dispatching to view.jsp");
		
		dispatcher.include(renderRequest, renderResponse);
	}
	
}
