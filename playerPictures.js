/**
 * Created with JetBrains WebStorm.
 * User: chip
 * Date: 12.07.12
 * Time: 12:44
 * To change this template use File | Settings | File Templates.
 */



function drawPicture(index)
{
    var canvas, context, image, width, height, xpos = 0, ypos = 0, numFrames = 15, frameSize = 29;
    image = new Image();
    image.src = "./spritesheet.png";
    image.onload = function() {
        width = image.width;
        height = image.height;
        canvas = document.getElementById("canvas");
        ypos = (index-(index%numFrames))/numFrames*frameSize;
        xpos = (index%numFrames)*frameSize;
        context = canvas.getContext("2d");
        context.drawImage(image, xpos, ypos, frameSize, frameSize, 0, 0, frameSize, frameSize)
        /*context.clearRect(0, 0, canvas.width, canvas.height);*/

    }
}

drawPicture(1);