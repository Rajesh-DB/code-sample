goog.provide('al.view.AbstractView');

goog.require('goog.dom');
goog.require('goog.events.EventTarget');
goog.require('goog.net.XhrIo');

al.view.AbstractView = function() {
  goog.events.EventTarget.call(this);
  this.NAME = 'abstractView';
  this.PAGE_LOADED = this.NAME + 'PageLoaded';
  this.REQUEST_SOCKET_CONNECTION = this.NAME + 'RequestSocket';
  this.SEND_SOCKET_MESSAGE = this.NAME + 'SendSocketMessage';

  this.document = null;
  this.domElement = null;
  this.loaderDomElem = goog.dom.htmlToDocumentFragment('<div class="loaderContainer"><div class="loaderOuter"><div class="loaderInner"></div></div></div>');
}

goog.inherits(al.view.AbstractView, goog.events.EventTarget);

al.view.AbstractView.prototype.displayLoader = function() {
  var that = this;
  this.loaderDomElem.style.opacity = 0;
  goog.dom.append(goog.dom.getDocument().body, this.loaderDomElem);

  setTimeout(function() {
    that.loaderDomElem.style.opacity = 1;
  }, 100);
}

al.view.AbstractView.prototype.removeLoader = function() {
  var that = this;
  this.loaderDomElem.style.opacity = 0;
  setTimeout(function() {
    goog.dom.removeNode(that.loaderDomElem);
  }, 750);
}

al.view.AbstractView.prototype.loadPage = function(url) {
  this.displayLoader();
  this.xhr = new goog.net.XhrIo();
  goog.events.listenOnce(this.xhr, goog.net.EventType.COMPLETE, this.xhrCompleteHandler, false, this);
  this.xhr.send(url);
}

al.view.AbstractView.prototype.xhrCompleteHandler = function(event) {
  this.document = goog.dom.htmlToDocumentFragment(event.target.getResponse());
  this.dispatchEvent({type: this.PAGE_LOADED});
  this.xhr.dispose();
}

al.view.AbstractView.prototype.pageLoadedHandler = function(event) {
  console.log("PAGE LOADED HANDLER NOT OVERRIDDEN");
}

al.view.AbstractView.prototype.displayError = function() {

}

al.view.AbstractView.prototype.removeView = function() {
  goog.dom.removeNode(this.domElement);
}