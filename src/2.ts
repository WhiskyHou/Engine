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


/**
 * 敌人
 */
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
        if (this.hp <= 0) {
            this.alive = false;
        }
    }
}


/**
 * 子弹
 */
class Bullet extends Rectangle {
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


/**
 * 玩家
 */
class Player extends Bitmap {
    alive: boolean = true;
    fire: boolean = false;
    fireMode: boolean = true;
    hp: number = playerHp;
    score: number = 0;

    constructor(x: number, y: number, img: HTMLImageElement) {
        super(x, y, img);
    }
}


/**
 * 状态 —— 菜单界面
 */
class MenuState extends State {
    id: number = 0;
    title: TextField;
    tip: TextField;
    next: TextField;
    bg: Bitmap;

    container: DisplayObjectContainer;

    constructor() {
        super();
        this.title = new TextField("飞机Dark战", 90, 120, 40);
        this.tip = new TextField("鼠标控制移动，空格开火，Z键切换模式", 20, 400, 20);
        this.next = new TextField("点击鼠标开始游戏", 120, 500, 20);
        this.bg = new Bitmap(0, 0, bg);

        this.container = new DisplayObjectContainer(0, 0);
    }

    onEnter(): void {
        stage.addChild(this.container);
        this.container.addChild(this.bg);
        this.container.addChild(this.tip);
        this.container.addChild(this.next);
        this.container.addChild(this.title);
    }
    onUpdate(): void {
        // console.log(this.title);
    }
    onExit(): void {
        // this.container.deleteAll();
        stage.deleteAll();
    }
}


/**
 * 状态 —— 游戏界面
 */
class PlayingState extends State {
    id: number = 1;
    enemyList: Enemy[] = [];
    bulletList: Bullet[] = [];
    player: Player;
    bg: Bitmap;
    fireMode: TextField;
    score: TextField;
    playerHp: TextField;

    container: DisplayObjectContainer;
    bulletContainer: DisplayObjectContainer;
    enemyContainer: DisplayObjectContainer;
    menuContainer: DisplayObjectContainer;

    constructor() {
        super();

        this.player = new Player(170, 540, player);
        this.bg = new Bitmap(0, 0, bg);
        this.fireMode = new TextField("普通弹药", 20, 0, 24);
        this.score = new TextField("得分:0", 160, 0, 24);
        this.playerHp = new TextField("HP:2", 320, 0, 24);

        this.container = new DisplayObjectContainer(0, 0);
        this.bulletContainer = new DisplayObjectContainer(0, 0);
        this.enemyContainer = new DisplayObjectContainer(0, 0);
        this.menuContainer = new DisplayObjectContainer(0, 560);
    }

    onEnter(): void {
        stage.addChild(this.container);
        stage.addChild(this.bulletContainer);
        stage.addChild(this.enemyContainer);
        stage.addChild(this.menuContainer);
        this.container.addChild(this.bg);
        this.container.addChild(this.player);
        this.menuContainer.addChild(this.fireMode);
        this.menuContainer.addChild(this.score);
        this.menuContainer.addChild(this.playerHp);

        setInterval(() => this.fire(), 1000);
        setInterval(() => this.swapEnemy(), 1000);
    }
    onUpdate(): void {
        // 更新玩家信息
        this.player.fireMode = fireMode;
        if (this.player.parent) {
            var playerPos = this.player.parent.getLocalPos(new math.Point(playerX, playerY));
            this.player.x = playerPos.x;
            this.player.y = playerPos.y;
        }
        // this.player.x = playerX;
        // this.player.y = playerY;    不能直接给赋值全局坐标！！！！


        // 更新每个子弹和敌人的信息
        for (let bullet of this.bulletList)
            bullet.update();
        for (let enemy of this.enemyList)
            enemy.update();


        // 更新渲染节点下挂的子弹节点
        this.bulletContainer.deleteAll();
        for (let bullet of this.bulletList) {
            this.bulletContainer.addChild(bullet);
        }


        // 更新渲染节点下挂的敌人节点
        this.enemyContainer.deleteAll();
        for (let enemy of this.enemyList) {
            this.bulletContainer.addChild(enemy);
        }

        // 检测碰撞！！！
        // 有问题啊！！！！！！！！
        // 天啊！！理了一个小时逻辑了没错啊！！！！！！
        this.checkKnock();


        this.clearList();


        // 更新菜单UI信息
        this.fireMode.text = this.player.fireMode ? "普通弹药" : "特殊弹药";
        this.score.text = "得分:" + this.player.score.toString();
        this.playerHp.text = "HP:" + this.player.hp.toString();
    }
    onExit(): void {

    }

