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
/**
 * 显示对象
 *
 * 以及其子类
 */
var DisplayObject = /** @class */ (function () {
    function DisplayObject(x, y) {
        this.x = x;
        this.y = y;
    }
    return DisplayObject;
}());
var Enemy = /** @class */ (function (_super) {
    __extends(Enemy, _super);
    function Enemy(x, y, hp, img, speed) {
        var _this = _super.call(this, x, y) || this;
        _this.alive = true;
        _this.hp = hp;
        _this.img = img;
        _this.width = img.width;
        _this.height = img.height;
        _this.speed = speed;
        return _this;
    }
    Enemy.prototype.move = function () {
        this.y += this.speed;
    };
    Enemy.prototype.render = function (context) {
        context.drawImage(this.img, this.x, this.y);
    };
    return Enemy;
}(DisplayObject));
var Player = /** @class */ (function (_super) {
    __extends(Player, _super);
    function Player(x, y, hp, img) {
        var _this = _super.call(this, x, y) || this;
        _this.alive = true;
        _this.hp = hp;
        _this.img = img;
        _this.width = img.width;
        _this.height = img.height;
        return _this;
    }
    Player.prototype.render = function (context) {
        context.drawImage(this.img, this.x, this.y);
    };
    return Player;
}(DisplayObject));
var Bullet = /** @class */ (function (_super) {
    __extends(Bullet, _super);
    function Bullet(x, y, width, height, ap, speed, color) {
        var _this = _super.call(this, x, y) || this;
        _this.width = width;
        _this.height = height;
        _this.ap = ap;
        _this.speed = speed;
        _this.color = color;
        return _this;
    }
    Bullet.prototype.move = function () {
        this.y -= this.speed;
    };
    Bullet.prototype.render = function (context) {
        context.beginPath();
        context.fillStyle = this.color;
        context.fillRect(this.x, this.y, this.width, this.height);
        context.fill();
        context.closePath();
    };
    return Bullet;
}(DisplayObject));
var TextField = /** @class */ (function (_super) {
    __extends(TextField, _super);
    function TextField(x, y, content, size, color) {
        var _this = _super.call(this, x, y) || this;
        _this.content = content;
        _this.size = size;
        _this.color = color;
        return _this;
    }
    TextField.prototype.render = function (context) {
        context.beginPath();
        context.fillStyle = this.color;
        context.font = this.size + 'px Arial';
        context.fillText(this.content, this.x, this.y);
        context.closePath();
    };
    return TextField;
}(DisplayObject));
var Img = /** @class */ (function (_super) {
    __extends(Img, _super);
    function Img(x, y, img, width, height) {
        var _this = _super.call(this, x, y) || this;
        _this.img = img;
        _this.width = width;
        _this.height = height;
        return _this;
    }
    Img.prototype.render = function (context) {
        context.drawImage(this.img, 0, 0);
    };
    return Img;
}(DisplayObject));
/**
 * 状态机
 *
 */
var StateMachine = /** @class */ (function () {
    function StateMachine() {
    }
    StateMachine.prototype.replaceState = function (state) {
        if (this.currentState) {
            this.currentState.onExit();
        }
        this.currentState = state;
        this.currentState.onEnter();
    };
    StateMachine.prototype.update = function () {
        if (this.currentState) {
            this.currentState.onUpdate();
        }
    };
    return StateMachine;
}());
/**
 * 状态
 *
 * 以及其子类
 */
var State = /** @class */ (function () {
    function State() {
    }
    State.prototype.onEnter = function () {
    };
    State.prototype.onUpdate = function () {
    };
    State.prototype.onExit = function () {
    };
    return State;
}());
var BeginState = /** @class */ (function (_super) {
    __extends(BeginState, _super);
    function BeginState() {
        var _this = _super.call(this) || this;
        _this.count = 0;
        _this.titleContents = ['飞机Dark战', '操作说明——', '鼠标控制飞机移动', '空格键 开火/停火', 'Z 键切换开火模式'];
        _this.title = new TextField(90, 120, '飞机Dark战', 40, 'black');
        _this.tip = new TextField(120, 500, '点击进行下一步', 18, 'black');
        ;
        return _this;
    }
    BeginState.prototype.onEnter = function () {
        // const title = new TextField(90, 120, '飞机Dark战', 40, 'black');
        // const tip = new TextField(120, 500, '按 Y 进行下一步', 18, 'black');
        stage.renderList = [this.title, this.tip];
    };
    BeginState.prototype.onUpdate = function () {
    };
    BeginState.prototype.onClick = function () {
        this.count++;
        this.title.content = this.titleContents[this.count];
        if (4 === this.count)
            return true;
        return false;
    };
    return BeginState;
}(State));
var PlayState = /** @class */ (function (_super) {
    __extends(PlayState, _super);
    function PlayState() {
        var _this = _super.call(this) || this;
        _this.bg = new Img(0, 0, bg, stageWidth, stageHeight);
        return _this;
    }
    PlayState.prototype.onEnter = function () {
        stage.renderList = [this.bg];
    };
    return PlayState;
}(State));
/**
 * 舞台
 */
var Stage = /** @class */ (function () {
    function Stage() {
        this.renderList = [];
    }
    return Stage;
}());
var stage = new Stage();
var fsm = new StateMachine();
fsm.replaceState(new BeginState());
window.onclick = function () {
    fsm.replaceState(new PlayState());
};
function onTicker(context) {
    fsm.update();
    context.clearRect(0, 0, stageWidth, stageHeight);
    var renderList = stage.renderList;
    for (var _i = 0, renderList_1 = renderList; _i < renderList_1.length; _i++) {
        var render = renderList_1[_i];
        render.render(context);
    }
}
function enterFrame() {
    if (!context)
        return;
    onTicker(context);
    requestAnimationFrame(enterFrame);
}
requestAnimationFrame(enterFrame);
