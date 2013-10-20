goog.provide('al.view.DesktopMainScreen');


al.view.DesktopMainScreen = function() {
  al.view.AbstractView.call(this);
  this.vsm = new goog.dom.ViewportSizeMonitor();
  this.spareBalls = [];
  this.activeBalls = [];
  goog.events.listenOnce(this, this.PAGE_LOADED, this.pageLoadedHandler, false, this);
  this.loadPage('desktop-main.html');
}

goog.inherits(al.view.DesktopMainScreen, al.view.AbstractView);

al.view.DesktopMainScreen.prototype.pageLoadedHandler = function(event) {
  this.domElement = goog.dom.getElementByClass('pageContent', this.document);
  goog.dom.append(goog.dom.getDocument().body, this.domElement);

  this.initThree();
}

al.view.DesktopMainScreen.prototype.initThree = function() {
  this.renderer = new THREE.WebGLRenderer({precision: 'highp', antialias: true, preserveDrawingBuffer: true});
  console.log(this.vsm);
  this.renderer.setSize(this.vsm.getSize().width, this.vsm.getSize().height);
  goog.dom.insertChildAt(goog.dom.getDocument().body, this.renderer.domElement, 0);
  goog.style.setStyle(this.renderer.domElement, {
    'position': 'absolute',
    'left': 0,
    'top': 0
  });

  this.lightContainer = new THREE.Object3D();
  this.lightContainer.add(new THREE.AmbientLight(0x404040));
  var pointLight = new THREE.PointLight(0xDDDDDD, 1, 20000);
  pointLight.position.set(100, -300, 80);
  pointLight.lookAt(new THREE.Vector3());
  this.lightContainer.add(pointLight);

  this.camera = new THREE.PerspectiveCamera( 45, this.vsm.getSize().width / this.vsm.getSize().height, 1, 25000 );
  this.camera.position.x = 0;
  this.camera.position.y = 0;
  this.camera.position.z = 80;

  this.scene = new THREE.Scene(this.camera);
  this.scene.add(this.lightContainer);

  this.startRenderLoop();
}

al.view.DesktopMainScreen.prototype.addBall = function(params) {
  console.log('add ball');
  console.log(params);
  var ball, sphere;
  if(this.spareBalls.length > 0) {
    ball = this.spareBalls.splice(0, 1)[0];
    console.log("SPARE BALL");
  } else {
    sphere = new THREE.Mesh(new THREE.SphereGeometry(300, 300, 80), new THREE.MeshPhongMaterial({color: 0xFF0000}));
    ball = new al.view.BouncingBall(sphere);
    goog.events.listen(ball, ball.RECYCLE_BALL, this.recycleBallHandler, false, this);
  }
  ball.init(params);
  this.activeBalls.push(ball);
  this.scene.add(ball.ball);

}

al.view.DesktopMainScreen.prototype.startRenderLoop = function() {
  window.requestAnimationFrame( goog.bind(this.render, this) );
}

al.view.DesktopMainScreen.prototype.render = function() {

  window.requestAnimationFrame( goog.bind(this.render, this) );
  this.renderer.render(this.scene, this.camera);

  goog.array.forEach(this.activeBalls, function(ball) {
    ball.update();
  }, this);
}

al.view.DesktopMainScreen.prototype.recycleBallHandler = function(event) {
  var index = goog.array.findIndex(this.activeBalls, function(ball) {
    return(ball === event.target);
  }, this);
  this.spareBalls.push(this.activeBalls.splice(index, 1)[0]);
}