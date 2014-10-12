package com.dateplanner.util;

import com.google.gson.Gson;
import com.liferay.portal.kernel.exception.PortalException;
import com.liferay.portal.kernel.exception.SystemException;
import com.liferay.portal.model.User;
import com.liferay.portal.service.UserLocalServiceUtil;

public class Utility {
	public User getUser(String userId) throws NumberFormatException, PortalException, SystemException{
		return UserLocalServiceUtil.getUser(Long.parseLong(userId));
	}
	
	public String toJson(Object object){
		Gson gson = new Gson();
		return gson.toJson(object);
	}
	
	
}
