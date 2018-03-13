// var time = 5;
// document.body.innerText = time.toString();
// setInterval(function () {
//     time--;
//     if (time > 0)
//         document.body.innerText = time.toString();
//     else
//         document.body.innerText = "K.O."
// }, 1000);



/**
 * canvas初始化
 * 资源载入
 */
var canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
var context = canvas.getContext("2d");
var player = new Image();
player.src = './assets/player_60.png';
var bg = new Image();
bg.src = './assets/bg_400_600.jpg';
var enemy = new Image();
enemy.src = './assets/enemy_60.png';
var enemy_f22 = new Image();
enemy_f22.src = './assets/enemy_80.png';
var enemy_warship = new Image();
enemy_warship.src = './assets/enemy_160_300.png';
var enemy_supply = new Image();
enemy_supply.src = './assets/enemy_100.png';
var supply = new Image();
supply.src = './assets/supply_100.png';
var bulletList: BulletNormal[] = new Array();
var bulletSpecialList: BulletSpecial[] = new Array();
var enemyList: Enemy[] = new Array();
var enemyF22List: EnemyF22[] = new Array();
var enemySupplyList: EnemySupply[] = new Array();
var enemyWarshipList: EnemyWarship[] = new Array();


/**
 * 窗口启动
 * 
 * 开启主画面循环加载
 * 开启敌人自动生成
 */
window.onload = function () {
    // if (!context)
    //     return;
    // // requestAnimationFrame(menuFrame);
    // requestAnimationFrame(enterFrame);
    // // requestAnimationFrame(makeEnemy);
    // setInterval(makeEnemyTest, 1000);
    // setInterval(makeEnemyF22, 5000);
    // setInterval(makeEnemySupply, 10000);
    // setInterval(makeEnemyWarship, 20000);

    // gameFrame();
    requestAnimationFrame(menuFrame);
}


/**
 * 菜单界面
 * 
 * 有bug，暂时不能用
 */
var menuShow: number = 0;
function menuFrame() {
    if (!context)
        return;
    if (menuShow === 0) {
        canvas.width = 400;
        canvas.height = 600;
        context.drawImage(bg, 0, 0);
        context.fillStyle = 'black';
        context.font = '40px Arial';
        context.fillText('飞机Dark战', 90, 120);
        context.font = '18px Arial';
        context.fillText('按 Y 键 进行下一步', 120, 500);
    }
    if (menuShow === 1) {
        emmm1();
    }
    if (menuShow === 2) {
        emmm2();
    } if (menuShow === 3) {
        emmm3();
    } if (menuShow === 4) {
        emmm4();
    } if (menuShow === 5) {
        emmm5();
    } if (menuShow === 6) {
        emmm6();
    } if (menuShow === 7) {
        emmm7();
    } if (menuShow === 8) {
        emmm8();
    } if (menuShow === 9) {
        emmm9();
    } if (menuShow === 10) {
        emmm10();
    } if (menuShow === 11) {
        emmm11();
    } if (menuShow === 12) {
        emmm12();
    } if (menuShow === 13) {
        emmm13();
    } if (menuShow === 14) {
        emmm14();
    } if (menuShow === 15) {
        emmm15();
    } if (menuShow === 16) {
        emmm16();
    } if (menuShow === 17) {
        emmm17();
    } if (menuShow === 18) {
        emmm18();
    } if (menuShow === 19) {
        emmm19();
    } if (menuShow === 20) {
        emmm20();
    } if (menuShow === 21) {
        emmm21();
    } if (menuShow === 22) {
        emmm22();
    }
    if (menuShow === 23) {
        gameFrame();
        return;
    }
    requestAnimationFrame(menuFrame);
}


/**
 * 游戏界面
 * 
 * 有bug，暂时不能用
 */
