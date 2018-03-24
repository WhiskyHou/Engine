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
const ITEM_SIZE = 128;

const ROW_NUM = 6;
const COL_NUM = 6;

const GRASS_L = 0;
const GRASS_D = 1;
const TREE = 2;
const WALL_LEFT = 3;
const WALL_MIDDLE = 4;
const WALL_RIGHT = 5;
const KILL_DARGON_KNIFE = 6;


var player: User;
var map: GameMap;




/**
 * 开始状态
 */
class MenuState extends State {
    title: TextField;

    constructor() {
        super();
        this.title = new TextField('点击开始游戏', 300, 300, 60);
    }

    onEnter(): void {
        stage.addChild(this.title);
        stage.addEventListener(this.onClick);
    }
    onUpdate(): void {

    }
    onExit(): void {
        stage.deleteAllEventListener();
        stage.deleteAll();

        player = new User();
        player.level = 1;
        player.name = 'Van';
    }

    onClick = (eventData: any) => {
        fsm.replaceState(new PlayingState());
    }
}


/**
 * 游戏状态
 */
class PlayingState extends State {
    role: Bitmap;

    constructor() {
        super();
        map = new GameMap();
        this.role = new Bitmap(0, 0, van);
    }
    onEnter(): void {
        stage.addChild(map);
        stage.addChild(this.role);

        map.addEventListener((eventData: any) => {
            const globalX = eventData.globalX;
            const globalY = eventData.globalY;
            const localPos = map.getLocalPos(new math.Point(globalX, globalY));

            const row = Math.floor(localPos.x / ITEM_SIZE);
            const col = Math.floor(localPos.y / ITEM_SIZE);

            const walk = new WalkCommand(row, col);
            commandPool.addCommand(walk);

            const nodeInfo = map.getNodeInfo(row, col);
            if (nodeInfo && nodeInfo.equipment) {
                const weapon = new Equipment();
                weapon.name = "屠龙宝刀";
                weapon.attack = 20;

                const pick = new PickCommand(weapon);
                commandPool.addCommand(pick);
            }

            commandPool.execute();
            console.log(map.grid.toString());
        })
    }
    onUpdate(): void {

    }
    onExit(): void {
    }
}



class GameMap extends DisplayObjectContainer {
    grid: astar.Grid;

    private config = [
        { x: 0, y: 0, id: GRASS_L }, { x: 1, y: 0, id: GRASS_D }, { x: 2, y: 0, id: GRASS_L }, { x: 3, y: 0, id: GRASS_D }, { x: 4, y: 0, id: GRASS_L }, { x: 5, y: 0, id: GRASS_D },
        { x: 0, y: 1, id: GRASS_D, wall: WALL_LEFT }, { x: 1, y: 1, id: GRASS_L, wall: WALL_MIDDLE }, { x: 2, y: 1, id: GRASS_D, wall: WALL_MIDDLE }, { x: 3, y: 1, id: GRASS_L, wall: WALL_RIGHT }, { x: 4, y: 1, id: GRASS_D }, { x: 5, y: 1, id: GRASS_L },
        { x: 0, y: 2, id: GRASS_L }, { x: 1, y: 2, id: GRASS_D, tree: TREE }, { x: 2, y: 2, id: GRASS_L }, { x: 3, y: 2, id: GRASS_D }, { x: 4, y: 2, id: GRASS_L }, { x: 5, y: 2, id: GRASS_D },
        { x: 0, y: 3, id: GRASS_D }, { x: 1, y: 3, id: GRASS_L }, { x: 2, y: 3, id: GRASS_D }, { x: 3, y: 3, id: GRASS_L, wall: WALL_LEFT }, { x: 4, y: 3, id: GRASS_D, wall: WALL_MIDDLE }, { x: 5, y: 3, id: GRASS_L, wall: WALL_RIGHT },
        { x: 0, y: 4, id: GRASS_L }, { x: 1, y: 4, id: GRASS_D }, { x: 2, y: 4, id: GRASS_L, tree: TREE }, { x: 3, y: 4, id: GRASS_D, tree: TREE }, { x: 4, y: 4, id: GRASS_L }, { x: 5, y: 4, id: GRASS_D, equipment: KILL_DARGON_KNIFE },
        { x: 0, y: 5, id: GRASS_D }, { x: 1, y: 5, id: GRASS_L }, { x: 2, y: 5, id: GRASS_D }, { x: 3, y: 5, id: GRASS_L }, { x: 4, y: 5, id: GRASS_D }, { x: 5, y: 5, id: GRASS_L }
    ]

    constructor() {
        super(0, 0);
        this.grid = new astar.Grid(COL_NUM, ROW_NUM);

        for (let item of this.config) {
            const img = item.id == GRASS_L ? grassLight : grassDark;
            const tile = new Bitmap(ITEM_SIZE * item.x, ITEM_SIZE * item.y, img);
            this.grid.setWalkable(item.x, item.y, true);
            this.addChild(tile);

            if (item.tree) {
                const tile = new Bitmap(ITEM_SIZE * item.x, ITEM_SIZE * item.y, tree);
                this.grid.setWalkable(item.x, item.y, false);
                this.addChild(tile);
            }
            if (item.wall) {
                const img = item.wall == WALL_MIDDLE ? wall_middle : (item.wall == WALL_LEFT ? wall_left : wall_right);
                const tile = new Bitmap(ITEM_SIZE * item.x, ITEM_SIZE * item.y, img);
                this.grid.setWalkable(item.x, item.y, false);
                this.addChild(tile);
            }
            if (item.equipment) {
                const tile = new Bitmap(ITEM_SIZE * item.x, ITEM_SIZE * item.y, knife);
                // this.grid.setWalkable(item.x, item.y, false);
                this.addChild(tile);
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
}




canvas.onclick = function (event) {
    const globalX = event.offsetX;
    const globalY = event.offsetY;

    let hitResult = stage.hitTest(new math.Point(globalX, globalY));
    if (hitResult) {
        hitResult.dispatchEvent({ target: hitResult, globalX: globalX, globalY: globalY });
        while (hitResult.parent) {
            // console.log(hitResult);
            hitResult = hitResult.parent;
            hitResult.dispatchEvent({ target: hitResult, globalX: globalX, globalY: globalY });
        }
    }
}




fsm.replaceState(new MenuState());