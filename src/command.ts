
/**
 * 走路命令
 */
class WalkCommand extends Command {
    fromX: number;
    fromY: number;
    toX: number;
    toY: number;

    constructor(fromX: number, fromY: number, toX: number, toY: number) {
        super();
        this.fromX = fromX;
        this.fromY = fromY;
        this.toX = toX;
        this.toY = toY;
    }

    execute(callback: Function): void {
        console.log(`开始走路！！！从(${this.fromX}, ${this.fromY})出发`);

        map.grid.setStartNode(this.fromX, this.fromY);
        map.grid.setEndNode(this.toX, this.toY);
        const findpath = new astar.AStar();
        findpath.setHeurisitic(findpath.diagonal);
        const result = findpath.findPath(map.grid);
        // console.log(map.grid.toString());
        console.log(findpath._path);

        let path;
        if (result) {
            path = findpath._path;
            path.shift();
            this.walk(path, callback);
        } else {
            player.moveStatus = true;
            callback();
        }
    }

    walk(path: astar.Node[], callback: Function) {
        setTimeout(() => {
            let node = path.shift();
            if (node) {
                player.dispatchEvent('walkOneStep', { nodeX: node.x, nodeY: node.y });
            }
            else {
                console.log(`到达地点！！！(${this.toX},${this.toY})`);
                player.moveStatus = true;
                callback();
                return;
            }
            this.walk(path, callback);
        }, PLAYER_WALK_SPEED);
    }
}


/**
 * 拾取命令
 */
class PickCommand extends Command {
    equipment: Equipment;

    constructor(equipment: Equipment) {
        super();
        this.equipment = equipment;
    }

    execute(callback: Function): void {
        player.pick(this.equipment);
        console.log(`捡起了${this.equipment.toString()}`);
        // map.dispatchEvent({ message: 'pickEquipment' });
        map.deleteEquipment(this.equipment);
        callback();
    }
}