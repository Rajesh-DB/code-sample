goog.provide('al.Application')

goog.require('goog.dom');
goog.require('goog.events');

goog.require('al.DeviceDetection');


al.Application = function() {
  this.deviceDetection = new al.DeviceDetection();
  this.currentView = null;
  this.rtcConnection = null;

  if(!this.deviceDetection.hasCapabilities) {
    // tell user their browser sucks
    alert('sorry, your browser sucks');
  } else {
    if(this.deviceDetection.isMobile) {
      //TODO: Abstract the views that need to be loaded into data model(s)
      this.currentView = new al.view.MobileIntroScreen();
//      this.currentView = new al.view.MobileInteractiveScreen();
      goog.events.listen(this.currentView, this.currentView.REQUEST_SOCKET_CONNECTION, this.socketRequestedHandler, false, this);
    } else {
      this.currentView = new al.view.DesktopIntroScreen();
      goog.events.listen(this.currentView, this.currentView.REQUEST_SOCKET_CONNECTION, this.socketRequestedHandler, false, this);
    }

  }
}


al.Application.prototype.socketRequestedHandler = function(event) {
  this.externalConnection = new al.RealtimeConnection(event.code);
  goog.events.listen(this.externalConnection, this.externalConnection.CLIENT_CONNECTED, this.clientsConnectedHandler, false, this);
  goog.events.listen(this.externalConnection, this.externalConnection.CLIENT_MATCHED, this.clientsConnectedHandler, false, this);
  goog.events.listen(this.externalConnection, this.externalConnection.CLIENT_NOT_MATCHED, this.clientNotConnectedHandler, false, this);
  goog.events.listen(this.externalConnection, this.externalConnection.BALL_REQUESTED, this.ballRequestedHandler, false, this);
}

al.Application.prototype.clientsConnectedHandler = function(event) {
  // display next view
  this.currentView.removeView();
  if(this.deviceDetection.isMobile) {
    this.currentView = new al.view.MobileInteractiveScreen();
    goog.events.listen(this.currentView, this.currentView.SEND_SOCKET_MESSAGE, this.sendSocketMessageHandler, false, this);
  } else {
    this.currentView = new al.view.DesktopMainScreen();
  }
}

al.Application.prototype.clientNotConnectedHandler = function(event) {
  // display error if mobile client
  if(this.deviceDetection.isMobile) {
    this.currentView.displayError();
  }
}

al.Application.prototype.sendSocketMessageHandler = function(event) {
  this.externalConnection.sendMessage(event.messageType, event.params);
}

al.Application.prototype.ballRequestedHandler = function(event) {
  if(this.currentView instanceof al.view.DesktopMainScreen) {
    this.currentView.addBall(event.params);
  }
}


var app = new al.Application();