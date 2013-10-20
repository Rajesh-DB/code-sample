goog.provide('al.view.MobileInteractiveScreen');

goog.require('goog.dom.ViewportSizeMonitor');
goog.require('goog.style');
goog.require('goog.math.Vec2');

al.view.MobileInteractiveScreen = function() {
  al.view.AbstractView.call(this);
  this.title = null;
  this.vsm = new goog.dom.ViewportSizeMonitor();
  this.sizeInterval = null;
  this.scale = 0;
  this.colourR = 0;
  this.colourG = 0;
  this.colourB = 0;
  this.swipeStartTime = 0;
  this.swipeStartPoint = null;
  this.swipeEndPoint = null;

  goog.events.listenOnce(this, this.PAGE_LOADED, this.pageLoadedHandler, false, this);
  this.loadPage('mobile-interactive.html');
}

goog.inherits(al.view.MobileInteractiveScreen, al.view.AbstractView);

al.view.MobileInteractiveScreen.prototype.pageLoadedHandler = function(event) {
  this.domElement = goog.dom.getElementByClass('pageContent', this.document);
  goog.dom.append(goog.dom.getDocument().body, this.domElement);
  this.title = goog.dom.getElementByClass('interactive-title', this.domElement);

  this.initInteractive();
}

al.view.MobileInteractiveScreen.prototype.initInteractive = function() {
  var circle = this.getCircle(),
      screenSize = this.vsm.getSize(),
      size,
      top,
      left;
  this.title.innerText = 'Hold your finger down anywhere on the screen to create a ball';
  this.scale = 0;
  goog.dom.append(this.domElement, circle);
  console.log(screenSize);
  size = screenSize.width > screenSize.height ? screenSize.height : screenSize.width;
  top = screenSize.width > screenSize.height ? 0 : (screenSize.height * .5) - (size * .5);
  left = screenSize.width > screenSize.height ? (screenSize.width * .5) - (size * .5) : 0;
  size += 'px';
  top += 'px';
  left += 'px';
  this.colour = this.getRandomColour();
  goog.style.setStyle(circle, {
    'background-color': this.colour,
    width: size,
    height: size,
    top: top,
    left: left,
    '-webkit-transform': 'scale(0, 0)',
    '-moz-transform': 'scale(0, 0)',
    '-o-transform': 'scale(0, 0)',
    'transform': 'scale(0, 0)'
  });
  goog.events.listen(goog.dom.getDocument(), goog.events.EventType.TOUCHSTART, this.sizeTouchStartHandler, false, this);
  goog.events.listen(goog.dom.getDocument(), goog.events.EventType.TOUCHMOVE, this.sizeTouchMoveHandler, false, this);
  goog.events.listen(goog.dom.getDocument(), goog.events.EventType.TOUCHEND, this.sizeTouchEndHandler, false, this);
}

al.view.MobileInteractiveScreen.prototype.getCircle = function() {
  return goog.dom.getElementsByClass('circle', this.domElement).length > 0 ? goog.dom.getElementByClass('circle', this.domElement) : goog.dom.htmlToDocumentFragment('<div class="circle"></div>');
}

al.view.MobileInteractiveScreen.prototype.getRandomColour = function() {
  this.colourR = Math.round(Math.random() * 255);
  this.colourG = Math.round(Math.random() * 255);
  this.colourB = Math.round(Math.random() * 255);
  console.log('rgb(' + this.colourR + ', ' + this.colourG + ', ' + this.colourB + ')');
  return 'rgb(' + this.colourR + ', ' + this.colourG + ', ' + this.colourB + ')';
}

al.view.MobileInteractiveScreen.prototype.sizeTouchStartHandler = function(event) {
  var that = this,
      circle = this.getCircle(),
      scaleStep = .02;
  event.event_.preventDefault();
  this.sizeInterval = setInterval(function() {
    that.scale += scaleStep;
    if(that.scale >= 1 || that.scale <= 0) {
      scaleStep *= -1;
    }
    goog.style.setStyle(circle, {
      '-webkit-transform': 'scale('+ that.scale +', '+ that.scale +')',
      '-moz-transform': 'scale('+ that.scale +', '+ that.scale +')',
      '-o-transform': 'scale('+ that.scale +', '+ that.scale +')',
      'transform': 'scale('+ that.scale +', '+ that.scale +')'
    });
  }, 1000/60);
}

al.view.MobileInteractiveScreen.prototype.sizeTouchMoveHandler = function(event) {
  event.event_.preventDefault();
}

al.view.MobileInteractiveScreen.prototype.sizeTouchEndHandler = function(event) {
  clearInterval(this.sizeInterval);
  event.event_.preventDefault();
  //TODO: update screen messaging

  goog.events.unlisten(goog.dom.getDocument(), goog.events.EventType.TOUCHSTART, this.sizeTouchStartHandler, false, this);
  goog.events.unlisten(goog.dom.getDocument(), goog.events.EventType.TOUCHEND, this.sizeTouchMoveHandler, false, this);
  goog.events.unlisten(goog.dom.getDocument(), goog.events.EventType.TOUCHEND, this.sizeTouchEndHandler, false, this);

  this.title.innerText = 'Now flick it at the screen';

  goog.events.listen(goog.dom.getDocument(), goog.events.EventType.TOUCHSTART, this.swipeTouchStartHandler, false, this);
  goog.events.listen(goog.dom.getDocument(), goog.events.EventType.TOUCHMOVE, this.swipeTouchMoveHandler, false, this);
  goog.events.listen(goog.dom.getDocument(), goog.events.EventType.TOUCHEND, this.swipeTouchEndHandler, false, this);
}

