const ITEM_WIDTH = 128;
const ITEM_HEIGHT = 128;


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
        stage.deleteAll();
        stage.deleteAllEventListener();
    }

    onClick = (eventData: any) => {
        fsm.replaceState(new PlayingState());
    }
}


class PlayingState extends State {
    text: TextField;

    constructor() {
        super();
        this.text = new TextField('游戏中', 300, 300, 60);
    }
    onEnter(): void {
        stage.addChild(this.text)
    }
    onUpdate(): void {
    }
    onExit(): void {
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