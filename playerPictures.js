/**
 * Created with JetBrains WebStorm.
 * User: chip
 * Date: 12.07.12
 * Time: 12:44
 * To change this template use File | Settings | File Templates.
 */

//var index = 10;

/*function setPictureIndex(i)
{
   index = i;
}*/


function drawPicture(index)
{
    var canvas, context, image, width, height, xpos = 0, ypos = 0, numFrames = 60, frameSize = 30;
    image = new Image();
    image.src = "./spritesheet.png";
    image.onload = function() {
        width = image.width;
        height = image.height;
        canvas = document.getElementById("canvas");
        var i = index;
        while(i > 0){
            xpos = xpos + frameSize;
            i = i - 1;
        }
        if(index >= numFrames) {
            xpos = 0;
            ypos = 0;
            index = 0;
        }
        else if(xpos + frameSize > width) {
            xpos = 0;
            ypos += frameSize;
        }
        context = canvas.getContext("2d");
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(image, xpos, ypos, frameSize, frameSize, 0, 0, frameSize, frameSize);

    }
}

setInterval(drawPicture(1),1000);