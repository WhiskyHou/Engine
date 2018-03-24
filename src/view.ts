/**
 * 用户信息UI
 */
class UserInfoUI extends DisplayObjectContainer {
    userName: TextField;
    userLevel: TextField;
    userAttack: TextField;

    constructor(x: number, y: number) {
        super(x, y);

        this.userName = new TextField(player.name, 10, 0, 20);
        this.userLevel = new TextField('Lv:' + player.level, 150, 0, 20);
        this.userAttack = new TextField('Attck:' + player.attack, 300, 0, 20);

        this.addChild(this.userName);
        this.addChild(this.userLevel);
        this.addChild(this.userAttack);

        player.addEventListener(() => {
            this.userLevel.text = 'Lv:' + player.level;
            this.userAttack.text = 'Attck:' + player.attack;
        });
        // console.log(player);
    }
}