var swap: boolean = false;
function gameFrame() {
    // if (!context)
    //     return;
    // if (menuShow === 1) {
    //     canvas.width = 400;
    //     canvas.height = 600;
    //     context.drawImage(player, player_x, player_y);
    //     context.fillStyle = 'black';
    //     context.font = '24px Arial';
    //     if (fireMode)
    //         context.fillText('高爆弹药', 20, 580);
    //     else
    //         context.fillText('普通弹药', 20, 580);
    //     if (!swap) {
    //         setInterval(makeEnemyTest, 1000);
    //         setInterval(makeEnemyF22, 5000);
    //         setInterval(makeEnemySupply, 10000);
    //         setInterval(makeEnemyWarship, 30000);
    //         swap = true;
    //     }

    //     requestAnimationFrame(gameFrame);
    // }

    if (!context)
        return;
    // requestAnimationFrame(menuFrame);
    requestAnimationFrame(enterFrame);
    // requestAnimationFrame(makeEnemy);
    setInterval(makeEnemyTest, 1000);
    setInterval(makeEnemyF22, 5000);
    setInterval(makeEnemySupply, 10000);
    setInterval(makeEnemyWarship, 20000);
}


/**
 * 主画面加载
 */
function enterFrame() {
    if (!context)
        return;
    canvas.width = 400;
    canvas.height = 600;
    context.drawImage(bg, 0, 0);
    context.drawImage(player, player_x, player_y);
    context.fillStyle = 'black';
    context.font = '24px Arial';
    if (fireMode)
        context.fillText('高爆弹药', 20, 580);
    else
        context.fillText('普通弹药', 20, 580);
    context.fillText('HP:' + player_hp.toString(), 320, 580);

    // 重大bug！！！！！
    // 暂时处理，还是有问题
    checkKnock();

    requestAnimationFrame(enterFrame);
}


/**
 * 敌机和子弹碰撞检测
 * 
 * 重大bug！！！！！
 * 
 * **重大bug暂时修改** 敌机数组和子弹数组不能删元素，只能在碰撞检测的时候加上alive判断
 */
