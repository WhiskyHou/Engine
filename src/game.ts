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
    text: TextField;

    constructor() {
        super();
        this.text = new TextField('Deep Dark Fantasy', 100, 300, 60);
        map = new GameMap();
    }
    onEnter(): void {
        const role = new Bitmap(0, 0, van);

        stage.addChild(map);
        stage.addChild(this.text);
        stage.addChild(role);
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
        { x: 0, y: 1, id: GRASS_D }, { x: 1, y: 1, id: GRASS_L }, { x: 2, y: 1, id: GRASS_D }, { x: 3, y: 1, id: GRASS_L }, { x: 4, y: 1, id: GRASS_D }, { x: 5, y: 1, id: GRASS_L },
        { x: 0, y: 2, id: GRASS_L }, { x: 1, y: 2, id: GRASS_D }, { x: 2, y: 2, id: GRASS_L }, { x: 3, y: 2, id: GRASS_D }, { x: 4, y: 2, id: GRASS_L }, { x: 5, y: 2, id: GRASS_D },
        { x: 0, y: 3, id: GRASS_D }, { x: 1, y: 3, id: GRASS_L }, { x: 2, y: 3, id: GRASS_D }, { x: 3, y: 3, id: GRASS_L }, { x: 4, y: 3, id: GRASS_D }, { x: 5, y: 3, id: GRASS_L },
        { x: 0, y: 4, id: GRASS_L }, { x: 1, y: 4, id: GRASS_D }, { x: 2, y: 4, id: GRASS_L }, { x: 3, y: 4, id: GRASS_D }, { x: 4, y: 4, id: GRASS_L }, { x: 5, y: 4, id: GRASS_D },
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
        }
    }
}




canvas.onclick = function (event) {
    const globalX = event.offsetX;
    const globalY = event.offsetY;

    let hitResult = stage.hitTest(new math.Point(globalX, globalY));
    if (hitResult) {
        hitResult.dispatchEvent({ target: hitResult, globalX: globalX, globalY: globalY });
        while (hitResult.parent) {
            hitResult = hitResult.parent;
            hitResult.dispatchEvent({ target: hitResult, globalX: globalX, globalY: globalY });
        }
    }
}




fsm.replaceState(new MenuState());