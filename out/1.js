"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * 初始化Canvas
 * 加载资源文件
 */
var canvas = document.getElementById("gameCanvas");
var context = canvas.getContext("2d");
var player = new Image();
player.src = './assets/player_60.png';
var bg = new Image();
bg.src = './assets/bg_400_600.jpg';
var enemy_normal = new Image();
enemy_normal.src = './assets/enemy_60.png';
var enemy_f22 = new Image();
enemy_f22.src = './assets/enemy_80.png';
var enemy_warship = new Image();
enemy_warship.src = './assets/enemy_160_300.png';
var enemy_supply = new Image();
enemy_supply.src = './assets/enemy_100.png';
var supply = new Image();
supply.src = './assets/supply_100.png';
var bulletNormal = new Image();
bulletNormal.src = './assets/bullet_4_20.png';
var bulletSpecial = new Image();
bulletSpecial.src = './assets/bullet_6_16.png';
/**
 * 常量
 *
 * 全局变量
 */
var stageWidth = 400;
var stageHeight = 600;
var enemyNormalSpeed = 2;
var enemyF22Speed = 4;
var enemySupplySpeed = 1;
var enemyWarshipSpeed = 0.5;
var enemyNormalHp = 2;
var bulletNormalWidth = 4;
var bulletNormalHeight = 20;
var bulletNormalAp = 1;
var bulletSpecialWidth = 6;
var bulletSpecialHeight = 16;
var playerHp = 2;
var playerX = 170;
var playerY = 540;
var fireMode = true;
var fireSwitch = false;
/**
 * 敌人
 */
var Enemy = /** @class */ (function (_super) {
    __extends(Enemy, _super);
    function Enemy(x, y, img, hp, speed) {
        var _this = _super.call(this, x, y, img) || this;
        _this.alive = true;
        _this.hp = hp;
        _this.speed = speed;
        return _this;
    }
    Enemy.prototype.update = function () {
        this.y += this.speed;
        if (this.hp <= 0 || this.y >= 660) {
            this.alive = false;
        }
    };
    return Enemy;
}(Bitmap));
/**
 * 子弹
 */
var Bullet = /** @class */ (function (_super) {
    __extends(Bullet, _super);
    function Bullet(x, y, img, ap) {
        var _this = _super.call(this, x, y, img) || this;
        _this.alive = true;
        _this.ap = ap;
        return _this;
    }
    Bullet.prototype.update = function () {
        this.y -= 10;
        if (this.y <= -20)
            this.alive = false;
    };
    return Bullet;
}(Bitmap));
/**
 * 玩家
 */
var Player = /** @class */ (function (_super) {
    __extends(Player, _super);
    function Player(x, y, img) {
        var _this = _super.call(this, x, y, img) || this;
        _this.alive = true;
        _this.fire = false;
        _this.fireMode = true;
        _this.hp = playerHp;
        _this.score = 0;
        return _this;
    }
    return Player;
}(Bitmap));
/**
 * 状态 —— 菜单界面
 */
var MenuState = /** @class */ (function (_super) {
    __extends(MenuState, _super);
    function MenuState() {
        var _this = _super.call(this) || this;
        _this.id = 0;
        _this.title = new TextField("飞机Dark战", 90, 120, 40);
        _this.tip = new TextField("鼠标控制移动，空格开火，Z键切换模式", 20, 400, 20);
        _this.next = new TextField("点击鼠标开始游戏", 120, 500, 20);
        _this.bg = new Bitmap(0, 0, bg);
        _this.container = new DisplayObjectContainer(0, 0);
        return _this;
    }
    MenuState.prototype.onEnter = function () {
        stage.addChild(this.container);
        this.container.addChild(this.bg);
        this.container.addChild(this.tip);
        this.container.addChild(this.next);
        this.container.addChild(this.title);
    };
    MenuState.prototype.onUpdate = function () {
    };
    MenuState.prototype.onExit = function () {
        stage.deleteAll();
    };
    return MenuState;
}(State));
/**
 * 状态 —— 游戏界面
 */
