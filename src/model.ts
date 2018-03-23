const MAX_LEVEL = 99;
const MAX_HP = 140;
const MAX_ATTACK = 200;
const USER_ATTACK_PRE = 10;


class User extends EventDispatcher {
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
        this.dispatchEvent({ message: 'setLevel' });
    }

    pick(equipment: Equipment) {
        this.mounthedEquipment.push(equipment);
    }
    drop() {

    }

    get attack(): number {
        let equipmentAttack = 0;
        for (let equipment of this.mounthedEquipment) {
            equipmentAttack += equipment.attack;
        }
        return this.attack * USER_ATTACK_PRE + equipmentAttack;
    }

    toString() {
        return `[User ~ name:${this.name}, level:${this.level}, hp:${this.hp}, attack:${this.attack}]`;
    }
}



class Equipment {
    name: string = '';
    attack: number = 10;

    toString() {
        return `[Equipment ~ name:${this.name}, attack:${this.attack}]`;
    }
}
