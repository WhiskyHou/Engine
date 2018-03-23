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
var MAX_LEVEL = 99;
var MAX_HP = 140;
var MAX_ATTACK = 200;
var USER_ATTACK_PRE = 10;
var User = /** @class */ (function (_super) {
    __extends(User, _super);
    function User() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.name = '';
        _this.hp = 10;
        _this.mounthedEquipment = [];
        _this.packageEquipment = [];
        return _this;
    }
    Object.defineProperty(User.prototype, "level", {
        get: function () {
            return this.level;
        },
        set: function (level) {
            this.level = level;
            this.dispatchEvent('setLevel');
        },
        enumerable: true,
        configurable: true
    });
    User.prototype.pick = function (equipment) {
        this.mounthedEquipment.push(equipment);
    };
    User.prototype.drop = function () {
    };
    Object.defineProperty(User.prototype, "attack", {
        get: function () {
            var equipmentAttack = 0;
            for (var _i = 0, _a = this.mounthedEquipment; _i < _a.length; _i++) {
                var equipment = _a[_i];
                equipmentAttack += equipment.attack;
            }
            return this.attack * USER_ATTACK_PRE + equipmentAttack;
        },
        enumerable: true,
        configurable: true
    });
    User.prototype.toString = function () {
        return "[User ~ name:" + this.name + ", level:" + this.level + ", hp:" + this.hp + ", attack:" + this.attack + "]";
    };
    return User;
}(EventDispatcher));
var Equipment = /** @class */ (function () {
    function Equipment() {
        this.name = '';
        this.attack = 10;
    }
    Equipment.prototype.toString = function () {
        return "[Equipment ~ name:" + this.name + ", attack:" + this.attack + "]";
    };
    return Equipment;
}());
