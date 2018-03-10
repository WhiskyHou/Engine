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
 * canvas初始化
 * 资源载入
 */
var canvas = document.getElementById("gameCanvas");
var context = canvas.getContext("2d");
var player = new Image();
player.src = './assets/player_60.png';
var bg = new Image();
bg.src = './assets/bg_400_600.jpg';
var enemy = new Image();
enemy.src = './assets/enemy_60.png';
/**
 * 窗口启动
 *
 * 开启主画面循环加载
 * 开启敌人自动生成
 */
window.onload = function () {
    if (!context)
        return;
    requestAnimationFrame(enterFrame);
    // requestAnimationFrame(makeEnemy);
    setInterval(makeEnemy, 1000);
};
/**
 * 主画面加载
 */
function enterFrame() {
    if (!context)
        return;
    canvas.width = 400;
    canvas.height = 600;
    context.drawImage(bg, 0, 0);
    context.drawImage(player, player_x, player_y);
    requestAnimationFrame(enterFrame);
}
// requestAnimationFrame(enterFrame);
/**
 * 随机刷新敌人
 *
 * 存在问题 —— 同开火一样，无法同时存在多个对象，只能等当前对象销毁之后才能开始下一对象
 */
var enemy_x = getRandomPosX();
var enemy_y = 0;
var enemyLoad = true;
function getRandomPosX() {
    var x = Math.floor(Math.random() * 341);
    return x;
}
function makeEnemy() {
    if (!enemyLoad)
        return;
    enemyLoad = false;
    enemy_x = getRandomPosX();
    enemy_y = 30;
    requestAnimationFrame(updateEnemy);
}
function updateEnemy() {
    // console.log('update');
    if (!context)
        return;
    enemy_y += 5;
    // clean();
    context.drawImage(enemy, enemy_x, enemy_y);
    if (enemy_y > 600) {
        enemyLoad = true;
        return;
    }
    if (fireX >= enemy_x && fireX <= (enemy_x + 56) && fireY < (enemy_y + 60) && fireY > enemy_y) {
        enemyLoad = true;
        return;
    }
    requestAnimationFrame(updateEnemy);
}
/**
 * 鼠标移动、点击事件
 */
window.onmousemove = setPlayerPosAsMousePos;
window.onclick = fireNormal;
/**
 * 鼠标移动事件 —— 玩家移动飞机
 */
var player_x = 0;
var player_y = 0;
function setPlayerPosAsMousePos(event) {
    var event = event || window.event;
    var mousePos = mousePosition(event);
    var x = mousePos.x - 30;
    var y = mousePos.y - 30;
    if (x >= 0 && x <= 340)
        player_x = x;
    if (y >= 0 && y <= 540)
        player_y = y;
}
function mousePosition(ev) {
    return { x: ev.clientX, y: ev.clientY };
}
/**
 * 鼠标点击事件 —— 玩家开火
 *
 * 存在问题 —— 只能一发一发打，上一发子弹如果未消失再次开火，上一发直接消失并且下一发的飞行速度会将上一发叠加
 *            **暂时修正**  设置判断量，如果当前子弹未销毁，不能开火
 */
var list = new Array();
function text(ev) {
    var bullet = new PlayerBullet(player_x, player_y);
    bullet.fire();
    // list.push(bullet);
    // fireNormal();
}
var fireX;
var fireY;
var fireLoad = true;
function fireNormal() {
    if (!fireLoad)
        return;
    fireLoad = false;
    fireX = player_x + 28;
    fireY = player_y + 10;
    requestAnimationFrame(fireNormalFrame);
}
function fireNormalFrame() {
    if (!context)
        return;
    fireY -= 20;
    context.rect(fireX, fireY, 4, 20);
    context.fillStyle = 'red';
    context.fill();
    if (fireY < -20) {
        fireLoad = true;
        return;
    }
    requestAnimationFrame(fireNormalFrame);
}
/**
 * 玩家子弹 类
 *
 * 测试失败 —— 通过 requestAnimationFrame() 访问的成员函数 无法调用对象属性值
 */
var PlayerBullet = /** @class */ (function () {
    function PlayerBullet(px, py) {
        this.x = px + 28;
        this.y = py + 10;
        // requestAnimationFrame(this.fireUpdate);
    }
    PlayerBullet.prototype.fire = function () {
        requestAnimationFrame(this.fireUpdate);
    };
    PlayerBullet.prototype.fireUpdate = function () {
        if (!context)
            return;
        this.y -= 10;
        console.log(this.y);
        console.log(this.x);
        context.rect(this.x, this.y, 4, 20);
        context.fillStyle = 'red';
        context.fill();
        if (this.y < -20)
            return;
        requestAnimationFrame(this.fireUpdate);
    };
    return PlayerBullet;
}());
/**
 * 敌人飞机 类
 *
 * 尚未编写
 */
var Enemy = /** @class */ (function () {
    function Enemy() {
        this.x = 0;
        this.y = 0;
        this.hp = 5;
    }
    return Enemy;
}());
