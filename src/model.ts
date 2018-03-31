const MAX_LEVEL = 99;
const MAX_HP = 140;
const MAX_ATTACK = 200;
const USER_ATTACK_PRE = 100;


/**
 * 玩家
 */
class User extends EventDispatcher {
    x: number;
    y: number;
    view: Bitmap;
    moveStatus: boolean = true;
    name: string = '';
    hp: number = 10;
    mounthedEquipment: Equipment[] = [];
    packageEquipment: Equipment[] = [];


    _level: number;
    get level() {
        return this._level;
    }
    set level(level: number) {
        this._level = level;
        this.dispatchEvent('updateUserInfo', null);
    }

    pick(equipment: Equipment) {
        this.mounthedEquipment.push(equipment);
        this.dispatchEvent('updateUserInfo', null);
    }
    drop() {

    }

    get attack(): number {
        let equipmentAttack = 0;
        for (let equipment of this.mounthedEquipment) {
            equipmentAttack += equipment.attack;
        }
        return this.level * USER_ATTACK_PRE + equipmentAttack;
    }

    changeGridPos(row: number, col: number) {
        this.x = row;
        this.y = col;
    }

    update() {
        // 角色每帧移动
        const targetX = player.x * TILE_SIZE;
        const targetY = player.y * TILE_SIZE;
        if (player.view.x == targetX && player.view.y == targetY) {
            return;
        }
        var stepX = 0;
        var stepY = 0;
        if (Math.abs(targetX - player.view.x) > 2) {
            stepX = TILE_SIZE * INTERVAL / PLAYER_WALK_SPEED;
            stepX = (targetX < player.view.x) ? -stepX : stepX;
            player.view.x += stepX;
        } else {
            player.view.x = targetX;
        }
        if (Math.abs(targetY - player.view.y) > 2) {
            stepY = TILE_SIZE * INTERVAL / PLAYER_WALK_SPEED;
            stepY = (targetY < player.view.y) ? -stepY : stepY;
            player.view.y += stepY;
        } else {
            player.view.y = targetY;
        }
    }

    toString() {
        return `[User ~ name:${this.name}, level:${this.level}, hp:${this.hp}, attack:${this.attack}]`;
    }
}


/**
 * 装备
 */
class Equipment {
    x: number = 0;
    y: number = 0;
    name: string = '';
    attack: number = 10;
    view: Bitmap

    toString() {
        return `[Equipment ~ name:${this.name}, attack:${this.attack}]`;
    }
}


/**
 * 任务
 */
enum MissionStatus {
    UNACCEPT = 0,
    CAN_ACCEPT = 1,
    DURRING = 2,
    CAN_SUBMIT = 3,
    FINISH = 4,
}

class Mission {
    id: number = 0
    name: string = ''
    needLevel: number = 0
    fromNpcId: number = 0
    toNpcId: number = 0
    isAccepted: boolean = false
    isSubmit: boolean = false
    current: number = 0
    total: number = 1
    status: MissionStatus = MissionStatus.UNACCEPT

    update() {
        let nextStatus: MissionStatus = MissionStatus.UNACCEPT;
        if (this.isSubmit) {
            nextStatus = MissionStatus.FINISH;
        }
        if (this.isAccepted) {
            if (this.current >= this.total) {
                nextStatus = MissionStatus.CAN_SUBMIT;
            } else {
                nextStatus = MissionStatus.DURRING;
            }
        } else {
            if (player.level >= this.needLevel) {
                nextStatus = MissionStatus.CAN_ACCEPT;
            }
        }
        if (nextStatus != this.status) {
            this.status = nextStatus;
            return true;
        }

        else {
            return false;
        }
    }

    toString() {
        return `[Mission ~ id:${this.id}, name:${this.name}]`
    }
}




/**
 * NPC
 */
class Npc {
    x: number = 0
    y: number = 0
    name: string = ''
    view: Bitmap
    id = 0;

    canAcceptMissions: Mission[] = []
    canSubmitMissions: Mission[] = []

    constructor(id: number, name: string) {
        this.id = id;
        this.name = name;
        missionManager.addEventListener('missionUpdate', (eventData: any) => {
            this.update();
        })
    }

    update() {
        this.canAcceptMissions = [];
        this.canSubmitMissions = [];
        for (let mission of missionManager.missions) {
            if (mission.status == MissionStatus.CAN_ACCEPT && mission.fromNpcId == this.id) {
                this.canAcceptMissions.push(mission);
            }
            if (mission.status == MissionStatus.CAN_SUBMIT && mission.toNpcId == this.id) {
                this.canSubmitMissions.push(mission);
            }
        }
    }

    toString() {
        return `[NPC ~ id:${this.id}]`
    }
}


