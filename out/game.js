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
var van_pick_knife = document.getElementById('van_pick_knife');
var bg = new Image();
bg.src = './assets/bg.png';
var van1 = new Image();
van1.src = './assets/van_stand.png';
var van2 = new Image();
van2.src = './assets/van_stand_2.png';
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
var TILE_SIZE = 128;
var ROW_NUM = 6;
var COL_NUM = 6;
var GRASS_L = 0;
var GRASS_D = 1;
var TREE = 2;
var WALL_LEFT = 3;
var WALL_MIDDLE = 4;
var WALL_RIGHT = 5;
var KILL_DARGON_KNIFE = 6;
var PLAYER_INDEX_X = 0;
var PLAYER_INDEX_Y = 0;
var PLAYER_WALK_SPEED = 500;
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
            // 这里不调用onExit的话，状态机里面调用onExit还没反应，就提示游戏状态的角色名字未定义
            // 如果这里就调用onExit的话，那么状态机里的onExit也会调用成功
            // this.onExit();
            _this.onCreatePlayer();
            fsm.replaceState(new PlayingState());
        };
        _this.title = new TextField('点击开始游戏', 200, 300, 60);
        return _this;
    }
    MenuState.prototype.onEnter = function () {
        stage.addChild(this.title);
        stage.addEventListener(this.onClick);
    };
    MenuState.prototype.onUpdate = function () {
    };
    MenuState.prototype.onExit = function () {
        console.log('onExit');
        stage.deleteAllEventListener();
        stage.deleteAll();
        // this.onCreatePlayer();
    };
    MenuState.prototype.onCreatePlayer = function () {
        player = new User();
        player.level = 1;
        player.name = 'Van';
        player.x = PLAYER_INDEX_X;
        player.y = PLAYER_INDEX_Y;
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
        _this.bg = new Bitmap(0, 0, bg);
        _this.role = new Bitmap(PLAYER_INDEX_X, PLAYER_INDEX_Y, van1);
        _this.ui = new UserInfoUI(0, TILE_SIZE * 6);
        _this.gameContainer = new DisplayObjectContainer(16, 6);
        return _this;
    }
    PlayingState.prototype.onEnter = function () {
        stage.addChild(this.bg);
        stage.addChild(this.gameContainer);
        this.gameContainer.addChild(map);
        this.gameContainer.addChild(this.role);
        this.gameContainer.addChild(this.ui);
        // 给map添加监听器
        // 1 鼠标点击到map容器上了，监听器就执行到目标点的走路命令
        // 2 角色捡起了装备，监听器就执行更新地图物品信息
        map.addEventListener(function (eventData) {
            if (eventData.message == 'onClick') {
                if (player.moveStatus) {
                    var globalX = eventData.globalX;
                    var globalY = eventData.globalY;
                    var localPos = map.getLocalPos(new math.Point(globalX, globalY));
                    // 确定被点击的格子位置
                    var row = Math.floor(localPos.x / TILE_SIZE);
                    var col = Math.floor(localPos.y / TILE_SIZE);
                    // 添加行走命令
                    var walk = new WalkCommand(player.x, player.y, row, col);
                    commandPool.addCommand(walk);
                    // 获取被点击的格子的信息，如果有道具的话，就添加一个拾取命令
                    var nodeInfo = map.getNodeInfo(row, col);
                    if (nodeInfo && nodeInfo.equipment == KILL_DARGON_KNIFE) {
                        var weapon = new Equipment();
                        weapon.name = "屠龙宝刀";
                        weapon.attack = 20;
                        var pick = new PickCommand(weapon);
                        commandPool.addCommand(pick);
                    }
                    player.moveStatus = false;
                    // 执行命令池的命令
                    commandPool.execute();
                }
            }
            else if (eventData.message == 'pickEquipment') {
                for (var _i = 0, _a = map.config; _i < _a.length; _i++) {
                    var item = _a[_i];
                    if (item.equipment) {
                        item.equipment = 0;
                        map.rebuild();
                        van_pick_knife.play();
                        // alert('恭喜你！获得“屠龙宝刀”一把！')
                    }
                }
            }
        });
        // 给player数据模型添加监听器，走路命令中每走一格，向监听器报告一次新位置
        player.addEventListener(function (eventData) {
            if (eventData.message == 'walkOneStep') {
                var targetX = eventData.nodeX * TILE_SIZE;
                var targetY = eventData.nodeY * TILE_SIZE;
                player.x = eventData.nodeX;
                player.y = eventData.nodeY;
                // this.role.x = targetX;
                // this.role.y = targetY;
            }
        });
        this.changeRolePosture();
    };
    PlayingState.prototype.onUpdate = function () {
        this.roleMove();
    };
    PlayingState.prototype.onExit = function () {
        stage.deleteAll();
        this.gameContainer.deleteAll();
    };
    // 角色原地动画
    PlayingState.prototype.changeRolePosture = function () {
        var _this = this;
        setTimeout(function () {
            _this.role.img = (_this.role.img == van1) ? van2 : van1;
            _this.changeRolePosture();
        }, 600);
    };
    // 角色每帧移动动画
    PlayingState.prototype.roleMove = function () {
        var targetX = player.x * TILE_SIZE;
        var targetY = player.y * TILE_SIZE;
        if (this.role.x == targetX && this.role.y == targetY) {
            return;
        }
        var stepX = 0;
        var stepY = 0;
        if (Math.abs(targetX - this.role.x) > 2) {
            stepX = TILE_SIZE * INTERVAL / PLAYER_WALK_SPEED;
            stepX = (targetX < this.role.x) ? -stepX : stepX;
            this.role.x += stepX;
        }
        else {
            this.role.x = targetX;
        }
        if (Math.abs(targetY - this.role.y) > 2) {
            stepY = TILE_SIZE * INTERVAL / PLAYER_WALK_SPEED;
            stepY = (targetY < this.role.y) ? -stepY : stepY;
            this.role.y += stepY;
        }
        else {
            this.role.y = targetY;
        }
    };
    return PlayingState;
}(State));
/**
 * 游戏地图容器
 */
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
        _this.rebuild();
        return _this;
    }
    GameMap.prototype.rebuild = function () {
        this.grid = new astar.Grid(COL_NUM, ROW_NUM);
        for (var _i = 0, _a = this.config; _i < _a.length; _i++) {
            var item = _a[_i];
            var img = item.id == GRASS_L ? grassLight : grassDark;
            var tile = new Bitmap(TILE_SIZE * item.x, TILE_SIZE * item.y, img);
            this.grid.setWalkable(item.x, item.y, true);
            this.addChild(tile);
            if (item.tree) {
                var tile_1 = new Bitmap(TILE_SIZE * item.x, TILE_SIZE * item.y, tree);
                this.grid.setWalkable(item.x, item.y, false);
                this.addChild(tile_1);
            }
            if (item.wall) {
                var img_1 = item.wall == WALL_MIDDLE ? wall_middle : (item.wall == WALL_LEFT ? wall_left : wall_right);
                var tile_2 = new Bitmap(TILE_SIZE * item.x, TILE_SIZE * item.y, img_1);
                this.grid.setWalkable(item.x, item.y, false);
                this.addChild(tile_2);
            }
            if (item.equipment) {
                var tile_3 = new Bitmap(TILE_SIZE * item.x, TILE_SIZE * item.y, knife);
                this.addChild(tile_3);
            }
        }
    };
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
// 鼠标点击事件，捕获所有被点击到的 DisplayObject，并从叶子节点依次向上通知它们的监听器，监听器执行
canvas.onclick = function (event) {
    var globalX = event.offsetX;
    var globalY = event.offsetY;
    var hitResult = stage.hitTest(new math.Point(globalX, globalY));
    if (hitResult) {
        hitResult.dispatchEvent({ message: 'onClick', target: hitResult, globalX: globalX, globalY: globalY });
        while (hitResult.parent) {
            // console.log(hitResult);
            hitResult = hitResult.parent;
            hitResult.dispatchEvent({ message: 'onClick', target: hitResult, globalX: globalX, globalY: globalY });
        }
    }
};
// 初始状态设置
fsm.replaceState(new MenuState());