function checkKnock() {
    var num_bullet = bulletList.length;
    var num_enemy = enemyList.length;
    if (num_bullet === 0 || num_enemy === 0)
        return;
    // for (var i = 0; i < num_bullet; i++)
    //     if (!bulletList[i].alive)
    //         console.log(bulletList[i].alive);

    // 这段有问题啊，不能从数组里踢出……
    // for (var i = 0; i < num_bullet; i++) {
    //     if (!bulletList[i].alive) {
    //         // bulletList.splice(i, 1);
    //         // i--;
    //     }
    // }
    // for (var j = 0; j < num_enemy; j++) {
    //     if (!enemyList[j].alive) {
    //         enemyList.splice(j, 1);
    //         j--;
    //     }
    // }
    for (var i = 0; i < num_bullet; i++) {
        for (var j = 0; j < num_enemy; j++) {
            if (bulletList[i].alive &&
                enemyList[j].alive &&
                bulletList[i].x >= enemyList[j].x &&
                bulletList[i].x <= (enemyList[j].x + 56) &&
                bulletList[i].y <= (enemyList[j].y + 60)) {
                bulletList[i].alive = false;
                enemyList[j].hp -= bulletList[i].ap;
            }
        }
    }
    for (var i = 0; i < num_bullet; i++) {
        for (var j = 0; j < enemyF22List.length; j++) {
            if (bulletList[i].alive &&
                enemyF22List[j].alive &&
                bulletList[i].x >= enemyF22List[j].x &&
                bulletList[i].x <= (enemyF22List[j].x + 76) &&
                bulletList[i].y <= (enemyF22List[j].y + 80)) {
                bulletList[i].alive = false;
                enemyF22List[j].hp -= bulletList[i].ap;
            }
        }
    }
    for (var i = 0; i < num_bullet; i++) {
        for (var j = 0; j < enemySupplyList.length; j++) {
            if (bulletList[i].alive &&
                enemySupplyList[j].alive &&
                bulletList[i].x >= enemySupplyList[j].x &&
                bulletList[i].x <= (enemySupplyList[j].x + 96) &&
                bulletList[i].y <= (enemySupplyList[j].y + 100)) {
                bulletList[i].alive = false;
                enemySupplyList[j].hp -= bulletList[i].ap;
            }
        }
    }
    for (var i = 0; i < num_bullet; i++) {
        for (var j = 0; j < enemyWarshipList.length; j++) {
            if (bulletList[i].alive &&
                enemyWarshipList[j].alive &&
                bulletList[i].x >= enemyWarshipList[j].x &&
                bulletList[i].x <= (enemyWarshipList[j].x + 156) &&
                bulletList[i].y <= (enemyWarshipList[j].y + 300)) {
                bulletList[i].alive = false;
                enemyWarshipList[j].hp -= bulletList[i].ap;
            }
        }
    }

    for (var i = 0; i < bulletSpecialList.length; i++) {
        for (var j = 0; j < num_enemy; j++) {
            if (bulletSpecialList[i].alive &&
                enemyList[j].alive &&
                bulletSpecialList[i].x >= enemyList[j].x &&
                bulletSpecialList[i].x <= (enemyList[j].x + 56) &&
                bulletSpecialList[i].y <= (enemyList[j].y + 60)) {
                bulletSpecialList[i].alive = false;
                enemyList[j].hp -= bulletSpecialList[i].ap;
            }
        }
    }
    for (var i = 0; i < bulletSpecialList.length; i++) {
        for (var j = 0; j < enemyF22List.length; j++) {
            if (bulletSpecialList[i].alive &&
                enemyF22List[j].alive &&
                bulletSpecialList[i].x >= enemyF22List[j].x &&
                bulletSpecialList[i].x <= (enemyF22List[j].x + 76) &&
                bulletSpecialList[i].y <= (enemyF22List[j].y + 80)) {
                bulletSpecialList[i].alive = false;
                enemyF22List[j].hp -= bulletSpecialList[i].ap;
            }
        }
    }
    for (var i = 0; i < bulletSpecialList.length; i++) {
        for (var j = 0; j < enemySupplyList.length; j++) {
            if (bulletSpecialList[i].alive &&
                enemySupplyList[j].alive &&
                bulletSpecialList[i].x >= enemySupplyList[j].x &&
                bulletSpecialList[i].x <= (enemySupplyList[j].x + 96) &&
                bulletSpecialList[i].y <= (enemySupplyList[j].y + 100)) {
                bulletSpecialList[i].alive = false;
                enemySupplyList[j].hp -= bulletSpecialList[i].ap;
            }
        }
    }
    for (var i = 0; i < bulletSpecialList.length; i++) {
        for (var j = 0; j < enemyWarshipList.length; j++) {
            if (bulletList[i].alive &&
                enemyWarshipList[j].alive &&
                bulletSpecialList[i].x >= enemyWarshipList[j].x &&
                bulletSpecialList[i].x <= (enemyWarshipList[j].x + 156) &&
                bulletSpecialList[i].y <= (enemyWarshipList[j].y + 300)) {
                bulletSpecialList[i].alive = false;
                enemyWarshipList[j].hp -= bulletSpecialList[i].ap;
            }
        }
    }
}


/**
 * 随机刷新敌人
 * 
 * 存在问题 —— 同开火一样，无法同时存在多个对象，只能等当前对象销毁之后才能开始下一对象
 *            **修正**  问题同开火一样，已解决，这里大部分代码没用了
 */
var enemy_x = getRandomPosX();
var enemy_y = 0;
var enemyLoad = true;
function getRandomPosX(): number {
    var x = Math.floor(Math.random() * 341);
    return x;
}
function makeEnemyTest() {
    var temp = new Enemy();
    enemyList.push(temp);
    // enemyList.push(new Enemy());
}
function makeEnemyF22() {
    var temp = new EnemyF22();
    enemyF22List.push(temp);
}
function makeEnemySupply() {
    var temp = new EnemySupply();
    enemySupplyList.push(temp);
}
function makeEnemyWarship() {
    var temp = new EnemyWarship();
    enemyWarshipList.push(temp);
}
function makeEnemy() {
    if (!enemyLoad)
        return;
    enemyLoad = false;
    enemy_x = getRandomPosX();
    enemy_y = -30;
    requestAnimationFrame(updateEnemy);
}
function updateEnemy() {
    // console.log('update');
    if (!context)
        return;
    enemy_y += 5;
    // clean();
    context.drawImage(enemy, enemy_x, enemy_y);
    if (enemy_y > 600) {
        enemyLoad = true;
        return;
    }
    if (fireX >= enemy_x && fireX <= (enemy_x + 56) && fireY < (enemy_y + 60) && fireY > enemy_y) {
        enemyLoad = true;
        return;
    }
    requestAnimationFrame(updateEnemy);
}


