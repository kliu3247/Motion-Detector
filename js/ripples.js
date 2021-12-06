class Ripples{
    constructor(){
        var cnv = createCanvas(windowWidth, windowHeight);
        cnv.style('display', 'block');
        water = color(136,221,221);
        background(water);
            x = windowWidth/2;
            y = windowHeight/2;
        var radius = 2;
        var x;
        var y;
        var water;
        var waterLight;
        var waterShadow; 
            
    }

    draw() {
    water = color(136,221,221,50);
    background(water);
    frameRate(15);
    noFill();
    strokeWeight((windowWidth/100)+(random(3,2+(mouseY-mouseX)/20)));
    radius+=10;
    if (radius < windowWidth)  {
    waterLight = color(195,238,238, (windowWidth/1.5-radius));
        waterShadow = color(106,213,213, (windowWidth/3-radius));
        
    stroke(waterShadow);
    ellipse(x, y, radius-20, radius-20);
    ellipse(x, y, radius+20, radius+20);
    
    radius += (random(((mouseX)/6), ((windowWidth-mouseX)/6)));
    stroke(waterLight);
    ellipse(x, y, radius, radius);
    }
    
    
    }

    windowResized() {
    var cnv = createCanvas(windowWidth, windowHeight);
    cnv.style('display', 'block');
    water = color(136,221,221);
    background(water);
    radius = 5;
        x = mouseX;
        y = mouseY;
    draw();
    }

    mousePressed() {
    water = color(136,221,221,70);
    background(water);
    radius = 5;
    x = mouseX;
        y = mouseY;
    draw();
    }

    function mouseDragged() {
    water = color(136,221,221,80);
    background(water);
    radius = 2;
    x = mouseX;
        y = mouseY;
    draw();
    }
}