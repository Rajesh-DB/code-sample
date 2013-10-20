goog.provide('al.view.DesktopIntroScreen');

goog.require('al.view.AbstractView');

al.view.DesktopIntroScreen = function() {
  al.view.AbstractView.call(this);
  goog.events.listenOnce(this, this.PAGE_LOADED, this.pageLoadedHandler, false, this);
  this.loadPage('desktop-initial.html');
}

goog.inherits(al.view.DesktopIntroScreen, al.view.AbstractView);



al.view.DesktopIntroScreen.prototype.pageLoadedHandler = function(event) {
  var date = new Date(),
      code = this.getRandomChar() + date.getMilliseconds() + this.getRandomChar(2);
  this.domElement = goog.dom.getElementByClass('pageContent', this.document);
  goog.dom.getElementByClass('url', this.domElement).innerText = goog.dom.getDocument().URL;
  goog.dom.append(goog.dom.getDocument().body, this.domElement);
  goog.dom.getElementByClass('smartphone-code', this.domElement).innerHTML = code;

  this.dispatchEvent({type: this.REQUEST_SOCKET_CONNECTION, code: code});
}

al.view.DesktopIntroScreen.prototype.getRandomChar = function(charCount) {
  var possibleChar = 'abcdefghijklmnopqrstuvwxyz',
      charCount = charCount || 1,
      chars = '',
      char,
      i = 0;

  for(i=0; i<charCount; i++) {
    char = possibleChar.charAt(Math.floor(Math.random() * possibleChar.length));
//    char = Math.random() > 0.5 ? char.toUpperCase() : char;
    chars += char;
  }

  return chars;
}


