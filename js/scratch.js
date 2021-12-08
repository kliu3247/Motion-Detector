
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
          // loop over the pixels
          while (i < (blendedData.data.length * 0.25)) {
              // make an average between the color channel
              average += (blendedData.data[i*4] + blendedData.data[i*4+1] + blendedData.data[i*4+2]) / 3;
              ++i;
          }
          // calculate an average between of the color values of the drum area
          average = Math.round(average / (blendedData.data.length * 0.25));
          //console.log(average);
          if (average > 20) {
              // over a small limit, consider that a movement is detected
              // play a note and show a visual feedback to the user
              //console.log(drum.name + '-' + average)
              console.log(average);
          }
        }
      }
}