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

    toString() {
        return `[User ~ name:${this.name}, level:${this.level}, hp:${this.hp}, attack:${this.attack}]`;
    }
}



/**
 * 装备
 */
class Equipment {
    name: string = '';
    attack: number = 10;

    toString() {
        return `[Equipment ~ name:${this.name}, attack:${this.attack}]`;
    }
}


/**
 * 任务
 */



/**
 * NPC
 */


