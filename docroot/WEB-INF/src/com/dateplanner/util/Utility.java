package com.dateplanner.util;

import com.google.gson.Gson;

public class Utility {
	public String toJson(Object object){
		Gson gson = new Gson();
		return gson.toJson(object);
	}
}
