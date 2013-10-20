goog.provide('al.view.BouncingBall');


al.view.BouncingBall = function(ball) {
  goog.events.EventTarget.call(this);
  this.RECYCLE_BALL = 'recycleBall';
  this.ball = ball;
  this.gravity = 2;
  this.colour = new THREE.Color();
  this.scaleVector = new THREE.Vector3();
}

goog.inherits(al.view.BouncingBall, goog.events.EventTarget);

al.view.BouncingBall.prototype.init = function(params) {
  this.params = params;
  console.log(this.params);
  this.ball.position.x = 0;
  this.ball.position.y = 0;
  this.ball.position.z = 0;
  this.params.direction.y *= params.speed;
  this.params.direction.x *= params.speed;
  this.colour.setRGB(this.params.colour.r, this.params.colour.g, this.params.colour.b);
  this.ball.material.color = this.colour;
  this.ball.material.ambient = this.colour;
  this.currentY = this.params.direction.y;
  this.scaleVector.x = this.params.scale;
  this.scaleVector.y = this.params.scale;
  this.scaleVector.z = this.params.scale;
  this.ball.scale = this.scaleVector;
}

al.view.BouncingBall.prototype.update = function() {
  this.currentY -= this.gravity;
  this.ball.position.z -= this.params.speed;
  this.ball.position.y += this.currentY;
  this.ball.position.x += this.params.direction.x;
  if( this.ball.position.y < -600 + (150 * this.params.scale) ) {
    this.ball.position.y = -600 + (150 * this.params.scale);
    this.currentY = this.currentY * -0.95;
  }
  if(this.ball.position.z < -25000) {
    this.dispatchEvent({type: this.RECYCLE_BALL});
  }
}