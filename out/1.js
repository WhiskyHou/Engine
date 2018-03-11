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
var enemy_f22 = new Image();
enemy_f22.src = './assets/enemy_80.png';
var enemy_warship = new Image();
enemy_warship.src = './assets/enemy_160_300.png';
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
    setInterval(makeEnemyTest, 500);
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
function makeEnemyTest() {
    var temp = new EnemyF22();
}
function makeEnemy() {
    if (!enemyLoad)
        return;
    enemyLoad = false;
    enemy_x = getRandomPosX();
    enemy_y = -30;
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
window.onclick = text;
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
    // bullet.fire();
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
 *            **修正** 通过 requestAnimationFrame(() => this.fire()) 调用就可以！！！
 */
var PlayerBullet = /** @class */ (function () {
    function PlayerBullet(px, py) {
        var _this = this;
        this.x = px + 28;
        this.y = py + 10;
        requestAnimationFrame(function () { return _this.fire(); });
    }
    PlayerBullet.prototype.fire = function () {
        var _this = this;
        if (!context)
            return;
        this.y -= 15;
        // console.log(this.y);
        // console.log(this.x);
        context.rect(this.x, this.y, 4, 20);
        context.fillStyle = 'red';
        context.fill();
        if (this.y < -20)
            return;
        requestAnimationFrame(function () { return _this.fire(); });
    };
    return PlayerBullet;
}());
/**
 * 敌人飞机 普通
 *
 */
var Enemy = /** @class */ (function () {
    function Enemy() {
        var _this = this;
        this.img = enemy;
        this.x = this.getRandomPos();
        this.y = -60;
        this.hp = 2;
        requestAnimationFrame(function () { return _this.make(); });
    }
    Enemy.prototype.getRandomPos = function () {
        var x = Math.floor(Math.random() * 341);
        return x;
    };
    Enemy.prototype.make = function () {
        var _this = this;
        if (!context)
            return;
        this.y += 5;
        context.drawImage(this.img, this.x, this.y);
        requestAnimationFrame(function () { return _this.make(); });
    };
    return Enemy;
}());
/**
 * 敌人飞机 F22
 *
 */
var EnemyF22 = /** @class */ (function () {
    function EnemyF22() {
        var _this = this;
        this.img = enemy_f22;
        this.x = this.getRandomPos();
        this.y = -80;
        this.hp = 4;
        requestAnimationFrame(function () { return _this.make(); });
    }
    EnemyF22.prototype.getRandomPos = function () {
        var x = Math.floor(Math.random() * 321);
        return x;
    };
    EnemyF22.prototype.make = function () {
        var _this = this;
        if (!context)
            return;
        this.y += 8;
        context.drawImage(this.img, this.x, this.y);
        requestAnimationFrame(function () { return _this.make(); });
    };
    return EnemyF22;
}());
/**
 * 敌人飞机 歼星舰
 *
 */
var EnemyWarship = /** @class */ (function () {
    function EnemyWarship() {
        var _this = this;
        this.img = enemy_warship;
        this.x = this.getRandomPos();
        this.y = -300;
        this.hp = 30;
        requestAnimationFrame(function () { return _this.make(); });
    }
    EnemyWarship.prototype.getRandomPos = function () {
        var x = Math.floor(Math.random() * 241);
        return x;
    };
    EnemyWarship.prototype.make = function () {
        var _this = this;
        if (!context)
            return;
        this.y += 2;
        context.drawImage(this.img, this.x, this.y);
        requestAnimationFrame(function () { return _this.make(); });
    };
    return EnemyWarship;
}());
