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

        player.addEventListener('updateUserInfo', (eventData: any) => {
            this.userLevel.text = 'Lv:' + player.level;
            this.userAttack.text = 'Attck:' + player.attack;
            let equipments: string = '';
            for (let item of player.mounthedEquipment) {
                equipments += item.name.toString();
            }
            this.userEquipment.text = '装备: ' + equipments;
        });
        // console.log(player);
    }
}


/**
 * 任务栏UI
 */
class MissionInfoUI extends DisplayObjectContainer {

    constructor(x: number, y: number) {
        super(x, y);

        this.update();
        missionManager.addEventListener('missionUpdate', (eventDate: any) => {
            this.update();
        })
    }

    update() {
        this.deleteAll();
        let index = 0;
        for (let mission of missionManager.missions) {
            if (mission.status == MissionStatus.UNACCEPT ||
                mission.status == MissionStatus.CAN_ACCEPT ||
                mission.status == MissionStatus.CAN_SUBMIT) {

                const missionLabel = new TextField("", 0, 0, 24);
                this.addChild(missionLabel);
                missionLabel.text = mission.name;
                missionLabel.y = index * 24;
                index++;
            }
        }
    }

}