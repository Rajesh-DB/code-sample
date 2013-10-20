goog.provide('al.RealtimeConnection');

goog.require('goog.dom');
goog.require('goog.Uri');
goog.require('goog.net.WebSocket');
goog.require('goog.events.EventType');

al.RealtimeConnection = function(code) {
  goog.events.EventTarget.call(this);
  this.NAME = 'realtimeConnection';
  this.CLIENT_CONNECTED = this.NAME + 'ClientConnected';
  this.CLIENT_MATCHED = this.NAME + 'ClientMatched';
  this.CLIENT_NOT_MATCHED = this.NAME + 'ClientNotMatched';
  this.BALL_REQUESTED = this.NAME + 'BallRequested';


  this.code = code;
  this.pusher = new Pusher('143596c14eddb2982ed5', { authTransport: 'jsonp' });
  this.channel = this.pusher.subscribe('private-code-sample');
  this.addEventListeners();


}

goog.inherits(al.RealtimeConnection, goog.events.EventTarget);

al.RealtimeConnection.prototype.addEventListeners = function() {

  this.channel.bind('pusher:subscription_succeeded', goog.bind(this.subscriptionSuccessHandler, this));
  this.channel.bind('pusher:subscription_error', goog.bind(this.subscriptionErrorHandler, this));
  this.channel.bind('client-code-send', goog.bind(this.codeReceivedHandler, this));
  this.channel.bind('client-code-matched', goog.bind(this.codeMatchedHandler, this));
  this.channel.bind('client-code-notmatched', goog.bind(this.codeNotMatchedHandler, this));
  this.channel.bind('client-send-ball', goog.bind(this.ballReceivedHandler, this));
}

/**
 * We've connected successfully, so send out message with the code
 * @param event
 */
al.RealtimeConnection.prototype.subscriptionSuccessHandler = function(event) {
  this.channel.trigger('client-code-send', {code: this.code});
}

al.RealtimeConnection.prototype.subscriptionErrorHandler = function(event) {

}

al.RealtimeConnection.prototype.sendMessage = function(messageType, params) {
  this.channel.trigger(messageType, {params: params, code: this.code});
}

/**
 * Another client has sent us a code. If it matches then we can display the next screen - tell the other client that it can too
 * Else if the code sent back is the same we sent then tell the app that we got the wrong code
 * @param event
 */
al.RealtimeConnection.prototype.codeReceivedHandler = function(event) {
  console.log("CODE RECEIVED: " + event.code);
  console.log(this.code);
  if(event.code === this.code) {
    this.dispatchEvent({type: this.CLIENT_CONNECTED});
    this.channel.trigger('client-code-matched', {});
  } else {
    if(event.code === this.code) {
      this.channel.trigger('client-code-notmatched', {code: event.code});
      this.dispatchEvent({type: this.CLIENT_NOT_MATCHED});
    }
  }
}

/**
 * We've received notice from the other attached app that we can display the next screen
 * @param event
 */
al.RealtimeConnection.prototype.codeMatchedHandler = function(event) {
  this.dispatchEvent({type: this.CLIENT_MATCHED});
}

al.RealtimeConnection.prototype.codeNotMatchedHandler = function(event) {
  if(event.code === this.code) {
    this.dispatchEvent({type: this.CLIENT_NOT_MATCHED});
  }
}

al.RealtimeConnection.prototype.ballReceivedHandler = function(event) {
  if(event.code === this.code) {
    this.dispatchEvent({type: this.BALL_REQUESTED, params: event.params});
  }
}

