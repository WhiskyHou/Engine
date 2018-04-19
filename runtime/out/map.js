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
 * 游戏地图容器
 */
var GameMap = /** @class */ (function (_super) {
    __extends(GameMap, _super);
    function GameMap() {
        var _this = _super.call(this, 0, 0) || this;
        _this.config = [
            { x: 0, y: 0, id: GRASS_L }, { x: 1, y: 0, id: GRASS_D }, { x: 2, y: 0, id: GRASS_L }, { x: 3, y: 0, id: GRASS_D }, { x: 4, y: 0, id: GRASS_L }, { x: 5, y: 0, id: GRASS_D, npc: NPC },
            { x: 0, y: 1, id: GRASS_D, wall: WALL_LEFT }, { x: 1, y: 1, id: GRASS_L, wall: WALL_MIDDLE }, { x: 2, y: 1, id: GRASS_D, wall: WALL_MIDDLE }, { x: 3, y: 1, id: GRASS_L, wall: WALL_RIGHT }, { x: 4, y: 1, id: GRASS_D }, { x: 5, y: 1, id: GRASS_L },
            { x: 0, y: 2, id: GRASS_L, monster: MONSTER }, { x: 1, y: 2, id: GRASS_D, tree: TREE }, { x: 2, y: 2, id: GRASS_L }, { x: 3, y: 2, id: GRASS_D }, { x: 4, y: 2, id: GRASS_L }, { x: 5, y: 2, id: GRASS_D },
            { x: 0, y: 3, id: GRASS_D }, { x: 1, y: 3, id: GRASS_L }, { x: 2, y: 3, id: GRASS_D }, { x: 3, y: 3, id: GRASS_L, wall: WALL_LEFT }, { x: 4, y: 3, id: GRASS_D, wall: WALL_MIDDLE }, { x: 5, y: 3, id: GRASS_L, wall: WALL_RIGHT },
            { x: 0, y: 4, id: GRASS_L }, { x: 1, y: 4, id: GRASS_D }, { x: 2, y: 4, id: GRASS_L, tree: TREE }, { x: 3, y: 4, id: GRASS_D, tree: TREE }, { x: 4, y: 4, id: GRASS_L }, { x: 5, y: 4, id: GRASS_D, equipment: KILL_DARGON_KNIFE },
            { x: 0, y: 5, id: GRASS_D }, { x: 1, y: 5, id: GRASS_L }, { x: 2, y: 5, id: GRASS_D }, { x: 3, y: 5, id: GRASS_L }, { x: 4, y: 5, id: GRASS_D }, { x: 5, y: 5, id: GRASS_L }
        ];
        _this.equipmentConfig = {};
        _this.npcConfig = {};
        _this.monsterConfig = {};
        _this.tileContainer = new DisplayObjectContainer(0, 0);
        _this.itemContainer = new DisplayObjectContainer(0, 0);
        _this.roleContainer = new DisplayObjectContainer(0, 0);
        _this.addChild(_this.tileContainer);
        _this.addChild(_this.itemContainer);
        _this.addChild(_this.roleContainer);
        _this.init();
        return _this;
    }
    // 好像只调用了一次…… 初始化……
    GameMap.prototype.init = function () {
        this.grid = new astar.Grid(COL_NUM, ROW_NUM);
        for (var _i = 0, _a = this.config; _i < _a.length; _i++) {
            var item = _a[_i];
            var img = item.id == GRASS_L ? grassLight : grassDark;
            var tile = new Bitmap(TILE_SIZE * item.x, TILE_SIZE * item.y, img);
            this.grid.setWalkable(item.x, item.y, true);
            this.tileContainer.addChild(tile);
            if (item.tree) {
                var tile_1 = new Bitmap(TILE_SIZE * item.x, TILE_SIZE * item.y, tree);
                this.grid.setWalkable(item.x, item.y, false);
                this.tileContainer.addChild(tile_1);
            }
            if (item.wall) {
                var img_1 = item.wall == WALL_MIDDLE ? wall_middle : (item.wall == WALL_LEFT ? wall_left : wall_right);
                var tile_2 = new Bitmap(TILE_SIZE * item.x, TILE_SIZE * item.y, img_1);
                this.grid.setWalkable(item.x, item.y, false);
                this.tileContainer.addChild(tile_2);
            }
            if (item.equipment) {
                // const tile = new Bitmap(TILE_SIZE * item.x, TILE_SIZE * item.y, knife);
                // this.addChild(tile);
                var equipmentView = new Bitmap(TILE_SIZE * item.x, TILE_SIZE * item.y, knife);
                var equipmentTiem = new Equipment();
                equipmentTiem.view = equipmentView;
                equipmentTiem.name = '屠龙刀';
                equipmentTiem.attack = 35;
                equipmentTiem.x = item.x;
                equipmentTiem.y = item.y;
                var key = item.x + '_' + item.y;
                this.equipmentConfig[key] = equipmentTiem;
                this.itemContainer.addChild(equipmentView);
            }
            if (item.monster) {
                var monsterView = new Bitmap(TILE_SIZE * item.x, TILE_SIZE * item.y, captain);
                var monsterItem = new Monster();
                monsterItem.name = '队长';
                monsterItem.view = monsterView;
                monsterItem.hp = 120;
                monsterItem.x = item.x;
                monsterItem.y = item.y;
                var key = item.x + '_' + item.y;
                this.monsterConfig[key] = monsterItem;
                this.roleContainer.addChild(monsterView);
            }
            if (item.npc) {
                var npcView = new Bitmap(TILE_SIZE * item.x, TILE_SIZE * item.y, gjl);
                var npcItem = new Npc(1, 'DDF'); // TODO
                npcItem.view = npcView;
                npcItem.x = item.x;
                npcItem.y = item.y;
                var key = item.x + '_' + item.y;
                this.npcConfig[key] = npcItem;
                this.roleContainer.addChild(npcView);
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
    GameMap.prototype.getEquipmentInfo = function (row, col) {
        var key = row + '_' + col;
        return this.equipmentConfig[key];
    };
    GameMap.prototype.getNpcInfo = function (row, col) {
        var key = row + '_' + col;
        return this.npcConfig[key];
    };
    GameMap.prototype.getMonsterInfo = function (row, col) {
        var key = row + '_' + col;
        return this.monsterConfig[key];
    };
    GameMap.prototype.deleteEquipment = function (equipment) {
        var key = equipment.x + '_' + equipment.y;
        delete this.equipmentConfig[key];
        this.deleteChild(equipment.view);
    };
    GameMap.prototype.deleteMonster = function (monster) {
        var key = monster.x + '_' + monster.y;
        delete this.monsterConfig[key];
        this.deleteChild(monster.view);
    };
    return GameMap;
}(DisplayObjectContainer));
