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
var gjl = new Image();
gjl.src = './assets/npc.png';
var captain = new Image();
captain.src = './assets/monster.png';
var talk_window = new Image();
talk_window.src = './assets/talkWindow.png';
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
var NPC = 7;
var MONSTER = 8;
var PLAYER_INDEX_X = 0;
var PLAYER_INDEX_Y = 0;
var PLAYER_WALK_SPEED = 500;
var player;
var map;
var missionManager;
var missionTalkCanAcceptConfig = [
    [],
    [
        "欢迎来到新日暮里",
        "你的等级还很低",
        "攻击力也相当低",
        "所以我不能给你任何击杀任务",
        "你先找到屠龙刀再回来找我"
    ],
    [
        "你现在要帮我杀了美队",
        "加油你可以的",
        "杀完回来找我"
    ]
];
var missionTalkCanSubmitConfig = [
    [],
    [
        "恭喜你找到了屠龙刀",
        "给你升一级作为奖励",
        "你被加强了，快送"
    ],
    [
        "非常感谢你替我杀了美队",
        "再奖励你升一级吧",
        "赶快去下一层吧勇士"
    ]
];
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
        stage.addEventListener("onClick", this.onClick);
    };
    MenuState.prototype.onUpdate = function () {
    };
    MenuState.prototype.onExit = function () {
        console.log('Login State onExit');
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
        player.view = new Bitmap(PLAYER_INDEX_X, PLAYER_INDEX_Y, van1);
    };
    return MenuState;
}(State));
var talkUIContainer;
/**
 * 游戏状态
 */
var PlayingState = /** @class */ (function (_super) {
    __extends(PlayingState, _super);
    function PlayingState() {
        var _this = _super.call(this) || this;
        missionManager = new MissionManager();
        map = new GameMap();
        _this.mapContainer = new DisplayObjectContainer(16, 6);
        _this.userUIContainer = new DisplayObjectContainer(16, 6);
        _this.missionUIContainer = new DisplayObjectContainer(16, 6);
        talkUIContainer = new DisplayObjectContainer(16, 6);
        _this.bg = new Bitmap(0, 0, bg);
        _this.userInfoUI = new UserInfoUI(0, TILE_SIZE * 6);
        _this.missionInfoUI = new MissionInfoUI(784, 200);
        return _this;
    }
    PlayingState.prototype.onEnter = function () {
        stage.addChild(this.bg);
        stage.addChild(this.mapContainer);
        stage.addChild(this.userUIContainer);
        stage.addChild(this.missionUIContainer);
        stage.addChild(talkUIContainer);
        this.mapContainer.addChild(map);
        this.mapContainer.addChild(player.view);
        this.userUIContainer.addChild(this.userInfoUI);
        this.missionUIContainer.addChild(this.missionInfoUI);
        // 给map添加监听器 鼠标点击到map容器上了，监听器就执行到目标点的走路命令
        map.addEventListener('onClick', function (eventData) {
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
                // 获取被点击格子的装备信息 如果有东西的话 就添加一个拾取命令
                var equipmentInfo = map.getEquipmentInfo(row, col);
                if (equipmentInfo) {
                    var pick = new PickCommand(equipmentInfo);
                    commandPool.addCommand(pick);
                }
                var npcInfo = map.getNpcInfo(row, col);
                if (npcInfo) {
                    var talk = new TalkCommand(npcInfo);
                    commandPool.addCommand(talk);
                }
                var monsterInfo = map.getMonsterInfo(row, col);
                if (monsterInfo) {
                    var fight = new FightCommand(monsterInfo);
                    commandPool.addCommand(fight);
                }
                player.moveStatus = false;
                // 执行命令池的命令
                commandPool.execute();
            }
        });
        this.changePlayerViewPosture();
    };
    PlayingState.prototype.onUpdate = function () {
        // this.playerViewMove();
        player.update();
        missionManager.update();
    };
    PlayingState.prototype.onExit = function () {
        stage.deleteAll();
        this.mapContainer.deleteAll();
    };
    // 角色原地动画
    PlayingState.prototype.changePlayerViewPosture = function () {
        var _this = this;
        setTimeout(function () {
            player.view.img = (player.view.img == van1) ? van2 : van1;
            _this.changePlayerViewPosture();
        }, 600);
    };
    return PlayingState;
}(State));
// 鼠标点击事件，捕获所有被点击到的 DisplayObject，并从叶子节点依次向上通知监听器，监听器执行
canvas.onclick = function (event) {
    var globalX = event.offsetX;
    var globalY = event.offsetY;
    var hitResult = stage.hitTest(new math.Point(globalX, globalY));
    if (hitResult) {
        hitResult.dispatchEvent('onClick', { target: hitResult, globalX: globalX, globalY: globalY });
        while (hitResult.parent) {
            console.log(hitResult);
            hitResult = hitResult.parent;
            hitResult.dispatchEvent('onClick', { target: hitResult, globalX: globalX, globalY: globalY });
        }
    }
};
// window.onkeydown = function (event) {
//     let key = event.keyCode ? event.keyCode : event.which;
//     missionManager.dispatchEvent("onkeydown_32", null);
//     console.log("空格键");
// }
// 初始状态设置
fsm.replaceState(new MenuState());
