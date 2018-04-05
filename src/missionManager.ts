/**
 * 任务管理器
 */
class MissionManager extends EventDispatcher {
    missions: Mission[] = []

    constructor() {
        super();


        // mission 1
        let mission1Going = (eventData: any) => {
            if (eventData.name === '屠龙刀') {
                mission1.current++;
                console.log('任务1进度加啦！！！！')
            }
        }
        let mission1Reward = () => {
            player.levelUp();
        }
        const mission1 = new Mission('pickEquipment', mission1Going, mission1Reward);
        mission1.id = 1;
        mission1.name = "捡起屠龙宝刀!";
        mission1.needLevel = 1;
        mission1.fromNpcId = 1;
        mission1.toNpcId = 1;
        mission1.status = MissionStatus.CAN_ACCEPT;
        this.missions.push(mission1);



        // mission 2
        let mission2Going = (eventData: any) => {
            if (eventData.name === '队长') {
                mission2.current++;
                console.log('任务2进度加啦！！！！')
            }
        }
        let mission2Reward = () => {
            player.levelUp();
        }
        const mission2 = new Mission('fightWithMonster', mission2Going, mission2Reward);
        mission2.id = 2;
        mission2.name = "打败队长!";
        mission2.needLevel = 2;
        mission2.fromNpcId = 1;
        mission2.toNpcId = 1;
        mission2.status = MissionStatus.UNACCEPT;
        this.missions.push(mission2)



        this.init();
    }

    init() {
        player.addEventListener('userChange', (eventData: any) => {
            this.update();
        })
        this.update();
    }

    update() {
        for (let mission of this.missions) {
            mission.update();
        }
        this.dispatchEvent('missionUpdate', {});
    }

    accept(mission: Mission) {
        mission.isAccepted = true;
        this.update()
    }

    submit(mission: Mission) {
        mission.isSubmit = true;
        this.update();
    }

}