var PlayingState = /** @class */ (function (_super) {
    __extends(PlayingState, _super);
    function PlayingState() {
        var _this = _super.call(this) || this;
        _this.id = 1;
        _this.enemyList = [];
        _this.bulletList = [];
        _this.player = new Player(170, 540, player);
        _this.bg = new Bitmap(0, 0, bg);
        _this.fireMode = new TextField("普通弹药", 20, 0, 24);
        _this.score = new TextField("得分:0", 160, 0, 24);
        _this.playerHp = new TextField("HP:2", 320, 0, 24);
        _this.container = new DisplayObjectContainer(0, 0);
        _this.bulletContainer = new DisplayObjectContainer(0, 0);
        _this.enemyContainer = new DisplayObjectContainer(0, 0);
        _this.menuContainer = new DisplayObjectContainer(0, 560);
        return _this;
    }
    PlayingState.prototype.onEnter = function () {
        var _this = this;
        stage.addChild(this.container);
        stage.addChild(this.bulletContainer);
        stage.addChild(this.enemyContainer);
        stage.addChild(this.menuContainer);
        this.container.addChild(this.bg);
        this.container.addChild(this.player);
        this.menuContainer.addChild(this.fireMode);
        this.menuContainer.addChild(this.score);
        this.menuContainer.addChild(this.playerHp);
        setInterval(function () { return _this.fire(); }, 100);
        setInterval(function () { return _this.freshEnemy(); }, 1000);
    };
    PlayingState.prototype.onUpdate = function () {
        // 更新玩家信息
        this.player.fireMode = fireMode;
        if (this.player.parent) {
            var playerPos = this.player.parent.getLocalPos(new math.Point(playerX, playerY));
            // var playerPos = this.player.parent.getLocalPos(new math.Point(globalX, globalY));
            this.player.x = playerPos.x;
            this.player.y = playerPos.y;
        }
        // this.player.x = playerX;
        // this.player.y = playerY;    不能直接给赋值全局坐标！！！！
        // 更新每个子弹和敌人的信息
        for (var _i = 0, _a = this.bulletList; _i < _a.length; _i++) {
            var bullet = _a[_i];
            bullet.update();
        }
        for (var _b = 0, _c = this.enemyList; _b < _c.length; _b++) {
            var enemy = _c[_b];
            enemy.update();
        }
        // 检测碰撞！！！
        // 有问题啊！！！！！！！！
        // 天啊！！理了一个小时逻辑了没错啊！！！！！！
        // 换了图片来做子弹之后，碰撞问题基本解决，最后一个bug，打掉某一架飞机后，它之后刷新的所有飞机一起消失
        this.checkKnock();
        // 清除已经销毁的节点
        this.cleanList();
        // 更新子弹渲染队列
        this.bulletContainer.deleteAll();
        for (var _d = 0, _e = this.bulletList; _d < _e.length; _d++) {
            var bullet = _e[_d];
            this.bulletContainer.addChild(bullet);
        }
        // 更新敌人渲染队列
        this.enemyContainer.deleteAll();
        for (var _f = 0, _g = this.enemyList; _f < _g.length; _f++) {
            var enemy = _g[_f];
            this.enemyContainer.addChild(enemy);
        }
        // 更新菜单UI信息
        this.fireMode.text = this.player.fireMode ? "普通弹药" : "特殊弹药";
        this.score.text = "得分:" + this.player.score.toString();
        this.playerHp.text = "HP:" + this.player.hp.toString();
    };
    PlayingState.prototype.onExit = function () {
    };
    PlayingState.prototype.fire = function () {
        if (fireSwitch) {
            if (fireMode) {
                /**
                 * 这里有问题！！
                 *
                 * 按照和飞机坐标一样的设置，位置会翻倍
                 * 输出信息的时候，子弹的x是180，但是实际渲染的x是360
                 */
                var pos = this.bulletContainer.getLocalPos(new math.Point(playerX + 28, playerY));
                var temp = new Bullet(pos.x, pos.y, bulletNormal, 1);
                temp.addEventListener(function () {
                    temp.alive = false;
                });
                this.bulletList.push(temp);
            }
            else {
                // 特殊子弹的刷新
                var pos = this.bulletContainer.getLocalPos(new math.Point(playerX + 27, playerY));
                var temp = new Bullet(pos.x, pos.y, bulletSpecial, 2);
                temp.addEventListener(function () {
                    temp.alive = false;
                });
                this.bulletList.push(temp);
            }
        }
    };
    PlayingState.prototype.freshEnemy = function () {
        var x = this.getRandomPos();
        var temp = new Enemy(x, -60, enemy_normal, enemyNormalHp, enemyNormalSpeed);
        temp.addEventListener(function () {
            temp.hp--;
        });
        this.enemyList.push(temp);
    };
    PlayingState.prototype.getRandomPos = function () {
        var x = Math.floor(Math.random() * 341);
        return x;
    };
    PlayingState.prototype.checkKnock = function () {
        for (var _i = 0, _a = this.bulletList; _i < _a.length; _i++) {
            var bullet = _a[_i];
            // 还是上面生成子弹时候的问题，子弹实际位置和渲染位置不同，为了让碰撞检测和看到的画面一致，这里得*2
            // 矩形类没找到问题，改成用图片来做子弹了，这里就不用*2了
            // 玄学bug解决，矩形类里面绘制的位置得是 0,0
            var x = bullet.x + bulletNormalWidth / 2;
            var y = bullet.y;
            // 必须要用 stage.hitTest() , this.enemyContainer.hitTest() 就不行！！！
            // 问题解决了 之前把敌人加到子弹的容器里面了
            var result = this.enemyContainer.hitTest(new math.Point(x, y));
            if (result != null) {
                result.dispatchEvent();
                // // 这里如果让子弹执行回调函数的话，刚发射就触发了，这就很烦
                // // 很神奇诶！用图片来做子弹，这里的问题也解决了，玄学啊
                // 玄学bug解决，矩形类里面绘制的位置得是 0,0
                // bullet.dispatchEvent();
                bullet.alive = false;
            }
        }
        // // 必须要用 stage.hitTest() , this.enemyContainer.hitTest() 就不行！！！
        // var result = stage.hitTest(new math.Point(playerX + 30, playerY + 30));
        // if (result != null)
        //     result.dispatchEvent();
        // for (var i = 0; i < this.enemyList.length; i++) {
        //     if (!this.enemyList[i].alive) {
        //         this.enemyList.splice(i);
        //         i--;
        //     }
        // }
    };
    PlayingState.prototype.cleanList = function () {
        // 问题就在这里，清理完之后 数组长度就变成 0 了
        // 等待解决
        // 问题解决了 array的aplice方法，第一个参数指定位置，第二个参数指定删除的个数
        for (var i = 0; i < this.bulletList.length; i++) {
            if (!this.bulletList[i].alive) {
                this.bulletList.splice(i, 1);
                i--;
            }
        }
        for (var i = 0; i < this.enemyList.length; i++) {
            if (!this.enemyList[i].alive) {
                this.enemyList.splice(i, 1);
                i--;
            }
        }
    };
    return PlayingState;
}(State));
var stage = new Stage();
var fsm = new StateMachine();
fsm.replaceState(new MenuState());
/**
 * 心跳控制器
 */
