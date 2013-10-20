goog.provide('al.view.MobileIntroScreen');


al.view.MobileIntroScreen = function() {
  al.view.AbstractView.call(this);
  goog.events.listenOnce(this, this.PAGE_LOADED, this.pageLoadedHandler, false, this);
  this.loadPage('mobile-initial.html');
}

goog.inherits(al.view.MobileIntroScreen, al.view.AbstractView);


al.view.MobileIntroScreen.prototype.pageLoadedHandler = function(event) {
  var that = this;
  this.domElement = goog.dom.getElementByClass('pageContent', this.document);
  goog.dom.append(goog.dom.getDocument().body, this.domElement);
  goog.events.listen(goog.dom.getElementByClass('submitBtn', this.domElement), goog.events.EventType.CLICK, function(event) {
    this.dispatchEvent({type: this.REQUEST_SOCKET_CONNECTION, code: goog.dom.getElementByClass('codeInput', this.domElement).value});
    event.preventDefault();
    return false;
  }, false, this);
}

al.view.MobileIntroScreen.prototype.displayeError = function() {
  goog.dom.getElement('error', this.domElement).innerText = 'Unable to find a client with that code';
  goog.dom.getElement('codeInput', this.domElement).value = '';
}