/**
 * 游戏地图容器
 */
class GameMap extends DisplayObjectContainer {
    grid: astar.Grid;

    config = [
        { x: 0, y: 0, id: GRASS_L }, { x: 1, y: 0, id: GRASS_D }, { x: 2, y: 0, id: GRASS_L }, { x: 3, y: 0, id: GRASS_D }, { x: 4, y: 0, id: GRASS_L }, { x: 5, y: 0, id: GRASS_D, npc: NPC },
        { x: 0, y: 1, id: GRASS_D, wall: WALL_LEFT }, { x: 1, y: 1, id: GRASS_L, wall: WALL_MIDDLE }, { x: 2, y: 1, id: GRASS_D, wall: WALL_MIDDLE }, { x: 3, y: 1, id: GRASS_L, wall: WALL_RIGHT }, { x: 4, y: 1, id: GRASS_D }, { x: 5, y: 1, id: GRASS_L },
        { x: 0, y: 2, id: GRASS_L, monster: MONSTER }, { x: 1, y: 2, id: GRASS_D, tree: TREE }, { x: 2, y: 2, id: GRASS_L }, { x: 3, y: 2, id: GRASS_D }, { x: 4, y: 2, id: GRASS_L }, { x: 5, y: 2, id: GRASS_D },
        { x: 0, y: 3, id: GRASS_D }, { x: 1, y: 3, id: GRASS_L }, { x: 2, y: 3, id: GRASS_D }, { x: 3, y: 3, id: GRASS_L, wall: WALL_LEFT }, { x: 4, y: 3, id: GRASS_D, wall: WALL_MIDDLE }, { x: 5, y: 3, id: GRASS_L, wall: WALL_RIGHT },
        { x: 0, y: 4, id: GRASS_L }, { x: 1, y: 4, id: GRASS_D }, { x: 2, y: 4, id: GRASS_L, tree: TREE }, { x: 3, y: 4, id: GRASS_D, tree: TREE }, { x: 4, y: 4, id: GRASS_L }, { x: 5, y: 4, id: GRASS_D, equipment: KILL_DARGON_KNIFE },
        { x: 0, y: 5, id: GRASS_D }, { x: 1, y: 5, id: GRASS_L }, { x: 2, y: 5, id: GRASS_D }, { x: 3, y: 5, id: GRASS_L }, { x: 4, y: 5, id: GRASS_D }, { x: 5, y: 5, id: GRASS_L }
    ]

    private equipmentConfig: { [index: string]: Equipment } = {}
    private npcConfig: { [index: string]: Npc } = {}
    private monsterConfig: { [index: string]: Monster } = {}



    constructor() {
        super(0, 0);

        this.init();
    }
    // 好像只调用了一次…… 初始化……
    init() {
        this.grid = new astar.Grid(COL_NUM, ROW_NUM);

        for (let item of this.config) {
            const img = item.id == GRASS_L ? grassLight : grassDark;
            const tile = new Bitmap(TILE_SIZE * item.x, TILE_SIZE * item.y, img);
            this.grid.setWalkable(item.x, item.y, true);
            this.addChild(tile);

            if (item.tree) {
                const tile = new Bitmap(TILE_SIZE * item.x, TILE_SIZE * item.y, tree);
                this.grid.setWalkable(item.x, item.y, false);
                this.addChild(tile);
            }
            if (item.wall) {
                const img = item.wall == WALL_MIDDLE ? wall_middle : (item.wall == WALL_LEFT ? wall_left : wall_right);
                const tile = new Bitmap(TILE_SIZE * item.x, TILE_SIZE * item.y, img);
                this.grid.setWalkable(item.x, item.y, false);
                this.addChild(tile);
            }
            if (item.equipment) {
                // const tile = new Bitmap(TILE_SIZE * item.x, TILE_SIZE * item.y, knife);
                // this.addChild(tile);

                const equipmentView = new Bitmap(TILE_SIZE * item.x, TILE_SIZE * item.y, knife);
                const equipmentTiem = new Equipment();
                equipmentTiem.view = equipmentView;
                equipmentTiem.name = '屠龙刀'
                equipmentTiem.attack = 35;
                equipmentTiem.x = item.x;
                equipmentTiem.y = item.y;
                const key = item.x + '_' + item.y;
                this.equipmentConfig[key] = equipmentTiem;
                this.addChild(equipmentView);
            }

            if (item.monster) {
                const monsterView = new Bitmap(TILE_SIZE * item.x, TILE_SIZE * item.y, captain);
                const monsterItem = new Monster();
                monsterItem.name = '队长';
                monsterItem.view = monsterView;
                monsterItem.hp = 120;
                monsterItem.x = item.x;
                monsterItem.y = item.y;
                const key = item.x + '_' + item.y;
                this.monsterConfig[key] = monsterItem;
                this.addChild(monsterView);
            }

            if (item.npc) {
                const npcView = new Bitmap(TILE_SIZE * item.x, TILE_SIZE * item.y, gjl);
                const npcItem = new Npc(1, 'DDF');
                npcItem.view = npcView;
                npcItem.x = item.x;
                npcItem.y = item.y;
                const key = item.x + '_' + item.y;
                this.npcConfig[key] = npcItem;
                this.addChild(npcView);
            }
        }
    }

    getNodeInfo(row: number, col: number) {
        for (let item of this.config) {
            if (item.x == row && item.y == col) {
                return item;
            }
        }
        return null;
    }
    getEquipmentInfo(row: number, col: number) {
        const key = row + '_' + col
        return this.equipmentConfig[key]
    }
    getNpcInfo(row: number, col: number) {
        const key = row + '_' + col;
        return this.npcConfig[key];
    }
    getMonsterInfo(row: number, col: number) {
        const key = row + '_' + col;
        return this.monsterConfig[key];
    }

    deleteEquipment(equipment: Equipment) {
        const key = equipment.x + '_' + equipment.y;
        delete this.equipmentConfig[key];
        this.deleteChild(equipment.view);
    }
    deleteMonster(monster: Monster) {
        const key = monster.x + '_' + monster.y;
        delete this.monsterConfig[key];
        this.deleteChild(monster.view);
    }
}