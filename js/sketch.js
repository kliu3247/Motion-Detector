const webcamElement = document.getElementById('webcam');
// const webcam = new Webcam(webcamElement, 'user')
const snapSoundElement = document.getElementById('snapSound');
let canv
let webcam
let timeOut, lastImageData
let sides = {};
let pendulums = []
let canvasSource = $("#canvas-source")[0];
let canvasBlended = $("#canvas-blended")[0];
let contextSource = canvasSource.getContext('2d')
let contextBlended = canvasBlended.getContext('2d');

$('.detecting-half').on('load', function () {
  var viewWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
  var viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
  var ratioWidth = canvasBlended.width/viewWidth;
  var ratioHeight = canvasBlended.height/viewHeight;
  sides[this.attributes['vd-id'].value] = {
      id: this.attributes['vd-id'].value,
      name: this.attributes['name'].value,
      width: this.width * ratioWidth,
      height: this.height * ratioHeight,
      x: this.x * ratioWidth,
      y: this.y * ratioHeight
  }
}).each(function() {
   if (this.complete) $(this).trigger('load');
});

function setup(){
    canv = createCanvas(1200, 900)
  
  webcam = new Webcam(webcamElement, 'user', canv.elt, snapSoundElement);
  leftSide = sides[0];
  width = leftSide.width;
  height = leftSide.height;
  let i = 0;
  for(let w = 50; w < width; w+= 50){
    for(let h = 50; h < height; h += 50){
      pendulums[i] = new Pendulum(createVector(w,h),30);
      i++;
    }
  }
}

function draw(){
    drawVideo();
    blending();
    checkAreas();
    background(0,0,0)
    //fill([0,0,200])
    //ellipse(200,200,200)
    playPendulum();

}


window.requestAnimFrame = (function(){"d-none"
    return  window.requestAnimationFrame       ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        window.oRequestAnimationFrame      ||
        window.msRequestAnimationFrame     ||
        function( callback ){
            window.setTimeout(callback, 1000 / 60);
        };
})();


$("#webcam-switch").change(function () {
    if(this.checked){
        $('.md-modal').addClass('md-show');
        webcam.start()
            .then(result =>{
              cameraStarted();
            //   loadSounds();
              startMotionDetection();
            })
            .catch(err => {
                displayError(err);
            });
    }
    else {        
        $("#errorMsg").addClass("d-none");
        webcam.stop();
        cameraStopped();
        setAllDrumReadyStatus(false);
    }        
  });

  function cameraStarted(){
    $("#errorMsg").addClass("d-none");
    $("#webcam-caption").html("on");
    $("#webcam-control").removeClass("webcam-off");
    $("#webcam-control").addClass("webcam-on");
    $(".webcam-container").removeClass("d-none");
    $(canvasBlended).delay(600).fadeIn(); 
    $(".motion-cam").delay(600).fadeIn();
    $("#wpfront-scroll-top-container").addClass("d-none");
  }
  
  function cameraStopped(){
    $("#errorMsg").addClass("d-none");
    $("#webcam-control").removeClass("webcam-on");
    $("#webcam-control").addClass("webcam-off");
    $(".webcam-container").addClass("d-none");
    $("#webcam-caption").html("Click to Start Webcam");
    $('.md-modal').removeClass('md-show');
  }


  const displayError = (e) => {
    console.log(e)
}



function update() {

  requestAnimFrame(update);
}


function drawVideo() {
  contextSource.drawImage(webcamElement, 0, 0, webcamElement.width, webcamElement.height);
}

function blending() {
  var width = canvasSource.width;
  var height = canvasSource.height;
  // get webcam image data
  // console.log(contextSource)
  var sourceData = contextSource.getImageData(0, 0, width, height);
  // create an image if the previous image doesn’t exist
  if (!lastImageData) lastImageData = contextSource.getImageData(0, 0, width, height);
  // create a ImageData instance to receive the blended result
  var blendedData = contextSource.createImageData(width, height);
  // blend the 2 images
  differenceAccuracy(blendedData.data, sourceData.data, lastImageData.data);
  // draw the result in a canvas
  contextBlended.putImageData(blendedData, 0, 0);
  // store the current webcam image
  lastImageData = sourceData;
}

