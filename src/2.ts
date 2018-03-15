const stageWidth = 400;
const stageHeight = 600;
const enemyNormalSpeed = 2;
const enemyF22Speed = 4;
const enemySupplySpeed = 1;
const enemyWarshipSpeed = 0.5;


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
    constructor(x: number, y: number, ap: number, speed: number) {
        super(x, y);

    }
}
