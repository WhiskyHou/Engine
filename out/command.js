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
var Command = /** @class */ (function () {
    function Command() {
    }
    Command.prototype.execute = function (callback) {
    };
    return Command;
}());
var CommandPool = /** @class */ (function () {
    function CommandPool() {
        this.list = [];
    }
    CommandPool.prototype.add = function (command) {
        this.list.push(command);
    };
    CommandPool.prototype.execute = function () {
        var _this = this;
        var command = this.list.shift();
        if (command) {
            command.execute(function () {
                _this.execute();
            });
        }
        for (var _i = 0, _a = this.list; _i < _a.length; _i++) {
            var command_1 = _a[_i];
            // command.execute();
        }
    };
    return CommandPool;
}());
var WalkCommand = /** @class */ (function (_super) {
    __extends(WalkCommand, _super);
    function WalkCommand() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    WalkCommand.prototype.execute = function (callback) {
    };
    return WalkCommand;
}(Command));
var PickCommand = /** @class */ (function (_super) {
    __extends(PickCommand, _super);
    function PickCommand() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PickCommand.prototype.execute = function () {
    };
    return PickCommand;
}(Command));