function fastAbs(value) {
  //equal Math.abs
  return (value ^ (value >> 31)) - (value >> 31);
}

function threshold(value) {
//Display jump to trigger?
  return (value > 0x25) ? 0xFF : 0;
}

function differenceAccuracy(target, data1, data2) {
  if (data1.length != data2.length) return null;
  var i = 0;
  while (i < (data1.length * 0.25)) {
      var average1 = (data1[4*i] + data1[4*i+1] + data1[4*i+2]) / 3;
      var average2 = (data2[4*i] + data2[4*i+1] + data2[4*i+2]) / 3;
      var diff = threshold(fastAbs(average1 - average2));
      target[4*i] = diff;
      target[4*i+1] = diff;
      target[4*i+2] = diff;
      target[4*i+3] = 0x44;
      ++i;
  }
}

// function checkAreas() {
//   // loop over the drum areas
//   for (var side in sides) {
//     //right side, pendulum
//       //right side
//       var thisSide = sides[side];
//       if(thisSide.x>0 || thisSide.y>0){
//         var blendedData = contextBlended.getImageData(thisSide.x, thisSide.y, thisSide.width, thisSide.height);
//           var i = 0;
//           var average = 0;
//           // loop over the pixels
//           while (i < (blendedData.data.length * 0.25)) {
//               // make an average between the color channel
//               average += (blendedData.data[i*4] + blendedData.data[i*4+1] + blendedData.data[i*4+2]) / 3;
//               ++i;
//           }
//           // calculate an average between of the color values of the drum area
//           average = Math.round(average / (blendedData.data.length * 0.25));
//           //console.log(average);
//           if (average > 20) {
//               // over a small limit, consider that a movement is detected
//               // play a note and show a visual feedback to the user
//               //console.log(drum.name + '-' + average)
//               console.log(average);
//           }
//         }
//       }
// }


function checkAreas() {
  // loop over the drum areas
  for (var side in sides) {
    //right side, pendulum
      //right side
      var thisSide = sides[side];
      if(thisSide.x>0 || thisSide.y>0){
        var blendedData = contextBlended.getImageData(thisSide.x, thisSide.y, thisSide.width, thisSide.height);
          var i = 0;
          var average = 0;
          var highestAverageSpot = 0;
          var currHighest = 0;
          
          // loop over the pixels
          while (i < (blendedData.data.length * 0.25)) {
              // make an average between the color channel
              var currSum = (blendedData.data[i*4] + blendedData.data[i*4+1] + blendedData.data[i*4+2]) / 3
              if (currSum > currHighest) {
                highestAverageSpot = i;
                currHighest = currSum;
              }
              average += currSum;
              ++i;
          }
          // calculate an average between of the color values of the drum area
          average = Math.round(average / (blendedData.data.length * 0.25));
          //console.log(average);
          if (average > 20) {
              // over a small limit, consider that a movement is detected
              // play a note and show a visual feedback to the user
              //console.log(drum.name + '-' + average)
              //console.log(average);
              //console.log(highestAverageSpot);
              var x = (highestAverageSpot / 4) % thisSide.width;
              var y = Math.floor((highestAverageSpot / 4) / thisSide.width);
              //console.log(x)
              console.log(y)
              //ellipse(56, 46, 55, 55);
              playPendulum(x,y);
          }
        }
      }
}


function playPendulum(x, y){
  //populate pendulums
  if (x == null || y == null){
    for (var p in pendulums){
      pendulums[p].render(false);
    }
  } else {
    x = Math.floor(x/50);
    y = Math.floor(y/2);

    totalBalls = 0;
    if (y == 0){
      totalBalls = x;
    } else {
      totalBalls = Math.floor(sides[0]/50) * (y-1) + x;
    }
    

    if (totalBalls < pendulums.length){
      console.log("will do")
      pendulums[totalBalls].render(true);
    }
    
  }
 
}




function startMotionDetection() {   
  // setAllDrumReadyStatus(false);
  update();
  // setTimeout(setAllDrumReadyStatus, 1000, true);
}
