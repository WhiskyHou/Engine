/**
 * 初始化Canvas
 * 加载资源文件
 */
var canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
var context = canvas.getContext("2d");
var player = new Image();
player.src = './assets/player_60.png';
var bg = new Image();
bg.src = './assets/bg_400_600.jpg';
var enemy_normal = new Image();
enemy_normal.src = './assets/enemy_60.png';
var enemy_f22 = new Image();
enemy_f22.src = './assets/enemy_80.png';
var enemy_warship = new Image();
enemy_warship.src = './assets/enemy_160_300.png';
var enemy_supply = new Image();
enemy_supply.src = './assets/enemy_100.png';
var supply = new Image();
supply.src = './assets/supply_100.png';



/**
 * 常量
 * 
 */
const stageWidth = 400;
const stageHeight = 600;

const enemyNormalSpeed = 2;
const enemyF22Speed = 4;
const enemySupplySpeed = 1;
const enemyWarshipSpeed = 0.5;

const bulletNormalWidth = 4;
const bulletNormalHeight = 20;
const bulletSpecialWidth = 6;
const bulletSpecialHeight = 16;

const playerHp = 2;



class Enemy extends Bitmap {
    alive: boolean = true;
    hp: number;

    constructor(x: number, y: number, img: HTMLImageElement, hp: number) {
        super(x, y, img);
        this.hp = hp;
    }
}


class BulletNormal extends Rectangle {
    alive: boolean = true;
    ap: number;

    constructor(x: number, y: number, width: number, height: number, color: string, ap: number) {
        super(x, y, width, height, color)
        this.ap = ap;
    }
}


class Player extends Bitmap {
    alive: boolean = true;
    fire: boolean = false;
    fireMode: number = 1;
    hp: number = playerHp;

    constructor(x: number, y: number, img: HTMLImageElement) {
        super(x, y, img);
    }
}


class MenuState extends State {
    title?: TextField;
    bg?: Bitmap;

    onEnter(): void {
        this.title = new TextField("飞机Dark战", 80, 120, 40);
        this.bg = new Bitmap(0, 0, bg)
        const container = new DisplayObjectContainer(0, 0);
        container.addChild(this.bg);
        container.addChild(this.title);
        stage.addChild(container);
    }
    onUpdate(): void {
        // console.log(this.title);
    }
    onExit(): void {

    }
}


class PlayingState extends State {
    onEnter(): void {

    }
    onUpdate(): void {

    }
    onExit(): void {

    }
}



const stage = new Stage();
var fsm = new StateMachine();
fsm.replaceState(new MenuState());



function onTicker(context: CanvasRenderingContext2D) {
    fsm.update();
    context.clearRect(0, 0, stageWidth, stageHeight);
    context.save();
    stage.draw(context);
    context.restore();
}


function enterFrame() {
    if (!context)
        return;
    onTicker(context);
    requestAnimationFrame(enterFrame);
}
requestAnimationFrame(enterFrame);

