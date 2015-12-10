LOCAL_PATH := $(call my-dir)

include $(CLEAR_VARS)

LOCAL_MODULE := web_stew
LOCAL_DESCRIPTION := Javascript client controlling the vehicle
LOCAL_CATEGORY_PATH := controllers

LOCAL_COPY_FILES := \
	img/fullscreen.png:var/www/img/ \
	js/client.js:var/www/js/ \
	js/phaser.min.js:var/www/js/ \
	css/style.css:var/www/css/ \
	index.html:var/www/

include $(BUILD_CUSTOM)
