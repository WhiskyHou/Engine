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
var KILL_DARGON_KNIFE = 6;
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
        map = new GameMap();
        _this.role = new Bitmap(0, 0, van);
        return _this;
    }
    PlayingState.prototype.onEnter = function () {
        stage.addChild(map);
        stage.addChild(this.role);
        map.addEventListener(function (eventData) {
            var globalX = eventData.globalX;
            var globalY = eventData.globalY;
            var localPos = map.getLocalPos(new math.Point(globalX, globalY));
            var row = Math.floor(localPos.x / ITEM_SIZE);
            var col = Math.floor(localPos.y / ITEM_SIZE);
            var walk = new WalkCommand(row, col);
            commandPool.addCommand(walk);
            var nodeInfo = map.getNodeInfo(row, col);
            if (nodeInfo && nodeInfo.equipment) {
                var weapon = new Equipment();
                weapon.name = "屠龙宝刀";
                weapon.attack = 20;
                var pick = new PickCommand(weapon);
                commandPool.addCommand(pick);
            }
            commandPool.execute();
            console.log(map.grid.toString());
        });
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
            { x: 0, y: 1, id: GRASS_D, wall: WALL_LEFT }, { x: 1, y: 1, id: GRASS_L, wall: WALL_MIDDLE }, { x: 2, y: 1, id: GRASS_D, wall: WALL_MIDDLE }, { x: 3, y: 1, id: GRASS_L, wall: WALL_RIGHT }, { x: 4, y: 1, id: GRASS_D }, { x: 5, y: 1, id: GRASS_L },
            { x: 0, y: 2, id: GRASS_L }, { x: 1, y: 2, id: GRASS_D, tree: TREE }, { x: 2, y: 2, id: GRASS_L }, { x: 3, y: 2, id: GRASS_D }, { x: 4, y: 2, id: GRASS_L }, { x: 5, y: 2, id: GRASS_D },
            { x: 0, y: 3, id: GRASS_D }, { x: 1, y: 3, id: GRASS_L }, { x: 2, y: 3, id: GRASS_D }, { x: 3, y: 3, id: GRASS_L, wall: WALL_LEFT }, { x: 4, y: 3, id: GRASS_D, wall: WALL_MIDDLE }, { x: 5, y: 3, id: GRASS_L, wall: WALL_RIGHT },
            { x: 0, y: 4, id: GRASS_L }, { x: 1, y: 4, id: GRASS_D }, { x: 2, y: 4, id: GRASS_L, tree: TREE }, { x: 3, y: 4, id: GRASS_D, tree: TREE }, { x: 4, y: 4, id: GRASS_L }, { x: 5, y: 4, id: GRASS_D, equipment: KILL_DARGON_KNIFE },
            { x: 0, y: 5, id: GRASS_D }, { x: 1, y: 5, id: GRASS_L }, { x: 2, y: 5, id: GRASS_D }, { x: 3, y: 5, id: GRASS_L }, { x: 4, y: 5, id: GRASS_D }, { x: 5, y: 5, id: GRASS_L }
        ];
        _this.grid = new astar.Grid(COL_NUM, ROW_NUM);
        for (var _i = 0, _a = _this.config; _i < _a.length; _i++) {
            var item = _a[_i];
            var img = item.id == GRASS_L ? grassLight : grassDark;
            var tile = new Bitmap(ITEM_SIZE * item.x, ITEM_SIZE * item.y, img);
            _this.grid.setWalkable(item.x, item.y, true);
            _this.addChild(tile);
            if (item.tree) {
                var tile_1 = new Bitmap(ITEM_SIZE * item.x, ITEM_SIZE * item.y, tree);
                _this.grid.setWalkable(item.x, item.y, false);
                _this.addChild(tile_1);
            }
            if (item.wall) {
                var img_1 = item.wall == WALL_MIDDLE ? wall_middle : (item.wall == WALL_LEFT ? wall_left : wall_right);
                var tile_2 = new Bitmap(ITEM_SIZE * item.x, ITEM_SIZE * item.y, img_1);
                _this.grid.setWalkable(item.x, item.y, false);
                _this.addChild(tile_2);
            }
            if (item.equipment) {
                var tile_3 = new Bitmap(ITEM_SIZE * item.x, ITEM_SIZE * item.y, knife);
                // this.grid.setWalkable(item.x, item.y, false);
                _this.addChild(tile_3);
            }
        }
        return _this;
    }
    GameMap.prototype.getNodeInfo = function (row, col) {
        for (var _i = 0, _a = this.config; _i < _a.length; _i++) {
            var item = _a[_i];
            if (item.x == row && item.y == col) {
                return item;
            }
        }
        return null;
    };
    return GameMap;
}(DisplayObjectContainer));
canvas.onclick = function (event) {
    var globalX = event.offsetX;
    var globalY = event.offsetY;
    var hitResult = stage.hitTest(new math.Point(globalX, globalY));
    if (hitResult) {
        hitResult.dispatchEvent({ target: hitResult, globalX: globalX, globalY: globalY });
        while (hitResult.parent) {
            // console.log(hitResult);
            hitResult = hitResult.parent;
            hitResult.dispatchEvent({ target: hitResult, globalX: globalX, globalY: globalY });
        }
    }
};
fsm.replaceState(new MenuState());