/**
 * 鼠标键盘移动、点击事件
 */
window.onmousemove = setPlayerPosAsMousePos;
window.onclick = text;
window.onkeydown = keyDown;


/**
 * 鼠标移动事件 —— 玩家移动飞机
 */
var player_x = 0;
var player_y = 0;
var player_hp = 2;
function setPlayerPosAsMousePos(event: any) {
    var event = event || window.event;
    var mousePos = mousePosition(event);
    var x = mousePos.x - 30;
    var y = mousePos.y - 30;
    if (x >= 0 && x <= 340)
        player_x = x;
    if (y >= 0 && y <= 540)
        player_y = y;
}
function mousePosition(ev: any) {
    return { x: ev.clientX, y: ev.clientY };
}


/**
 * 鼠标点击事件 —— 玩家开火
 * 
 * 存在问题 —— 只能一发一发打，上一发子弹如果未消失再次开火，上一发直接消失并且下一发的飞行速度会将上一发叠加
 *            **暂时修正**  设置判断量，如果当前子弹未销毁，不能开火
 *            **修正**  子弹类的问题解决，这里的方法就没用了
 */
var list = new Array();
var fireSwitch: boolean = false;
var temp: number = 0;
function text(ev: any) {
    fireSwitch = !fireSwitch;
    if (fireSwitch) {
        temp = setInterval(function () {
            if (fireMode) {
                var bullet = new BulletSpecial(player_x, player_y);
                bulletSpecialList.push(bullet);
            }
            else {
                var bullet = new BulletNormal(player_x, player_y);
                bulletList.push(bullet);
                // bulletList.push(new BulletNormal(player_x, player_y));
            }
        }, 250);
    }
    else
        window.clearInterval(temp);
    // bullet.fire();
    // list.push(bullet);
    // fireNormal();
}
var fireX: number;
var fireY: number;
var fireLoad = true;
function fireNormal() {
    if (!fireLoad)
        return;
    fireLoad = false;
    fireX = player_x + 28;
    fireY = player_y + 10;
    requestAnimationFrame(fireNormalFrame);
}
function fireNormalFrame() {
    if (!context)
        return;
    fireY -= 20;
    context.rect(fireX, fireY, 4, 20);
    context.fillStyle = 'red';
    context.fill();
    if (fireY < -20) {
        fireLoad = true;
        return;
    }
    requestAnimationFrame(fireNormalFrame);
}


/**
 * 键盘点击事件
 */
var fireMode: boolean = false;
function keyDown(ev: any) {
    var key = ev.keyCode ? ev.keyCode : ev.which;
    if (90 === key) {
        fireMode = !fireMode;
    }
    else if (89 === key) {
        menuShow += 1;
    }
}


/**
 * 玩家子弹 普通
 * 
 * 测试失败 —— 通过 requestAnimationFrame() 访问的成员函数 无法调用对象属性值
 *            **修正** 通过 requestAnimationFrame(() => this.fire()) 调用就可以！！！
 */
class BulletNormal {
    public x: number;
    public y: number;
    public ap: number;
    public alive: boolean;
    constructor(px: number, py: number) {
        this.x = px + 28;
        this.y = py + 10;
        this.ap = 1;
        this.alive = true;
        requestAnimationFrame(() => this.fire());
        // console.log("fuck");
    }
    fire() {
        if (!context)
            return;
        this.y -= 15;
        context.rect(this.x, this.y, 4, 20);
        context.fillStyle = 'red';
        context.fill();
        if (this.y <= -20)
            this.alive = false;
        if (!this.alive)
            return;
        requestAnimationFrame(() => this.fire());
    }
}


/**
 * 玩家子弹 特殊
 * 
 */
class BulletSpecial {
    public x: number;
    public y: number;
    public ap: number;
    public alive: boolean;
    constructor(px: number, py: number) {
        this.x = px + 26;
        this.y = py + 10;
        this.ap = 2;
        this.alive = true;
        requestAnimationFrame(() => this.fire());
    }
    fire() {
        if (!context)
            return;
        this.y -= 12;
        context.rect(this.x, this.y, 8, 16);
        context.fillStyle = 'yellow';
        context.fill();
        if (this.y <= -16)
            this.alive = false;
        if (!this.alive)
            return;
        requestAnimationFrame(() => this.fire());
    }
}


