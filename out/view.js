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
 * 用户信息UI
 */
var UserInfoUI = /** @class */ (function (_super) {
    __extends(UserInfoUI, _super);
    function UserInfoUI(x, y) {
        var _this = _super.call(this, x, y) || this;
        _this.userName = new TextField(player.name, 10, 0, 20);
        _this.userLevel = new TextField('Lv:' + player.level, 120, 0, 20);
        _this.userAttack = new TextField('Attck:' + player.attack, 240, 0, 20);
        _this.userEquipment = new TextField('装备: ', 400, 0, 20);
        _this.addChild(_this.userName);
        _this.addChild(_this.userLevel);
        _this.addChild(_this.userAttack);
        _this.addChild(_this.userEquipment);
        player.addEventListener(function (eventData) {
            if (eventData.message == 'setLevel' || eventData.message == 'pickEquipment') {
                _this.userLevel.text = 'Lv:' + player.level;
                _this.userAttack.text = 'Attck:' + player.attack;
                var equipments = '';
                for (var _i = 0, _a = player.mounthedEquipment; _i < _a.length; _i++) {
                    var item = _a[_i];
                    equipments += item.name.toString();
                }
                _this.userEquipment.text = '装备: ' + equipments;
            }
        });
        return _this;
        // console.log(player);
    }
    return UserInfoUI;
}(DisplayObjectContainer));
