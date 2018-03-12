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
var enemy_supply = new Image();
enemy_supply.src = './assets/enemy_100.png';
var supply = new Image();
supply.src = './assets/supply_100.png';
var bulletList = new Array();
var enemyList = new Array();
/**
 * 窗口启动
 *
 * 开启主画面循环加载
 * 开启敌人自动生成
 */
window.onload = function () {
    if (!context)
        return;
    // requestAnimationFrame(menuFrame);
    requestAnimationFrame(enterFrame);
    // requestAnimationFrame(makeEnemy);
    setInterval(makeEnemyTest, 1000);
    setInterval(makeEnemyF22, 5000);
    setInterval(makeEnemySupply, 10000);
    setInterval(makeEnemyWarship, 30000);
};
/**
 * 菜单界面
 *
 * 有bug，暂时不能用
 */
var menuShow = 0;
function menuFrame() {
    if (!context)
        return;
    canvas.width = 400;
    canvas.height = 600;
    context.drawImage(bg, 0, 0);
    menuShow = setInterval(makeEnemy, 2000);
    context.fillStyle = 'black';
    context.font = '40px Arial';
    context.fillText('飞机大战', 120, 120);
    if (menuShow === 1) {
        requestAnimationFrame(gameFrame);
        return;
    }
    requestAnimationFrame(menuFrame);
}
/**
 * 游戏界面
 *
 * 有bug，暂时不能用
 */
var swap = false;
function gameFrame() {
    if (!context)
        return;
    if (menuShow === 1) {
        canvas.width = 400;
        canvas.height = 600;
        context.drawImage(player, player_x, player_y);
        context.fillStyle = 'black';
        context.font = '24px Arial';
        if (fireMode)
            context.fillText('高爆弹药', 20, 580);
        else
            context.fillText('普通弹药', 20, 580);
        if (!swap) {
            setInterval(makeEnemyTest, 1000);
            setInterval(makeEnemyF22, 5000);
            setInterval(makeEnemySupply, 10000);
            setInterval(makeEnemyWarship, 30000);
            swap = true;
        }
        requestAnimationFrame(gameFrame);
    }
}
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
    context.fillStyle = 'black';
    context.font = '24px Arial';
    if (fireMode)
        context.fillText('高爆弹药', 20, 580);
    else
        context.fillText('普通弹药', 20, 580);
    context.fillText('HP:' + player_hp.toString(), 320, 580);
    // 重大bug！！！！！
    checkKnock();
    requestAnimationFrame(enterFrame);
}
/**
 * 敌机和子弹碰撞检测
 *
 * 重大bug！！！！！
 */
function checkKnock() {
    var num_bullet = bulletList.length;
    var num_enemy = enemyList.length;
    if (num_bullet === 0 || num_enemy === 0)
        return;
    // for (var i = 0; i < num_bullet; i++)
    //     if (!bulletList[i].alive)
    //         console.log(bulletList[i].alive);
    // for (var i = 0; i < num_bullet; i++) {
    //     if (!bulletList[i].alive) {
    //         // bulletList.splice(i, 1);
    //         // i--;
    //     }
    // }
    // for (var j = 0; j < num_enemy; j++) {
    //     if (!enemyList[j].alive) {
    //         enemyList.splice(j, 1);
    //         j--;
    //     }
    // }
    for (var i = 0; i < num_bullet; i++) {
        for (var j = 0; j < num_enemy; j++) {
            if (bulletList[i].x >= enemyList[j].x &&
                bulletList[i].x <= (enemyList[j].x + 56) &&
                bulletList[i].y <= (enemyList[j].y + 60)) {
                bulletList[i].alive = false;
                enemyList[j].hp -= 2;
            }
        }
    }
}
/**
 * 随机刷新敌人
 *
 * 存在问题 —— 同开火一样，无法同时存在多个对象，只能等当前对象销毁之后才能开始下一对象
 *            **修正**  问题同开火一样，已解决，这里大部分代码没用了
 */