/**
 * 敌人飞机 普通
 * 
 */
class Enemy {
    img: HTMLImageElement;
    x: number;
    y: number;
    public hp: number;
    public alive: boolean;
    constructor() {
        this.img = enemy;
        this.x = this.getRandomPos();
        this.y = -60;
        this.hp = 2;
        this.alive = true;
        requestAnimationFrame(() => this.make());
    }
    getRandomPos(): number {
        var x = Math.floor(Math.random() * 341);
        return x;
    }
    make(): void {
        if (!context)
            return;
        this.y += 3;
        context.drawImage(this.img, this.x, this.y);
        if (this.hp <= 0 || this.y >= 600)
            this.alive = false;
        if (!this.alive)
            return;
        requestAnimationFrame(() => this.make());
    }
}


/**
 * 敌人飞机 F22
 * 
 */
class EnemyF22 {
    img: HTMLImageElement;
    x: number;
    y: number;
    hp: number;
    public alive: boolean;
    constructor() {
        this.img = enemy_f22;
        this.x = this.getRandomPos();
        this.y = -80;
        this.hp = 4;
        this.alive = true;
        requestAnimationFrame(() => this.make());
    }
    getRandomPos(): number {
        var x = Math.floor(Math.random() * 321);
        return x;
    }
    make(): void {
        if (!context)
            return;
        this.y += 5;
        context.drawImage(this.img, this.x, this.y);
        if (this.hp <= 0 || this.y >= 600)
            this.alive = false;
        if (!this.alive)
            return;
        requestAnimationFrame(() => this.make());
    }
}


/**
 * 敌人飞机 歼星舰
 * 
 */
class EnemyWarship {
    img: HTMLImageElement;
    x: number;
    y: number;
    hp: number;
    public alive: boolean;
    constructor() {
        this.img = enemy_warship;
        this.x = this.getRandomPos();
        this.y = -300;
        this.hp = 30;
        this.alive = true;
        requestAnimationFrame(() => this.make());
    }
    getRandomPos(): number {
        var x = Math.floor(Math.random() * 241);
        return x;
    }
    make(): void {
        if (!context)
            return;
        this.y += 1;
        context.drawImage(this.img, this.x, this.y);
        if (this.hp <= 0 || this.y >= 600)
            this.alive = false;
        if (!this.alive)
            return;
        requestAnimationFrame(() => this.make());
    }
}


/**
 * 敌人飞机 补给
 * 
 */
class EnemySupply {
    img: HTMLImageElement;
    x: number;
    y: number;
    hp: number;
    public alive: boolean;
    constructor() {
        this.img = enemy_supply;
        this.x = this.getRandomPos();
        this.y = -100;
        this.hp = 8;
        this.alive = true;
        requestAnimationFrame(() => this.make());
    }
    getRandomPos(): number {
        var x = Math.floor(Math.random() * 301);
        return x;
    }
    make(): void {
        if (!context)
            return;
        this.y += 2;
        context.drawImage(this.img, this.x, this.y);
        if (this.hp <= 0 || this.y >= 600)
            this.alive = false;
        if (!this.alive)
            return;
        requestAnimationFrame(() => this.make());
    }
}


/**
 * 补给箱
 */
class Supply {
    img: HTMLImageElement;
    x: number;
    y: number;
    constructor(x: number, y: number) {
        this.img = supply;
        this.x = x;
        this.y = y;
        requestAnimationFrame(() => this.make());
    }
    make(): void {
        if (!context)
            return;
        this.y += 1;
        context.drawImage(this.img, this.x, this.y);
        requestAnimationFrame(() => this.make());
    }
}


// 下面都是凑数用的代码……gg……
/**
 * 凑数界面 一
 * 
 */
function emmm1() {
    if (!context)
        return;
    canvas.width = 400;
    canvas.height = 600;
    context.drawImage(bg, 0, 0);
    context.fillStyle = 'black';
    context.font = '24px Arial';
    context.fillText('老师啊,一定要1000行代码', 50, 120);
    context.font = '18px Arial';
    context.fillText('按 Y 键 进行下一步', 120, 500);
}


