var canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
var context = canvas.getContext("2d")
var y = 50;



var image = new Image();
image.src = 'icon.jpg';



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
}

class State {

    onEnter() {

    }

    onUpdate() {

    }

    onExit() {

    }

}


class LoginState extends State {

    private textField: TextField;

    onEnter() {
        this.textField = new TextField(100, 100);
        this.textField.text = '点击进入游戏';
        // stage.renderList = [text];
        stage.addChild(this.textField);
    }

    onExit() {
        stage.removeChild(this.textField);
    }
}

class PlayingState extends State {
    private fsm1 = new StateMachine();
    private logo1: Bitmap;
    private logo2: Bitmap;

    onEnter() {
        const container = new DisplayObjectContainer(0, 0);
        stage.addChild(container);
        container.x = container.y = 100;
        // container.scaleX = container.scaleY = 2;
        container.rotation = 45;

        this.logo1 = new Bitmap(100, 0, image);
        // this.logo2 = new Bitmap(0, 100, image);
        // stage.renderList = [logo1,logo2];
        container.addChild(this.logo1);


        this.logo1.addEventListener(() => {
            console.log('clicked!!!')
        })
        // this.logo1.rotation = 45;
        // container.addChild(this.logo2);
    }



    onUpdate() {
        // this.logo1.y++;
        // this.logo2.x++;

    }
}




class EventDispatcher {

    private listeners: Function[] = [];

    dispatchEvent() {
        for (let listener of this.listeners) {
            listener();
        }
    }

    addEventListener(callback: Function) {
        this.listeners.push(callback);
    }

}


abstract class DisplayObject extends EventDispatcher {

    x = 0;

    y = 0;

    scaleX = 1;

    scaleY = 1;

    rotation = 0;

    alpha = 1;

    globalAlpha = 1;

    globalMatrix: math.Matrix = new math.Matrix();

    localMatrix: math.Matrix = new math.Matrix();

    parent: DisplayObjectContainer | null = null;

    visible: boolean = true;

    constructor(x: number, y: number) {
        super();
        this.x = x;
        this.y = y;
    }

    abstract render(context: CanvasRenderingContext2D): void;

    draw(context: CanvasRenderingContext2D) {

        if (!this.visible) {
            return;
        }

        const parentGlobalAlpha = this.parent ? this.parent.globalAlpha : 1;
        this.globalAlpha = parentGlobalAlpha * this.alpha;
        context.globalAlpha = this.globalAlpha;

        this.localMatrix.updateFromDisplayObject(this.x, this.y, this.scaleX, this.scaleY, this.rotation);
        const parentGlobalMatrix = this.parent ? this.parent.globalMatrix : new math.Matrix();
        const globalMatrix = math.matrixAppendMatrix(this.localMatrix, parentGlobalMatrix);
        this.globalMatrix = globalMatrix;
        context.setTransform(globalMatrix.a, globalMatrix.b, globalMatrix.c, globalMatrix.d, globalMatrix.tx, globalMatrix.ty);

        this.render(context);
    }


    hitTest(x: number, y: number): null | DisplayObject {
        return null;
    }

}

class Bitmap extends DisplayObject {

    constructor(x: number, y: number, image: HTMLImageElement) {
        super(x, y);
        this.image = image;
    }

    image: HTMLImageElement | null = null;

    render(context: CanvasRenderingContext2D) {
        const parentGlobalAlpha = this.parent ? this.parent.globalAlpha : 1;
        if (this.image) {
            context.drawImage(this.image, 0, 0)
        }
    }

    hitTest(x: number, y: number) {

        const width = this.image ? this.image.width : 0;
        const height = this.image ? this.image.height : 0;
        const rect = { x: 0, y: 0, width: width, height: height };
        if (x > rect.x &&
            x < rect.x + rect.width &&
            y > rect.y &&
            y < rect.y + rect.height
        ) {
            return this;
        }
        else {
            return null;
        }
    }
}

class TextField extends DisplayObject {

    text = "";

    render(context: CanvasRenderingContext2D) {
        context.fillText(this.text, 0, 20);//magic number
    }
}

class DisplayObjectContainer extends DisplayObject {


    private children: DisplayObject[] = [];

    addChild(child: DisplayObject) {
        this.children.push(child);
        child.parent = this;
    }

    removeChild(child: DisplayObject) {
        const index = this.children.indexOf(child);
        if (index != -1) {
            this.children.splice(index);
        }
    }

    render(context: CanvasRenderingContext2D): void {
        const renderList = this.children;

        for (let render of renderList) {
            render.draw(context);
        }
    }

    hitTest(x: number, y: number) {
        const displayObjectList = this.children;
        let hitTestResult: DisplayObject | null = null;

        for (let i = displayObjectList.length - 1; i >= 0; i--) {
            const childDisplayObject = displayObjectList[i];
            const childLocalMatrix = childDisplayObject.localMatrix;
            const childInvertLocalMatrix = math.invertMatrix(childLocalMatrix);
            const pointRelativeFromChildDisplayObject = math.pointAppendMatrix(new math.Point(x, y), childInvertLocalMatrix);
            const result = childDisplayObject.hitTest(pointRelativeFromChildDisplayObject.x, pointRelativeFromChildDisplayObject.y);
            if (result != null) {
                hitTestResult = result;
                break;
            }
        }
        return hitTestResult;
    }
}





class Stage extends DisplayObjectContainer {

    constructor() {
        super(0, 0);
    }
}


const stage = new Stage();
var fsm = new StateMachine();
fsm.replaceState(new PlayingState());



function onTicker(context: CanvasRenderingContext2D) {
    fsm.update();
    context.clearRect(0, 0, 400, 400);
    context.save();
    stage.draw(context);
    context.restore();
}


function enterFrame() {
    if (!context) {
        return;
    }
    onTicker(context);
    requestAnimationFrame(enterFrame);
}

canvas.onclick = function (event) {
    const offsetX = event.offsetX;
    const offsetY = event.offsetY;

    const hitResult = stage.hitTest(offsetX, offsetY);
    if (hitResult) {
        hitResult.dispatchEvent();
    }

}



requestAnimationFrame(enterFrame);