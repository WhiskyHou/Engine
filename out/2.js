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
 */
var stageWidth = 400;
var stageHeight = 600;
var enemyNormalSpeed = 2;
var enemyF22Speed = 4;
var enemySupplySpeed = 1;
var enemyWarshipSpeed = 0.5;
var bulletNormalWidth = 4;
var bulletNormalHeight = 20;
var bulletSpecialWidth = 6;
var bulletSpecialHeight = 16;
var playerHp = 2;
var Enemy = /** @class */ (function (_super) {
    __extends(Enemy, _super);
    function Enemy(x, y, img, hp) {
        var _this = _super.call(this, x, y, img) || this;
        _this.alive = true;
        _this.hp = hp;
        return _this;
    }
    return Enemy;
}(Bitmap));
var BulletNormal = /** @class */ (function (_super) {
    __extends(BulletNormal, _super);
    function BulletNormal(x, y, width, height, color, ap) {
        var _this = _super.call(this, x, y, width, height, color) || this;
        _this.alive = true;
        _this.ap = ap;
        return _this;
    }
    return BulletNormal;
}(Rectangle));
var Player = /** @class */ (function (_super) {
    __extends(Player, _super);
    function Player(x, y, img) {
        var _this = _super.call(this, x, y, img) || this;
        _this.alive = true;
        _this.fire = false;
        _this.fireMode = 1;
        _this.hp = playerHp;
        return _this;
    }
    return Player;
}(Bitmap));
var MenuState = /** @class */ (function (_super) {
    __extends(MenuState, _super);
    function MenuState() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MenuState.prototype.onEnter = function () {
        this.title = new TextField("飞机Dark战", 80, 120, 40);
        this.bg = new Bitmap(0, 0, bg);
        this.player = new Bitmap(0, 0, player);
        var container = new DisplayObjectContainer(0, 0);
        stage.addChild(container);
        container.rotation = 0;
        container.addChild(this.bg);
        container.addChild(this.player);
        container.addChild(this.title);
        this.player.addEventListener(function () {
            console.log("click");
        });
        this.title.addEventListener(function () {
            console.log("fu*k");
        });
        this.bg.addEventListener(function () {
            console.log("???");
        });
    };
    MenuState.prototype.onUpdate = function () {
        // console.log(this.title);
    };
    MenuState.prototype.onExit = function () {
    };
    return MenuState;
}(State));
var PlayingState = /** @class */ (function (_super) {
    __extends(PlayingState, _super);
    function PlayingState() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PlayingState.prototype.onEnter = function () {
    };
    PlayingState.prototype.onUpdate = function () {
    };
    PlayingState.prototype.onExit = function () {
    };
    return PlayingState;
}(State));
var stage = new Stage();
var fsm = new StateMachine();
fsm.replaceState(new MenuState());
function onTicker(context) {
    fsm.update();
    context.clearRect(0, 0, stageWidth, stageHeight);
    context.save();
    stage.draw(context);
    context.restore();
}
canvas.onclick = function (event) {
    var offsetX = event.offsetX;
    var offsetY = event.offsetY;
    var hitResult = stage.hitTest(new math.Point(offsetX, offsetY));
    if (hitResult)
        hitResult.dispatchEvent();
};
function enterFrame() {
    if (!context)
        return;
    onTicker(context);
    requestAnimationFrame(enterFrame);
}
requestAnimationFrame(enterFrame);
