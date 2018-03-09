"use strict";
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
var canvas = document.getElementById("gameCanvas");
var context = canvas.getContext("2d");
var y = 0;
var x = 0;
var image = new Image();
image.src = './assets/logo_640.jpg';
function enterFrame() {
    if (!context)
        return;
    y++;
    // x = getMousePosX(event);
    // y = getMousePosY(event);
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
// setInterval(function () {
//     x = getMousePosX(event);
//     y = getMousePosY(event);
// }, 10);
window.onmousemove = function () {
    var e = this.event || this.window.event;
    // x = getMousePosX(e)
    var mousePos = mousePosition(e);
    x = mousePos.x;
    y = mousePos.y;
};
window.onclick = function () {
    x = getMousePosX(event);
    y = getMousePosY(event);
};
function mousePosition(ev) {
    if (ev.pageX || ev.pageY) {
        return { x: ev.pageX, y: ev.pageY };
    }
    return {
        x: ev.clientX + document.body.scrollLeft - document.body.clientLeft,
        y: ev.clientY + document.body.scrollTop - document.body.clientTop
    };
}
function getMousePosX(event) {
    var e = event || window.event;
    return e.clientX;
}
function getMousePosY(event) {
    var e = event || window.event;
    return e.clientY;
}
requestAnimationFrame(enterFrame);
