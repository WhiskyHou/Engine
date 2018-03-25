/**
 * 用户信息UI
 */
class UserInfoUI extends DisplayObjectContainer {
    userName: TextField;
    userLevel: TextField;
    userAttack: TextField;
    userEquipment: TextField;

    constructor(x: number, y: number) {
        super(x, y);

        this.userName = new TextField(player.name, 10, 0, 20);
        this.userLevel = new TextField('Lv:' + player.level, 120, 0, 20);
        this.userAttack = new TextField('Attck:' + player.attack, 240, 0, 20);
        this.userEquipment = new TextField('装备: ', 400, 0, 20);

        this.addChild(this.userName);
        this.addChild(this.userLevel);
        this.addChild(this.userAttack);
        this.addChild(this.userEquipment);

        player.addEventListener((eventData: any) => {
            if (eventData.message == 'setLevel' || eventData.message == 'pickEquipment') {
                this.userLevel.text = 'Lv:' + player.level;
                this.userAttack.text = 'Attck:' + player.attack;
                let equipments: string = '';
                for (let item of player.mounthedEquipment) {
                    equipments += item.name.toString();
                }
                this.userEquipment.text = '装备: ' + equipments;
            }

        });
        // console.log(player);
    }
}