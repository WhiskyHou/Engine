/**
 * 资源载入
 */
var van_pick_knife = document.getElementById('van_pick_knife') as HTMLAudioElement;
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
const TILE_SIZE = 128;

const ROW_NUM = 6;
const COL_NUM = 6;

const GRASS_L = 0;
const GRASS_D = 1;
const TREE = 2;
const WALL_LEFT = 3;
const WALL_MIDDLE = 4;
const WALL_RIGHT = 5;
const KILL_DARGON_KNIFE = 6;

const PLAYER_INDEX_X = 0;
const PLAYER_INDEX_Y = 0;
const PLAYER_WALK_SPEED = 500;


var player: User;
var map: GameMap;




/**
 * 开始状态
 */
class MenuState extends State {
    title: TextField;

    constructor() {
        super();
        this.title = new TextField('点击开始游戏', 200, 300, 60);
    }

    onEnter(): void {
        stage.addChild(this.title);
        stage.addEventListener("onClick", this.onClick);
    }
    onUpdate(): void {

    }
    onExit(): void {
        console.log('Login State onExit');
        stage.deleteAllEventListener();
        stage.deleteAll();
        // this.onCreatePlayer();
    }

    onCreatePlayer() {
        player = new User();
        player.level = 1;
        player.name = 'Van';
        player.x = PLAYER_INDEX_X;
        player.y = PLAYER_INDEX_Y;
        player.view = new Bitmap(PLAYER_INDEX_X, PLAYER_INDEX_Y, van1);
    }

    onClick = (eventData: any) => {
        // 这里不调用onExit的话，状态机里面调用onExit还没反应，就提示游戏状态的角色名字未定义
        // 如果这里就调用onExit的话，那么状态机里的onExit也会调用成功
        // this.onExit();

        this.onCreatePlayer();
        fsm.replaceState(new PlayingState());
    }
}


/**
 * 游戏状态
 */
class PlayingState extends State {
    bg: Bitmap;
    userInfoUI: UserInfoUI;

    gameContainer: DisplayObjectContainer;
    missionContainer: DisplayObjectContainer;

    constructor() {
        super();

        map = new GameMap();
        this.bg = new Bitmap(0, 0, bg);
        this.userInfoUI = new UserInfoUI(0, TILE_SIZE * 6);

        this.gameContainer = new DisplayObjectContainer(16, 6);
        this.missionContainer = new DisplayObjectContainer(800, 200);
    }

    onEnter(): void {
        stage.addChild(this.bg);
        stage.addChild(this.gameContainer);
        stage.addChild(this.missionContainer);

        this.gameContainer.addChild(map);
        this.gameContainer.addChild(player.view);
        this.gameContainer.addChild(this.userInfoUI);



        // 给map添加监听器
        // 鼠标点击到map容器上了，监听器就执行到目标点的走路命令
        map.addEventListener('onClick', (eventData: any) => {
            if (player.moveStatus) {
                const globalX = eventData.globalX;
                const globalY = eventData.globalY;
                const localPos = map.getLocalPos(new math.Point(globalX, globalY));

                // 确定被点击的格子位置
                const row = Math.floor(localPos.x / TILE_SIZE);
                const col = Math.floor(localPos.y / TILE_SIZE);

                // 添加行走命令
                const walk = new WalkCommand(player.x, player.y, row, col);
                commandPool.addCommand(walk);

                // 获取被点击格子的装备信息 如果有东西的话 就添加一个拾取命令
                const equipmentInfo = map.getEquipmentInfo(row, col);
                if (equipmentInfo) {
                    const pick = new PickCommand(equipmentInfo);
                    commandPool.addCommand(pick);
                }

                player.moveStatus = false;

                // 执行命令池的命令
                commandPool.execute();
            }
        });


        // 给player数据模型添加监听器，走路命令中每走一格，向监听器报告一次新位置
        player.addEventListener('walkOneStep', (eventData: any) => {
            const targetX = eventData.nodeX * TILE_SIZE;
            const targetY = eventData.nodeY * TILE_SIZE;
            player.x = eventData.nodeX;
            player.y = eventData.nodeY;
        });


        this.changePlayerViewPosture();
    }
    onUpdate(): void {
        // this.playerViewMove();
        player.update();
    }
    onExit(): void {
        stage.deleteAll();
        this.gameContainer.deleteAll();
    }

    // 角色原地动画
    changePlayerViewPosture() {
        setTimeout(() => {
            player.view.img = (player.view.img == van1) ? van2 : van1;
            this.changePlayerViewPosture();
        }, 600);
    }

}


/**
 * 游戏地图容器
 */
class GameMap extends DisplayObjectContainer {
    grid: astar.Grid;

