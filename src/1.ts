// var time = 5;
// document.body.innerText = time.toString();
// setInterval(function () {
//     time--;
//     if (time > 0)
//         document.body.innerText = time.toString();
//     else
//         document.body.innerText = "K.O."
// }, 1000);


/**
 * Main-Loop
 */
var canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
var context = canvas.getContext("2d");
var y = 0;
var x = 0;
var image = new Image();
image.src = './assets/logo_640.jpg';

function enterFrame() {
    if (!context)
        return;
    y++;
    canvas.width = 400;
    canvas.height = 600;
    context.drawImage(image, 0, 0);
    context.rect(x, y, 100, 100);
    context.fillStyle = 'red';
    context.fill();
    context.fillStyle = 'black';
    context.fillText("hello houyi", 0, 100);

    requestAnimationFrame(enterFrame);
}

window.onclick = function () {
    x = getMousePosX(event);
    y = getMousePosY(event);
}

function getMousePosX(event: any) {
    var e = event || window.event;
    return e.clientX;
}
function getMousePosY(event: any) {
    var e = event || window.event;
    return e.clientY;
}

requestAnimationFrame(enterFrame);