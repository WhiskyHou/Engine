"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * 任务管理器
 */
var MissionManager = /** @class */ (function (_super) {
    __extends(MissionManager, _super);
    function MissionManager() {
        var _this = _super.call(this) || this;
        _this.missions = [];
        // mission 1
        var mission1Going = function (eventData) {
            if (eventData.name === '屠龙刀') {
                mission1.current++;
                console.log('任务1进度加啦！！！！');
            }
        };
        var mission1Reward = function () {
            player.levelUp();
        };
        var mission1 = new Mission('pickEquipment', mission1Going, mission1Reward);
        mission1.id = 1;
        mission1.name = "捡起屠龙宝刀!";
        mission1.needLevel = 1;
        mission1.fromNpcId = 1;
        mission1.toNpcId = 1;
        mission1.status = MissionStatus.CAN_ACCEPT;
        _this.missions.push(mission1);
        // mission 2
        var mission2Going = function (eventData) {
            if (eventData.name === '队长') {
                mission2.current++;
                console.log('任务2进度加啦！！！！');
            }
        };
        var mission2Reward = function () {
            player.levelUp();
        };
        var mission2 = new Mission('fightWithMonster', mission2Going, mission2Reward);
        mission2.id = 2;
        mission2.name = "打败队长!";
        mission2.needLevel = 2;
        mission2.fromNpcId = 1;
        mission2.toNpcId = 1;
        mission2.status = MissionStatus.UNACCEPT;
        _this.missions.push(mission2);
        _this.init();
        return _this;
    }
    MissionManager.prototype.init = function () {
        var _this = this;
        player.addEventListener('userChange', function (eventData) {
            _this.update();
        });
        this.update();
    };
    MissionManager.prototype.update = function () {
        for (var _i = 0, _a = this.missions; _i < _a.length; _i++) {
            var mission = _a[_i];
            mission.update();
        }
        this.dispatchEvent('missionUpdate', {});
    };
    MissionManager.prototype.accept = function (mission) {
        mission.isAccepted = true;
        this.update();
    };
    MissionManager.prototype.submit = function (mission) {
        mission.isSubmit = true;
        this.update();
    };
    return MissionManager;
}(EventDispatcher));