    config = [
        { x: 0, y: 0, id: GRASS_L }, { x: 1, y: 0, id: GRASS_D }, { x: 2, y: 0, id: GRASS_L }, { x: 3, y: 0, id: GRASS_D }, { x: 4, y: 0, id: GRASS_L }, { x: 5, y: 0, id: GRASS_D },
        { x: 0, y: 1, id: GRASS_D, wall: WALL_LEFT }, { x: 1, y: 1, id: GRASS_L, wall: WALL_MIDDLE }, { x: 2, y: 1, id: GRASS_D, wall: WALL_MIDDLE }, { x: 3, y: 1, id: GRASS_L, wall: WALL_RIGHT }, { x: 4, y: 1, id: GRASS_D }, { x: 5, y: 1, id: GRASS_L },
        { x: 0, y: 2, id: GRASS_L }, { x: 1, y: 2, id: GRASS_D, tree: TREE }, { x: 2, y: 2, id: GRASS_L }, { x: 3, y: 2, id: GRASS_D }, { x: 4, y: 2, id: GRASS_L }, { x: 5, y: 2, id: GRASS_D },
        { x: 0, y: 3, id: GRASS_D }, { x: 1, y: 3, id: GRASS_L }, { x: 2, y: 3, id: GRASS_D }, { x: 3, y: 3, id: GRASS_L, wall: WALL_LEFT }, { x: 4, y: 3, id: GRASS_D, wall: WALL_MIDDLE }, { x: 5, y: 3, id: GRASS_L, wall: WALL_RIGHT },
        { x: 0, y: 4, id: GRASS_L }, { x: 1, y: 4, id: GRASS_D }, { x: 2, y: 4, id: GRASS_L, tree: TREE }, { x: 3, y: 4, id: GRASS_D, tree: TREE }, { x: 4, y: 4, id: GRASS_L }, { x: 5, y: 4, id: GRASS_D, equipment: KILL_DARGON_KNIFE },
        { x: 0, y: 5, id: GRASS_D }, { x: 1, y: 5, id: GRASS_L }, { x: 2, y: 5, id: GRASS_D }, { x: 3, y: 5, id: GRASS_L }, { x: 4, y: 5, id: GRASS_D }, { x: 5, y: 5, id: GRASS_L }
    ]

    private equipmentConfig: { [index: string]: Equipment } = {}
    private npcConfig: { [index: string]: Npc } = {}


    constructor() {
        super(0, 0);

        this.update();
    }
    // 好像只调用了一次…… 初始化……
    update() {
        this.grid = new astar.Grid(COL_NUM, ROW_NUM);

        for (let item of this.config) {
            const img = item.id == GRASS_L ? grassLight : grassDark;
            const tile = new Bitmap(TILE_SIZE * item.x, TILE_SIZE * item.y, img);
            this.grid.setWalkable(item.x, item.y, true);
            this.addChild(tile);

            if (item.tree) {
                const tile = new Bitmap(TILE_SIZE * item.x, TILE_SIZE * item.y, tree);
                this.grid.setWalkable(item.x, item.y, false);
                this.addChild(tile);
            }
            if (item.wall) {
                const img = item.wall == WALL_MIDDLE ? wall_middle : (item.wall == WALL_LEFT ? wall_left : wall_right);
                const tile = new Bitmap(TILE_SIZE * item.x, TILE_SIZE * item.y, img);
                this.grid.setWalkable(item.x, item.y, false);
                this.addChild(tile);
            }
            if (item.equipment) {
                // const tile = new Bitmap(TILE_SIZE * item.x, TILE_SIZE * item.y, knife);
                // this.addChild(tile);

                const equipmentView = new Bitmap(TILE_SIZE * item.x, TILE_SIZE * item.y, knife);
                const equipmentTiem = new Equipment();
                equipmentTiem.view = equipmentView;
                equipmentTiem.name = '屠龙刀'
                equipmentTiem.attack = 35;
                equipmentTiem.x = item.x;
                equipmentTiem.y = item.y;
                const key = item.x + '_' + item.y;
                this.equipmentConfig[key] = equipmentTiem;
                this.addChild(equipmentView);
            }
        }
    }

    getNodeInfo(row: number, col: number) {
        for (let item of this.config) {
            if (item.x == row && item.y == col) {
                return item;
            }
        }
        return null;
    }
    getEquipmentInfo(row: number, col: number) {
        const key = row + '_' + col
        return this.equipmentConfig[key]
    }
    getNpcInfo(row: number, col: number) {
        const key = row + '_' + col;
        return this.npcConfig[key];
    }

    deleteEquipment(equipment: Equipment) {
        const key = equipment.x + '_' + equipment.y;
        delete this.equipmentConfig[key];
        this.deleteChild(equipment.view);
    }
}


/**
 * 任务管理器
 */
class MissionManager extends EventDispatcher {

}




// 鼠标点击事件，捕获所有被点击到的 DisplayObject，并从叶子节点依次向上通知它们的监听器，监听器执行
canvas.onclick = function (event) {
    const globalX = event.offsetX;
    const globalY = event.offsetY;

    let hitResult = stage.hitTest(new math.Point(globalX, globalY));
    if (hitResult) {
        hitResult.dispatchEvent('onClick', { target: hitResult, globalX: globalX, globalY: globalY });
        while (hitResult.parent) {
            // console.log(hitResult);
            hitResult = hitResult.parent;
            hitResult.dispatchEvent('onClick', { target: hitResult, globalX: globalX, globalY: globalY });
        }
    }
}



// 初始状态设置
fsm.replaceState(new MenuState());