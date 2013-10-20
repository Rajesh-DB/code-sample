goog.provide('al.DeviceDetection');

goog.require('goog.dom');
goog.require('goog.dom.classes');
goog.require('goog.array');

al.DeviceDetection = function() {
  this.isMobile = this.isMobileBrowser();
  this.hasCapabilities = this.getCapabilities();
}

/**
 * If we're on 'mobile' (iOS or Android), we only need to test for CSS 3D, CSS Transitions and Web Sockets
 * If we're on desktop, check we have webGL, CSS3d, CSS transitions and websockets
 */
al.DeviceDetection.prototype.getCapabilities = function() {
  //websockets csstransforms csstransforms3d csstransitions
  if(this.isMobile) {
    return this.hasSpecificCapabilities(['websockets', 'csstransforms', 'csstransforms3d', 'csstransitions']);
  } else {
    return (this.hasWebGL() && this.hasSpecificCapabilities(['websockets', 'csstransforms', 'csstransforms3d', 'csstransitions']));
  }
  return false;
}

al.DeviceDetection.prototype.hasSpecificCapabilities = function(capabilities) {
  var has = true,
      classes = goog.dom.classes.get(goog.dom.getElementsByTagNameAndClass('html')[0]);
  goog.array.forEach(capabilities, function(capability) {
    if(!goog.array.contains(classes, capability)) {
      has = false;
    }
  }, this);
  return has;
}

al.DeviceDetection.prototype.hasWebGL = function() {
  return window.WebGLRenderingContext;
}

/**
 * Return whether we're on Android or iPhone - other mobile browsers are probably also capable, but
 * just going to concentrate on these two
 * @returns {Array|{index: number, input: string}}
 */
al.DeviceDetection.prototype.isMobileBrowser = function() {
  return navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/iPhone|iPad|iPod/i);
}