function onTicker(context) {
    fsm.update();
    context.clearRect(0, 0, stageWidth, stageHeight);
    context.save();
    stage.draw(context);
    context.restore();
}
/**
 * 事件处理
 */
canvas.onmousemove = function (event) {
    var x = event.offsetX - 30;
    var y = event.offsetY - 30;
    playerX = x;
    playerY = y;
};
canvas.onclick = function (event) {
    // const offsetX = event.offsetX;
    // const offsetY = event.offsetY;
    // const hitResult = stage.hitTest(new math.Point(offsetX, offsetY));
    // if (hitResult)
    //     hitResult.dispatchEvent();
    var state = fsm.getCurrentState();
    if (state != null) {
        if (state.id != 1) {
            fsm.replaceState(new PlayingState());
        }
    }
};
window.onkeydown = function (event) {
    var key = event.keyCode ? event.keyCode : event.which;
    if (90 === key) {
        fireMode = !fireMode;
    }
    else if (32 === key) {
        fireSwitch = !fireSwitch;
    }
};
/**
 * 主循环
 */
function enterFrame() {
    if (!context)
        return;
    onTicker(context);
    requestAnimationFrame(enterFrame);
}
requestAnimationFrame(enterFrame);
var CollideSystem = /** @class */ (function () {
    function CollideSystem() {
        this.activeList = [];
        this.passiveList = [];
    }
    CollideSystem.prototype.setListener = function (callback) {
    };
    CollideSystem.prototype.check = function () {
        for (var _i = 0, _a = this.activeList; _i < _a.length; _i++) {
            var item = _a[_i];
            item.update();
        }
        this.callback(this.activeList[0], this.passiveList[0]);
    };
    return CollideSystem;
}());
