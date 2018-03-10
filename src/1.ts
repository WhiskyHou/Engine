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
var player_x = 0;
var player_y = 0;
var player = new Image();
player.src = './assets/player_60.png';
var bg = new Image();
bg.src = './assets/bg_400_600.jpg';
// var image = new Image();
// image.src = './assets/logo_640.jpg';

function enterFrame() {
    if (!context)
        return;
    // y++;
    // x = getMousePosX(event);
    // y = getMousePosY(event);
    canvas.width = 400;
    canvas.height = 600;
    // context.drawImage(image, 0, 0);
    // context.rect(x, y, 100, 100);
    // context.fillStyle = 'red';
    // context.fill();
    // context.fillStyle = 'black';
    // context.fillText("hello houyi", 0, 100);
    context.drawImage(bg, 0, 0);
    context.drawImage(player, player_x, player_y);

    requestAnimationFrame(enterFrame);
}

window.onmousemove = setPlayerPosAsMousePos;

window.onclick = text;

function setPlayerPosAsMousePos(event: any) {
    var event = event || window.event;
    var mousePos = mousePosition(event);
    var x = mousePos.x - 30;
    var y = mousePos.y - 30;
    if (x >= 0 && x <= 340)
        player_x = x;
    if (y >= 0 && y <= 540)
        player_y = y;
}

function mousePosition(ev: any) {
    return { x: ev.clientX, y: ev.clientY };
}

/**
 * 鼠标点击事件 —— 玩家开火 方法集
 * 
 * 存在问题 —— 只能一发一发打，上一发子弹如果未消失再次开火，上一发直接消失并且下一发的飞行速度会将上一发叠加
 */
// var list: PlayerBullet[];
function text(ev: any) {
    // var bullet = new PlayerBullet(player_x, player_y);
    // list.push(bullet);
    fireNormal(player_x, player_y);
}
var fireX: number;
var fireY: number;
function fireNormal(x: number, y: number) {
    fireX = x + 30;
    fireY = y;
    requestAnimationFrame(fireNormalFrame);
}
function fireNormalFrame() {
    if (!context)
        return;
    fireY -= 5;
    context.rect(fireX, fireY, 4, 20);
    context.fillStyle = 'red';
    context.fill();
    if (fireY < -20)
        return;
    requestAnimationFrame(fireNormalFrame);
}


/**
 * 玩家子弹 类
 * 
 * 测试失败 —— 通过 requestAnimationFrame() 访问的成员函数 无法调用对象属性值
 */
class PlayerBullet {
    x: number;
    y: number;
    constructor(px: number, py: number) {
        this.x = px + 28;
        this.y = py + 10;
    }
    // fire() {
    //     console.log(this.y);
    //     console.log(this.x);
    //     requestAnimationFrame(this.fireUpdate);
    // }
    // fireUpdate() {
    //     if (!context)
    //         return;
    //     // this.y -= 10;
    //     console.log(this.y);
    //     console.log(this.x);
    //     context.rect(this.x, this.y, 4, 20);
    //     context.fillStyle = 'red';
    //     context.fill();
    //     if (this.y < -20)
    //         return;
    //     requestAnimationFrame(this.fireUpdate);
    // }
}


/**
 * 敌人飞机 类
 * 
 * 尚未编写
 */
class Enemy {
    x: number;
    y: number;
    hp: number;
    constructor() {
        this.x = 0;
        this.y = 0;
        this.hp = 5;
    }
}

requestAnimationFrame(enterFrame);