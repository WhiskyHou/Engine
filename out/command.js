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
 * 走路命令
 */
var WalkCommand = /** @class */ (function (_super) {
    __extends(WalkCommand, _super);
    function WalkCommand(fromX, fromY, toX, toY) {
        var _this = _super.call(this) || this;
        _this.fromX = fromX;
        _this.fromY = fromY;
        _this.toX = toX;
        _this.toY = toY;
        return _this;
    }
    WalkCommand.prototype.execute = function (callback) {
        console.log("\u5F00\u59CB\u8D70\u8DEF\uFF01\uFF01\uFF01\u4ECE(" + this.fromX + ", " + this.fromY + ")\u51FA\u53D1");
        map.grid.setStartNode(this.fromX, this.fromY);
        map.grid.setEndNode(this.toX, this.toY);
        var findpath = new astar.AStar();
        findpath.setHeurisitic(findpath.diagonal);
        var result = findpath.findPath(map.grid);
        // console.log(map.grid.toString());
        console.log(findpath._path);
        var path;
        if (result) {
            path = findpath._path;
            path.shift();
            this.walk(path, callback);
        }
        else {
            player.moveStatus = true;
            callback();
        }
    };
    WalkCommand.prototype.walk = function (path, callback) {
        var _this = this;
        setTimeout(function () {
            var node = path.shift();
            if (node) {
                player.dispatchEvent('walkOneStep', { nodeX: node.x, nodeY: node.y });
            }
            else {
                console.log("\u5230\u8FBE\u5730\u70B9\uFF01\uFF01\uFF01(" + _this.toX + "," + _this.toY + ")");
                player.moveStatus = true;
                callback();
                return;
            }
            _this.walk(path, callback);
        }, PLAYER_WALK_SPEED);
    };
    return WalkCommand;
}(Command));
/**
 * 拾取命令
 */
var PickCommand = /** @class */ (function (_super) {
    __extends(PickCommand, _super);
    function PickCommand(equipment) {
        var _this = _super.call(this) || this;
        _this.equipment = equipment;
        return _this;
    }
    PickCommand.prototype.execute = function (callback) {
        player.pick(this.equipment);
        console.log("\u6361\u8D77\u4E86" + this.equipment.toString());
        // map.dispatchEvent({ message: 'pickEquipment' });
        map.deleteEquipment(this.equipment);
        callback();
    };
    return PickCommand;
}(Command));
