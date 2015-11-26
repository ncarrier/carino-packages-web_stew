LOCAL_PATH := $(call my-dir)

include $(CLEAR_VARS)

LOCAL_MODULE := web_stew
LOCAL_DESCRIPTION := Javascript client controlling the vehicle
LOCAL_CATEGORY_PATH := controllers

LOCAL_COPY_FILES := \
	cgi-bin/index.cgi:var/www/cgi-bin/ \
	index.html:var/www/

include $(BUILD_CUSTOM)
