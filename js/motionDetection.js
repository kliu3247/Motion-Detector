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
        target[4*i+3] = 0xFF;
        ++i;
    }
}

function checkAreas() {
    // loop over the drum areas
    for (var side in sides) {
        var thisSide = sides[side];
        if(thisSide.x>0 || thisSide.y>0){
          var blendedData = contextBlended.getImageData(thisSide.x, thisSide.y, thisSide.width, thisSide.height);
          var i = 0;
          var average = 0;
          // loop over the pixels
          while (i < (blendedData.data.length * 0.25)) {
              // make an average between the color channel
              average += (blendedData.data[i*4] + blendedData.data[i*4+1] + blendedData.data[i*4+2]) / 3;
              ++i;
          }
          // calculate an average between of the color values of the drum area
          average = Math.round(average / (blendedData.data.length * 0.25));
          if (average > 20) {
              // over a small limit, consider that a movement is detected
              // play a note and show a visual feedback to the user
              console.log(thisSide);
              playPendulum(); 
              fill([0,200,0])
              ellipse(200,20,200)     
          }
        }
    }
}



function startMotionDetection() {   
    // setAllDrumReadyStatus(false);
    update();
    // setTimeout(setAllDrumReadyStatus, 1000, true);
}