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
 * 全局变量
 */
const stageWidth = 400;
const stageHeight = 600;

const enemyNormalSpeed = 2;
const enemyF22Speed = 4;
const enemySupplySpeed = 1;
const enemyWarshipSpeed = 0.5;

const enemyNormalHp = 2;

const bulletNormalWidth = 4;
const bulletNormalHeight = 20;
const bulletNormalAp = 1;
const bulletSpecialWidth = 6;
const bulletSpecialHeight = 16;

var playerHp = 2;
var playerX = 170;
var playerY = 540;
var fireMode = true;
var fireSwitch = false;


class Enemy extends Bitmap {
    alive: boolean = true;
    hp: number;
    speed: number;

    constructor(x: number, y: number, img: HTMLImageElement, hp: number, speed: number) {
        super(x, y, img);
        this.hp = hp;
        this.speed = speed;
    }

    update() {
        this.y += this.speed;
    }
}


class BulletNormal extends Rectangle {
    alive: boolean = true;
    ap: number;

    constructor(x: number, y: number, width: number, height: number, color: string, ap: number) {
        super(x, y, width, height, color)
        this.ap = ap;
    }

    update() {
        this.y -= 10;
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
    title: TextField;
    tip: TextField;
    next: TextField;
    bg: Bitmap;

    constructor() {
        super();
        this.title = new TextField("飞机Dark战", 90, 120, 40);
        this.tip = new TextField("鼠标控制移动，空格开火，Z键切换模式", 20, 400, 20);
        this.next = new TextField("点击鼠标开始游戏", 120, 500, 20);
        this.bg = new Bitmap(0, 0, bg);
    }

    onEnter(): void {
        const container = new DisplayObjectContainer(0, 0);
        stage.addChild(container);

        container.addChild(this.bg);
        container.addChild(this.tip);
        container.addChild(this.next);
        container.addChild(this.title);
    }
    onUpdate(): void {
        // console.log(this.title);
    }
    onExit(): void {
        stage.deleteChild(this.title);
        stage.deleteChild(this.bg);
        stage.deleteChild(this.bg);
    }
}


class PlayingState extends State {
    enemyList: Enemy[] = [];
    bulletList: BulletNormal[] = [];
    player: Player;
    bg: Bitmap;

    constructor() {
        super();
        this.player = new Player(170, 540, player);
        this.bg = new Bitmap(0, 0, bg);
    }

    onEnter(): void {
        const container = new DisplayObjectContainer(0, 0);
        stage.addChild(container);
        container.addChild(this.bg);
        container.addChild(this.player);
    }
    onUpdate(): void {
        this.player.x = playerX;
        this.player.y = playerY;

        for (let bullet of this.bulletList)
            bullet.update();
        for (let enemy of this.enemyList)
            enemy.update();


    }
    onExit(): void {

    }

    fire() {

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

canvas.onmousemove = function (event) {
    var x = event.offsetX - 30;
    var y = event.offsetY - 30;

    if (x >= 0 && x <= 340)
        playerX = x;
    if (y >= 0 && y <= 540)
        playerY = y;
}

canvas.onclick = function (event) {
    // const offsetX = event.offsetX;
    // const offsetY = event.offsetY;

    // const hitResult = stage.hitTest(new math.Point(offsetX, offsetY));
    // if (hitResult)
    //     hitResult.dispatchEvent();

    fsm.replaceState(new PlayingState());
}

window.onkeydown = function (event) {
    var key = event.keyCode ? event.keyCode : event.which;
    if (90 === key) {
        fireMode = !fireMode;
    }
    else if (32 === key) {
        fireSwitch = !fireSwitch;
    }
}



function enterFrame() {
    if (!context)
        return;
    onTicker(context);
    requestAnimationFrame(enterFrame);
}
requestAnimationFrame(enterFrame);