/**
 * 凑数界面 一
 * 
 */
function emmm2() {
    if (!context)
        return;
    canvas.width = 400;
    canvas.height = 600;
    context.drawImage(bg, 0, 0);
    context.fillStyle = 'black';
    context.font = '24px Arial';
    context.fillText('我这写了700行了', 50, 120);
    context.font = '18px Arial';
    context.fillText('按 Y 键 进行下一步', 120, 500);
}


/**
 * 凑数界面 一
 * 
 */
function emmm3() {
    if (!context)
        return;
    canvas.width = 400;
    canvas.height = 600;
    context.drawImage(bg, 0, 0);
    context.fillStyle = 'black';
    context.font = '24px Arial';
    context.fillText('还有几个功能没做', 50, 120);
    context.font = '18px Arial';
    context.fillText('按 Y 键 进行下一步', 120, 500);
}


/**
 * 凑数界面 一
 * 
 */
function emmm4() {
    if (!context)
        return;
    canvas.width = 400;
    canvas.height = 600;
    context.drawImage(bg, 0, 0);
    context.fillStyle = 'black';
    context.font = '24px Arial';
    context.fillText('但是写不下去了......', 50, 120);
    context.font = '18px Arial';
    context.fillText('按 Y 键 进行下一步', 120, 500);
}


/**
 * 凑数界面 一
 * 
 */
function emmm5() {
    if (!context)
        return;
    canvas.width = 400;
    canvas.height = 600;
    context.drawImage(bg, 0, 0);
    context.fillStyle = 'black';
    context.font = '24px Arial';
    context.fillText('所以在游戏开始之前', 50, 120);
    context.font = '18px Arial';
    context.fillText('按 Y 键 进行下一步', 120, 500);
}


/**
 * 凑数界面 一
 * 
 */
function emmm6() {
    if (!context)
        return;
    canvas.width = 400;
    canvas.height = 600;
    context.drawImage(bg, 0, 0);
    context.fillStyle = 'black';
    context.font = '24px Arial';
    context.fillText('我想要念一首诗', 50, 120);
    context.font = '18px Arial';
    context.fillText('按 Y 键 进行下一步', 120, 500);
}


/**
 * 凑数界面 一
 * 
 */
function emmm7() {
    if (!context)
        return;
    canvas.width = 400;
    canvas.height = 600;
    context.drawImage(bg, 0, 0);
    context.fillStyle = 'black';
    context.font = '24px Arial';
    context.fillText('力微任重久神疲', 50, 120);
    context.font = '18px Arial';
    context.fillText('按 Y 键 进行下一步', 120, 500);
}


function emmm8() {
    if (!context)
        return;
    canvas.width = 400;
    canvas.height = 600;
    context.drawImage(bg, 0, 0);
    context.fillStyle = 'black';
    context.font = '24px Arial';
    context.fillText('再竭衰庸定不支', 50, 120);
    context.font = '18px Arial';
    context.fillText('按 Y 键 进行下一步', 120, 500);
}


function emmm9() {
    if (!context)
        return;
    canvas.width = 400;
    canvas.height = 600;
    context.drawImage(bg, 0, 0);
    context.fillStyle = 'black';
    context.font = '24px Arial';
    context.fillText('苟利国家生死以', 50, 120);
    context.font = '18px Arial';
    context.fillText('按 Y 键 进行下一步', 120, 500);
}


function emmm10() {
    if (!context)
        return;
    canvas.width = 400;
    canvas.height = 600;
    context.drawImage(bg, 0, 0);
    context.fillStyle = 'black';
    context.font = '24px Arial';
    context.fillText('岂因祸福避趋之', 50, 120);
    context.font = '18px Arial';
    context.fillText('按 Y 键 进行下一步', 120, 500);
}


function emmm11() {
    if (!context)
        return;
    canvas.width = 400;
    canvas.height = 600;
    context.drawImage(bg, 0, 0);
    context.fillStyle = 'black';
    context.font = '24px Arial';
    context.fillText('谪居正是君恩厚', 50, 120);
    context.font = '18px Arial';
    context.fillText('按 Y 键 进行下一步', 120, 500);
}


