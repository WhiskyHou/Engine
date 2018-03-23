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
var ITEM_WIDTH = 128;
var ITEM_HEIGHT = 128;
var MenuState = /** @class */ (function (_super) {
    __extends(MenuState, _super);
    function MenuState() {
        var _this = _super.call(this) || this;
        _this.onClick = function (eventData) {
            fsm.replaceState(new PlayingState());
        };
        _this.title = new TextField('点击开始游戏', 300, 300, 60);
        return _this;
    }
    MenuState.prototype.onEnter = function () {
        stage.addChild(this.title);
        stage.addEventListener(this.onClick);
    };
    MenuState.prototype.onUpdate = function () {
    };
    MenuState.prototype.onExit = function () {
        stage.deleteAll();
        stage.deleteAllEventListener();
    };
    return MenuState;
}(State));
var PlayingState = /** @class */ (function (_super) {
    __extends(PlayingState, _super);
    function PlayingState() {
        var _this = _super.call(this) || this;
        _this.text = new TextField('游戏中', 300, 300, 60);
        return _this;
    }
    PlayingState.prototype.onEnter = function () {
        stage.addChild(this.text);
    };
    PlayingState.prototype.onUpdate = function () {
    };
    PlayingState.prototype.onExit = function () {
    };
    return PlayingState;
}(State));
canvas.onclick = function (event) {
    var globalX = event.offsetX;
    var globalY = event.offsetY;
    var hitResult = stage.hitTest(new math.Point(globalX, globalY));
    if (hitResult) {
        hitResult.dispatchEvent({ target: hitResult, globalX: globalX, globalY: globalY });
        while (hitResult.parent) {
            hitResult = hitResult.parent;
            hitResult.dispatchEvent({ target: hitResult, globalX: globalX, globalY: globalY });
        }
    }
};
fsm.replaceState(new MenuState());
