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
 * 资源载入
 */
var van = new Image();
van.src = './assets/van_stand.png';
var knife = new Image();
knife.src = './assets/kill_dargon_knife.png';
var grassLight = new Image();
grassLight.src = './assets/grass_light.jpg';
var grassDark = new Image();
grassDark.src = './assets/grass_dark.jpg';
var tree = new Image();
tree.src = './assets/tree.png';
var wall_left = new Image();
wall_left.src = './assets/wall_left.png';
var wall_middle = new Image();
wall_middle.src = './assets/wall_middle.png';
var wall_right = new Image();
wall_right.src = './assets/wall_right.png';
/**
 * 常量
 *
 * 全局变量
 */
var ITEM_SIZE = 128;
var ROW_NUM = 6;
var COL_NUM = 6;
var GRASS_L = 0;
var GRASS_D = 1;
var TREE = 2;
var WALL_LEFT = 3;
var WALL_MIDDLE = 4;
var WALL_RIGHT = 5;
var player;
var map;
/**
 * 开始状态
 */
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
        stage.deleteAllEventListener();
        stage.deleteAll();
        player = new User();
        player.level = 1;
        player.name = 'Van';
    };
    return MenuState;
}(State));
/**
 * 游戏状态
 */
var PlayingState = /** @class */ (function (_super) {
    __extends(PlayingState, _super);
    function PlayingState() {
        var _this = _super.call(this) || this;
        _this.text = new TextField('Deep Dark Fantasy', 100, 300, 60);
        map = new GameMap();
        return _this;
    }
    PlayingState.prototype.onEnter = function () {
        var role = new Bitmap(0, 0, van);
        stage.addChild(map);
        stage.addChild(this.text);
        stage.addChild(role);
    };
    PlayingState.prototype.onUpdate = function () {
    };
    PlayingState.prototype.onExit = function () {
    };
    return PlayingState;
}(State));
var GameMap = /** @class */ (function (_super) {
    __extends(GameMap, _super);
    function GameMap() {
        var _this = _super.call(this, 0, 0) || this;
        _this.config = [
            { x: 0, y: 0, id: GRASS_L }, { x: 1, y: 0, id: GRASS_D }, { x: 2, y: 0, id: GRASS_L }, { x: 3, y: 0, id: GRASS_D }, { x: 4, y: 0, id: GRASS_L }, { x: 5, y: 0, id: GRASS_D },
            { x: 0, y: 1, id: GRASS_D }, { x: 1, y: 1, id: GRASS_L }, { x: 2, y: 1, id: GRASS_D }, { x: 3, y: 1, id: GRASS_L }, { x: 4, y: 1, id: GRASS_D }, { x: 5, y: 1, id: GRASS_L },
            { x: 0, y: 2, id: GRASS_L }, { x: 1, y: 2, id: GRASS_D }, { x: 2, y: 2, id: GRASS_L }, { x: 3, y: 2, id: GRASS_D }, { x: 4, y: 2, id: GRASS_L }, { x: 5, y: 2, id: GRASS_D },
            { x: 0, y: 3, id: GRASS_D }, { x: 1, y: 3, id: GRASS_L }, { x: 2, y: 3, id: GRASS_D }, { x: 3, y: 3, id: GRASS_L }, { x: 4, y: 3, id: GRASS_D }, { x: 5, y: 3, id: GRASS_L },
            { x: 0, y: 4, id: GRASS_L }, { x: 1, y: 4, id: GRASS_D }, { x: 2, y: 4, id: GRASS_L }, { x: 3, y: 4, id: GRASS_D }, { x: 4, y: 4, id: GRASS_L }, { x: 5, y: 4, id: GRASS_D },
            { x: 0, y: 5, id: GRASS_D }, { x: 1, y: 5, id: GRASS_L }, { x: 2, y: 5, id: GRASS_D }, { x: 3, y: 5, id: GRASS_L }, { x: 4, y: 5, id: GRASS_D }, { x: 5, y: 5, id: GRASS_L }
        ];
        _this.grid = new astar.Grid(COL_NUM, ROW_NUM);
        for (var _i = 0, _a = _this.config; _i < _a.length; _i++) {
            var item = _a[_i];
            var img = item.id == GRASS_L ? grassLight : grassDark;
            var tile = new Bitmap(ITEM_SIZE * item.x, ITEM_SIZE * item.y, img);
            _this.grid.setWalkable(item.x, item.y, true);
            _this.addChild(tile);
        }
        return _this;
    }
    return GameMap;
}(DisplayObjectContainer));
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