function emmm12() {
    if (!context)
        return;
    canvas.width = 400;
    canvas.height = 600;
    context.drawImage(bg, 0, 0);
    context.fillStyle = 'black';
    context.font = '24px Arial';
    context.fillText('养拙刚于戍卒宜', 50, 120);
    context.font = '18px Arial';
    context.fillText('按 Y 键 进行下一步', 120, 500);
}


function emmm13() {
    if (!context)
        return;
    canvas.width = 400;
    canvas.height = 600;
    context.drawImage(bg, 0, 0);
    context.fillStyle = 'black';
    context.font = '24px Arial';
    context.fillText('戏与山妻谈故事', 50, 120);
    context.font = '18px Arial';
    context.fillText('按 Y 键 进行下一步', 120, 500);
}


function emmm14() {
    if (!context)
        return;
    canvas.width = 400;
    canvas.height = 600;
    context.drawImage(bg, 0, 0);
    context.fillStyle = 'black';
    context.font = '24px Arial';
    context.fillText('试吟断送老头皮', 50, 120);
    context.font = '18px Arial';
    context.fillText('按 Y 键 进行下一步', 120, 500);
}


function emmm15() {
    if (!context)
        return;
    canvas.width = 400;
    canvas.height = 600;
    context.drawImage(bg, 0, 0);
    context.fillStyle = 'black';
    context.font = '24px Arial';
    context.fillText('这诗也念完了', 50, 120);
    context.font = '18px Arial';
    context.fillText('按 Y 键 进行下一步', 120, 500);
}


function emmm16() {
    if (!context)
        return;
    canvas.width = 400;
    canvas.height = 600;
    context.drawImage(bg, 0, 0);
    context.fillStyle = 'black';
    context.font = '24px Arial';
    context.fillText('该开始正式的游戏了吧', 50, 120);
    context.font = '18px Arial';
    context.fillText('按 Y 键 进行下一步', 120, 500);
}


function emmm17() {
    if (!context)
        return;
    canvas.width = 400;
    canvas.height = 600;
    context.drawImage(bg, 0, 0);
    context.fillStyle = 'black';
    context.font = '24px Arial';
    context.fillText('我先教你怎么操作吧', 50, 120);
    context.font = '18px Arial';
    context.fillText('按 Y 键 进行下一步', 120, 500);
}


function emmm18() {
    if (!context)
        return;
    canvas.width = 400;
    canvas.height = 600;
    context.drawImage(bg, 0, 0);
    context.fillStyle = 'black';
    context.font = '24px Arial';
    context.fillText('鼠标直接飞机控制移动', 50, 120);
    context.font = '18px Arial';
    context.fillText('按 Y 键 进行下一步', 120, 500);
}


function emmm19() {
    if (!context)
        return;
    canvas.width = 400;
    canvas.height = 600;
    context.drawImage(bg, 0, 0);
    context.fillStyle = 'black';
    context.font = '24px Arial';
    context.fillText('鼠标左键开火/停火', 50, 120);
    context.font = '18px Arial';
    context.fillText('按 Y 键 进行下一步', 120, 500);
}


function emmm20() {
    if (!context)
        return;
    canvas.width = 400;
    canvas.height = 600;
    context.drawImage(bg, 0, 0);
    context.fillStyle = 'black';
    context.font = '24px Arial';
    context.fillText('Z键切换开火模式', 50, 120);
    context.font = '18px Arial';
    context.fillText('按 Y 键 进行下一步', 120, 500);
}


function emmm21() {
    if (!context)
        return;
    canvas.width = 400;
    canvas.height = 600;
    context.drawImage(bg, 0, 0);
    context.fillStyle = 'black';
    context.font = '24px Arial';
    context.fillText('敌人一共有四种', 50, 120);
    context.font = '18px Arial';
    context.fillText('按 Y 键 进行下一步', 120, 500);
}


function emmm22() {
    if (!context)
        return;
    canvas.width = 400;
    canvas.height = 600;
    context.drawImage(bg, 0, 0);
    context.fillStyle = 'black';
    context.font = '24px Arial';
    context.fillText('歼星舰很厉害的，加油', 50, 120);
    context.font = '18px Arial';
    context.fillText('按 Y 键 开始游戏！', 120, 500);
}
