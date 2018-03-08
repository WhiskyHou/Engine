// var time = 5;
// document.body.innerText = time.toString();
// setInterval(function () {
//     time--;
//     if (time > 0)
//         document.body.innerText = time.toString();
//     else
//         document.body.innerText = "K.O."
// }, 1000);

var canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
var context = canvas.getContext("2d");

/**
 * Main-Loop
 */
var y = 0;
var image = new Image();
image.src = 'logo_640.jpg';

function enterFrame() {
    if (!context)
        return;
    y++;
    canvas.width = 400;
    canvas.height = 600;
    context.drawImage(image, 0, 0);
    context.rect(0, y, 100, 100);
    context.fillStyle = 'red';
    context.fill();
    context.fillStyle = 'black';
    context.fillText("hello houyi", 0, 100);

    requestAnimationFrame(enterFrame);
}

var image = new Image();
image.src = 'logo_640.jpg';

requestAnimationFrame(enterFrame);