    fire() {
        if (fireSwitch) {
            if (fireMode) {
                /**
                 * 这里有问题！！
                 * 
                 * 按照和飞机坐标一样的设置，位置会翻倍
                 * 输出信息的时候，子弹的x是180，但是实际渲染的x是360
                 */
                var pos = this.bulletContainer.getLocalPos(new math.Point(playerX + 28, playerY));
                var bulletNormal = new Bullet(pos.x / 2, pos.y / 2, bulletNormalWidth, bulletNormalHeight, 'red', 1);
                bulletNormal.addEventListener(() => {
                    bulletNormal.alive = false;
                    console.log("biu");
                })
                this.bulletList.push(bulletNormal);
                // console.log(bulletNormal);
            }
            else {

            }
        }
    }

    swapEnemy() {
        let x = this.getRandomPos();
        var temp = new Enemy(x, -60, enemy_normal, enemyNormalHp, enemyNormalSpeed);
        temp.addEventListener(() => {
            temp.hp--;
            // temp.alive = false;
            console.log("click--");
        });
        this.enemyList.push(temp);
    }

    getRandomPos(): number {
        var x = Math.floor(Math.random() * 341);
        return x;
    }

    checkKnock() {
        for (let bullet of this.bulletList) {
            // 还是上面生成子弹时候的问题，子弹实际位置和渲染位置不同，为了让碰撞检测和看到的画面一致，这里得*2
            var x = bullet.x * 2 + bulletNormalWidth / 2;
            var y = bullet.y * 2;

            var result = stage.hitTest(new math.Point(x, y));
            if (result != null) {
                result.dispatchEvent();
                // 这里如果让子弹执行回调函数的话，刚发射就触发了，这就很烦
                // bullet.dispatchEvent();
            }
        }

        // // 必须要用 stage.hitTest() , this.enemyContainer.hitTest() 就不行！！！
        // var result = stage.hitTest(new math.Point(playerX + 30, playerY + 30));
        // if (result != null)
        //     result.dispatchEvent();
        // for (var i = 0; i < this.enemyList.length; i++) {
        //     if (!this.enemyList[i].alive) {
        //         this.enemyList.splice(i);
        //         i--;
        //     }
        // }

    }

    clearList() {
        for (var i = 0; i < this.bulletList.length; i++) {
            if (!this.bulletList[i].alive) {
                this.bulletList.splice(i);
                i--;
            }
        }
        for (var i = 0; i < this.enemyList.length; i++) {
            if (!this.enemyList[i].alive) {
                this.enemyList.splice(i);
                i--;
            }
        }
    }

}



const stage = new Stage();
var fsm = new StateMachine();
fsm.replaceState(new MenuState());


/**
 * 心跳控制器
 */
function onTicker(context: CanvasRenderingContext2D) {
    fsm.update();
    context.clearRect(0, 0, stageWidth, stageHeight);
    context.save();
    stage.draw(context);
    context.restore();
}


/**
 * 事件处理
 */
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

    let state = fsm.getCurrentState();
    if (state != null) {
        if (state.id != 1) {
            fsm.replaceState(new PlayingState());
        }
    }
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


/**
 * 主循环
 */
function enterFrame() {
    if (!context)
        return;
    onTicker(context);
    requestAnimationFrame(enterFrame);
}
requestAnimationFrame(enterFrame);
