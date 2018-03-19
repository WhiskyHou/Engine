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
        if (this.hp <= 0) {
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
    function Bullet(x, y, width, height, color, ap) {
        var _this = _super.call(this, x, y, width, height, color) || this;
        _this.alive = true;
        _this.ap = ap;
        return _this;
    }
    Bullet.prototype.update = function () {
        this.y -= 10;
    };
    return Bullet;
}(Rectangle));
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
        // console.log(this.title);
    };
    MenuState.prototype.onExit = function () {
        // this.container.deleteAll();
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
        setInterval(function () { return _this.fire(); }, 1000);
        setInterval(function () { return _this.swapEnemy(); }, 1000);
    };
    PlayingState.prototype.onUpdate = function () {
        // 更新玩家信息
        this.player.fireMode = fireMode;
        if (this.player.parent) {
            var playerPos = this.player.parent.getLocalPos(new math.Point(playerX, playerY));
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
        // 更新渲染节点下挂的子弹节点
        this.bulletContainer.deleteAll();
        for (var _d = 0, _e = this.bulletList; _d < _e.length; _d++) {
            var bullet = _e[_d];
            this.bulletContainer.addChild(bullet);
        }
        // 更新渲染节点下挂的敌人节点
        this.enemyContainer.deleteAll();
        for (var _f = 0, _g = this.enemyList; _f < _g.length; _f++) {
            var enemy = _g[_f];
            this.bulletContainer.addChild(enemy);
        }
        // 检测碰撞！！！
        // 有问题啊！！！！！！！！
        // 天啊！！理了一个小时逻辑了没错啊！！！！！！
        this.checkKnock();
        this.clearList();
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
                var bulletNormal = new Bullet(pos.x / 2, pos.y / 2, bulletNormalWidth, bulletNormalHeight, 'red', 1);
                bulletNormal.addEventListener(function () {
                    bulletNormal.alive = false;
                    console.log("biu");
                });
                this.bulletList.push(bulletNormal);
                // console.log(bulletNormal);
            }
            else {
            }
        }
    };
    PlayingState.prototype.swapEnemy = function () {
        var x = this.getRandomPos();
        var temp = new Enemy(x, -60, enemy_normal, enemyNormalHp, enemyNormalSpeed);
        temp.addEventListener(function () {
            temp.hp--;
            // temp.alive = false;
            console.log("click--");
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
            var x = bullet.x * 2 + bulletNormalWidth / 2;
            var y = bullet.y * 2;
            var result = stage.hitTest(new math.Point(x, y));
            if (result != null) {
                result.dispatchEvent();
                // 这里如果让子弹执行回调函数的话，刚发射就触发了，这就很烦
                // bullet.dispatchEvent();
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
    PlayingState.prototype.clearList = function () {
        for (var i = 0; i < this.bulletList.length; i++) {
            if (!this.bulletList[i].alive) {
                this.bulletList.splice(i);
                i--;
            }
        }
        for (var i = 0; i < this.enemyList.length; i++) {
            if (!this.enemyList[i].alive) {
                this.enemyList.splice(i);
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
    if (x >= 0 && x <= 340)
        playerX = x;
    if (y >= 0 && y <= 540)
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