al.view.MobileInteractiveScreen.prototype.swipeTouchStartHandler = function(closureEvent) {
  //dirty closure thing of wrapping touchevent in BrowserEvent means need to get the original event
  var event = closureEvent.event_,
      touches = event.changedTouches;
  event.preventDefault();
  this.swipeStartTime = Date.now();
  this.swipeStartPoint = new goog.math.Vec2(touches[0].pageX, touches[0].pageY);
  this.swipeEndPoint = this.swipeEndPoint || new goog.math.Vec2();
  this.swipeEndPoint.x = touches[0].pageX;
  this.swipeEndPoint.y = touches[0].pageY;
}

al.view.MobileInteractiveScreen.prototype.swipeTouchMoveHandler = function(closureEvent) {
//  alert('touchmove');
  var event = closureEvent.event_,
      touches = event.changedTouches;
  event.preventDefault();
//  alert('x: ' + touches[0].pageX + ', y: ' + touches[0].pageY);
  this.swipeEndPoint = this.swipeEndPoint || new goog.math.Vec2();
  this.swipeEndPoint.x = touches[0].pageX;
  this.swipeEndPoint.y = touches[0].pageY;
  var difference = {x: this.swipeEndPoint.x - this.swipeStartPoint.x, y: this.swipeEndPoint.y - this.swipeStartPoint.y},
      circle = this.getCircle();

  goog.style.setStyle(circle, {
    '-webkit-transform': 'translate3d(' + difference.x + 'px, ' + difference.y + 'px, ' + 0 + ') scale(' + this.scale + ', ' + this.scale + ')'
  });
}

al.view.MobileInteractiveScreen.prototype.swipeTouchEndHandler = function(closureEvent) {
  var that = this,
      event = closureEvent.event_,
      touches = event.changedTouches,
      swipeDuration = Date.now() - this.swipeStartTime,
      distance,
      direction,
      x, y,
      circle = this.getCircle(),
      animateInterval,
      colour = this.colour,
      scale = this.scale,
      speed = 0,
      r = this.colourR/255,
      g = this.colourG/255,
      b = this.colourB/255;
  event.preventDefault();

  goog.events.unlisten(goog.dom.getDocument(), goog.events.EventType.TOUCHSTART, this.swipeTouchStartHandler, false, this);
  goog.events.unlisten(goog.dom.getDocument(), goog.events.EventType.TOUCHMOVE, this.swipeTouchMoveHandler, false, this);
  goog.events.unlisten(goog.dom.getDocument(), goog.events.EventType.TOUCHEND, this.swipeTouchEndHandler, false, this);

  direction = new goog.math.Vec2(this.swipeEndPoint.x - this.swipeStartPoint.x, this.swipeEndPoint.y - this.swipeStartPoint.y);
//  direction.y *= -1;
  direction = direction.normalize();
  distance = goog.math.Vec2.distance(this.swipeEndPoint, this.swipeStartPoint);
  speed = distance / swipeDuration;
  speed *= 10;
  speed = speed < 1 ? 1 : speed;
  direction.x *= speed;
  direction.y *= speed;
//  alert('x: ' + direction.x + ', y: ' + direction.y);
  x = this.swipeEndPoint.x - this.swipeStartPoint.x;
  y = this.swipeEndPoint.y - this.swipeStartPoint.y;
  animateInterval = setInterval(function() {
    x += direction.x;
    y += direction.y;
    goog.style.setStyle(circle, {
      '-webkit-transform': 'translate3d(' + x + 'px, ' + y + 'px, ' + 0 + ') scale(' + that.scale + ', ' + that.scale + ')'
    });
    if(that.isCircleOffscreen(x, y)) {
      clearInterval(animateInterval);
      that.initInteractive();
      that.dispatchEvent({type: that.SEND_SOCKET_MESSAGE, messageType: 'client-send-ball', params: {
        speed: speed,
        direction: direction.normalize(),
        colour: {r: r, g: g, b: b},
        scale: scale
      }})
    }
  }, 1000/60)
}

al.view.MobileInteractiveScreen.prototype.isCircleOffscreen = function(x, y) {
  var circleRadius = (parseFloat(goog.style.getStyle(this.getCircle(), 'width')) * this.scale) * .5,
      x = x + (this.vsm.getSize().width * .5),
      y = y + (this.vsm.getSize().height * .5);
  return (x + circleRadius < 0 || x - circleRadius > this.vsm.getSize().width || y + circleRadius < 0 || y - circleRadius > this.vsm.getSize().height);
}