var enemy_x = getRandomPosX();
var enemy_y = 0;
var enemyLoad = true;
function getRandomPosX() {
    var x = Math.floor(Math.random() * 341);
    return x;
}
function makeEnemyTest() {
    var temp = new Enemy();
    enemyList.push(temp);
    // enemyList.push(new Enemy());
}
function makeEnemyF22() {
    var temp = new EnemyF22();
}
function makeEnemySupply() {
    var temp = new EnemySupply();
}
function makeEnemyWarship() {
    var temp = new EnemyWarship();
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
 * 鼠标键盘移动、点击事件
 */
window.onmousemove = setPlayerPosAsMousePos;
window.onclick = text;
window.onkeydown = keyDown;
/**
 * 鼠标移动事件 —— 玩家移动飞机
 */
var player_x = 0;
var player_y = 0;
var player_hp = 2;
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
 *            **修正**  子弹类的问题解决，这里的方法就没用了
 */
var list = new Array();
var fireSwitch = false;
var temp = 0;
function text(ev) {
    fireSwitch = !fireSwitch;
    if (fireSwitch) {
        temp = setInterval(function () {
            if (fireMode) {
                var bullet = new BulletSpecial(player_x, player_y);
            }
            else {
                var bullet = new BulletNormal(player_x, player_y);
                bulletList.push(bullet);
                // bulletList.push(new BulletNormal(player_x, player_y));
            }
        }, 250);
    }
    else
        window.clearInterval(temp);
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
 * 键盘点击事件
 */
var fireMode = false;
function keyDown(ev) {
    var key = ev.keyCode ? ev.keyCode : ev.which;
    if (90 === key) {
        fireMode = !fireMode;
    }
    else if (89 === key) {
        menuShow = 1;
    }
}
/**
 * 玩家子弹 普通
 *
 * 测试失败 —— 通过 requestAnimationFrame() 访问的成员函数 无法调用对象属性值
 *            **修正** 通过 requestAnimationFrame(() => this.fire()) 调用就可以！！！
 */
var BulletNormal = /** @class */ (function () {
    function BulletNormal(px, py) {
        var _this = this;
        this.x = px + 28;
        this.y = py + 10;
        this.ap = 2;
        this.alive = true;
        requestAnimationFrame(function () { return _this.fire(); });
        // console.log("fuck");
    }
    BulletNormal.prototype.fire = function () {
        var _this = this;
        if (!context)
            return;
        this.y -= 15;
        context.rect(this.x, this.y, 4, 20);
        context.fillStyle = 'red';
        context.fill();
        if (this.y <= -20)
            this.alive = false;
        if (!this.alive)
            return;
        requestAnimationFrame(function () { return _this.fire(); });
    };
    return BulletNormal;
}());
/**
 * 玩家子弹 特殊
 *
 */
var BulletSpecial = /** @class */ (function () {
    function BulletSpecial(px, py) {
        var _this = this;
        this.x = px + 26;
        this.y = py + 10;
        this.ap = 4;
        this.alive = true;
        requestAnimationFrame(function () { return _this.fire(); });
    }
    BulletSpecial.prototype.fire = function () {
        var _this = this;
        if (!context)
            return;
        this.y -= 12;
        context.rect(this.x, this.y, 8, 16);
        context.fillStyle = 'yellow';
        context.fill();
        if (this.y < -16 || !this.alive)
            return;
        requestAnimationFrame(function () { return _this.fire(); });
    };
    return BulletSpecial;
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
        this.alive = true;
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
        this.y += 3;
        context.drawImage(this.img, this.x, this.y);
        if (this.hp <= 0 || this.y >= 600)
            this.alive = false;
        if (!this.alive)
            return;
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
        this.y += 5;
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
        this.y += 1;
        context.drawImage(this.img, this.x, this.y);
        requestAnimationFrame(function () { return _this.make(); });
    };
    return EnemyWarship;
}());
/**
 * 敌人飞机 补给
 *
 */
var EnemySupply = /** @class */ (function () {
    function EnemySupply() {
        var _this = this;
        this.img = enemy_supply;
        this.x = this.getRandomPos();
        this.y = -100;
        this.hp = 12;
        requestAnimationFrame(function () { return _this.make(); });
    }
    EnemySupply.prototype.getRandomPos = function () {
        var x = Math.floor(Math.random() * 301);
        return x;
    };
    EnemySupply.prototype.make = function () {
        var _this = this;
        if (!context)
            return;
        this.y += 2;
        context.drawImage(this.img, this.x, this.y);
        requestAnimationFrame(function () { return _this.make(); });
    };
    return EnemySupply;
}());
/**
 * 补给箱
 */
var Supply = /** @class */ (function () {
    function Supply(x, y) {
        var _this = this;
        this.img = supply;
        this.x = x;
        this.y = y;
        requestAnimationFrame(function () { return _this.make(); });
    }
    Supply.prototype.make = function () {
        var _this = this;
        if (!context)
            return;
        this.y += 1;
        context.drawImage(this.img, this.x, this.y);
        requestAnimationFrame(function () { return _this.make(); });
    };
    return Supply;
}());
