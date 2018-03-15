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



/**
 * 显示对象
 * 
 * 以及其子类
 */
abstract class DisplayObject {
    public x: number;
    public y: number;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
    abstract render(context: CanvasRenderingContext2D): void;
}

class Enemy extends DisplayObject {
    public alive: boolean;
    public hp: number;
    public img: HTMLImageElement;
    public width: number;
    public height: number;
    public speed: number;
    constructor(x: number, y: number, hp: number, img: HTMLImageElement, speed: number) {
        super(x, y);
        this.alive = true;
        this.hp = hp;
        this.img = img;
        this.width = img.width;
        this.height = img.height;
        this.speed = speed;
    }
    move() {
        this.y += this.speed;
    }
    render(context: CanvasRenderingContext2D) {
        context.drawImage(this.img, this.x, this.y);
    }
}

class Player extends DisplayObject {
    public alive: boolean;
    public hp: number;
    public img: HTMLImageElement;
    public width: number;
    public height: number;
    constructor(x: number, y: number, hp: number, img: HTMLImageElement) {
        super(x, y);
        this.alive = true;
        this.hp = hp;
        this.img = img;
        this.width = img.width;
        this.height = img.height;
    }
    render(context: CanvasRenderingContext2D) {
        context.drawImage(this.img, this.x, this.y);
    }
}

class Bullet extends DisplayObject {
    public width: number;
    public height: number;
    public ap: number;
    public speed: number;
    public color: string
    constructor(x: number, y: number, width: number, height: number, ap: number, speed: number, color: string) {
        super(x, y);
        this.width = width;
        this.height = height;
        this.ap = ap;
        this.speed = speed;
        this.color = color;
    }
    move() {
        this.y -= this.speed;
    }
    render(context: CanvasRenderingContext2D) {
        context.beginPath();
        context.fillStyle = this.color;
        context.fillRect(this.x, this.y, this.width, this.height);
        context.fill();
        context.closePath();
    }
}

class TextField extends DisplayObject {
    public content: string;
    public size: number;
    public color: string;
    constructor(x: number, y: number, content: string, size: number, color: string) {
        super(x, y);
        this.content = content;
        this.size = size;
        this.color = color;
    }
    render(context: CanvasRenderingContext2D) {
        context.beginPath();
        context.fillStyle = this.color;
        context.font = this.size + 'px Arial';
        context.fillText(this.content, this.x, this.y);
        context.closePath();
    }
}

class Img extends DisplayObject {
    public img: HTMLImageElement;
    public width: number;
    public height: number;
    constructor(x: number, y: number, img: HTMLImageElement, width: number, height: number) {
        super(x, y);
        this.img = img;
        this.width = width;
        this.height = height;
    }
    render(context: CanvasRenderingContext2D) {
        context.drawImage(this.img, 0, 0);
    }
}


/**
 * 状态机
 * 
 */
class StateMachine {
    private currentState?: State;
    replaceState(state: State) {
        if (this.currentState) {
            this.currentState.onExit();
        }
        this.currentState = state;
        this.currentState.onEnter();
    }
    update() {
        if (this.currentState) {
            this.currentState.onUpdate();
        }
    }
    // onClick() {
    //     if (this.currentState)
    //         if(this.currentState.on)    
    // }
}


/**
 * 状态
 * 
 * 以及其子类
 */
class State {
    onEnter() {
    }
    onUpdate() {
    }
    onExit() {
    }
}

class BeginState extends State {
    count: number;
    titleContents: string[];
    title: TextField;
    tip: TextField;
    constructor() {
        super();
        this.count = 0;
        this.titleContents = ['飞机Dark战', '操作说明——', '鼠标控制飞机移动', '空格键 开火/停火', 'Z 键切换开火模式'];
        this.title = new TextField(90, 120, '飞机Dark战', 40, 'black');
        this.tip = new TextField(120, 500, '点击进行下一步', 18, 'black');;
    }
    onEnter() {
        // const title = new TextField(90, 120, '飞机Dark战', 40, 'black');
        // const tip = new TextField(120, 500, '按 Y 进行下一步', 18, 'black');
        stage.renderList = [this.title, this.tip];
    }
    onUpdate() {
    }
    onClick(): boolean {
        this.count++;
        this.title.content = this.titleContents[this.count];
        if (4 === this.count)
            return true;
        return false;

    }
}

class PlayState extends State {
    bg: DisplayObject;
    constructor() {
        super();
        this.bg = new Img(0, 0, bg, stageWidth, stageHeight);
    }
    onEnter() {
        stage.renderList = [this.bg];
    }
}



/**
 * 舞台
 */
class Stage {
    renderList: DisplayObject[] = [];
}


var stage = new Stage();
var fsm = new StateMachine();
fsm.replaceState(new BeginState());

window.onclick = function () {
    fsm.replaceState(new PlayState());
}

function onTicker(context: CanvasRenderingContext2D) {
    fsm.update();
    context.clearRect(0, 0, stageWidth, stageHeight);
    const renderList = stage.renderList;
    for (let render of renderList) {
        render.render(context);
    }
}

function enterFrame() {
    if (!context)
        return;
    onTicker(context);
    requestAnimationFrame(enterFrame);
}
requestAnimationFrame(enterFrame);