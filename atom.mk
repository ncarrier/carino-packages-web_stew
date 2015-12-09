LOCAL_PATH := $(call my-dir)

include $(CLEAR_VARS)

LOCAL_MODULE := web_stew
LOCAL_DESCRIPTION := Javascript client controlling the vehicle
LOCAL_CATEGORY_PATH := controllers

LOCAL_COPY_FILES := \
	js/phaser.min.js:var/www/js/ \
	js/client.js:var/www/js/ \
	index.html:var/www/

include $(BUILD_CUSTOM)
