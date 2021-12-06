class Pendulum{
    constructor(origin_, r_){
        this.origin = origin_.copy();
        this.position = createVector();
        this.r = r_;
        this.angle = PI/4;

        this.aVelocity = 0.0;
        this.aAcceleration = 0.0;
        this.damping = 0.995;   // Arbitrary damping
        this.ballr = 20.0;      // Arbitrary ball radius
    }

    render() {
        console.log("rendered")
        this.update();
        this.display();
    }    
    
     update() {
        var gravity = 0.9;                                               // Arbitrary constant
        this.aAcceleration = (-1 * gravity / this.r) * sin(this.angle);  // Calculate acceleration (see: http://www.myphysicslab.com/pendulum1.html)
        this.aVelocity += this.aAcceleration;                            // Increment velocity
        this.aVelocity *= this.damping;                                  // Arbitrary damping
        this.angle += this.aVelocity;                                    // Increment angle
        console.log("updated")
    }

    display() {
        this.position.set(this.r*sin(this.angle), this.r*cos(this.angle), 0);         // Polar to cartesian conversion
        this.position.add(this.origin);                                               // Make sure the position is relative to the pendulum's origin

        stroke(200);
        strokeWeight(2);
        // Draw the arm
        line(this.origin.x, this.origin.y, this.position.x, this.position.y);
        ellipseMode(CENTER);
        fill(130);
        // Draw the ball
        ellipse(this.position.x, this.position.y, this.ballr, this.ballr);
    }
}
