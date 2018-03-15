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
var stageWidth = 400;
var stageHeight = 600;
var enemyNormalSpeed = 2;
var enemyF22Speed = 4;
var enemySupplySpeed = 1;
var enemyWarshipSpeed = 0.5;
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
    function Bullet(x, y, ap, speed) {
        return _super.call(this, x, y) || this;
    }
    return Bullet;
}(DisplayObject));
