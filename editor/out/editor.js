"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
}
Object.defineProperty(exports, "__esModule", { value: true });
var fs = __importStar(require("fs"));
var path = __importStar(require("path"));
/**
 * 任务属性编辑器
 */
var MissionEditor = /** @class */ (function () {
    function MissionEditor(choice, content, data) {
        this.viewChoice = choice;
        this.viewContent = content;
        this.jsonData = data;
        this.initChoice(this.jsonData.mission);
        this.initContent(this.jsonData.mission);
    }
    MissionEditor.prototype.initChoice = function (missions) {
        var _this = this;
        this.choiceSelect = document.createElement('select');
        this.updateChoice(missions);
        var button = document.createElement('button');
        button.innerText = '切换';
        button.onclick = function () {
            var id = _this.choiceSelect.options[_this.choiceSelect.selectedIndex].value;
            _this.updateContent(id);
        };
        this.viewChoice.appendChild(this.choiceSelect);
        this.viewChoice.appendChild(button);
    };
    MissionEditor.prototype.updateChoice = function (missions) {
        this.choiceSelect.innerText = '';
        for (var _i = 0, missions_1 = missions; _i < missions_1.length; _i++) {
            var mission = missions_1[_i];
            // for (let key in mission) {
            //     if (key == 'name') {
            var option = document.createElement('option');
            option.value = mission.id;
            option.innerText = mission.name;
            this.choiceSelect.appendChild(option);
            //     }
            // }
        }
    };
    MissionEditor.prototype.initContent = function (missions) {
        var _this = this;
        this.nameContainerItem = new PropertyItem('name', '');
        this.needLevelContainerItem = new PropertyItem('needLevel', '');
        this.fromNpcContainerItem = new PropertyItem('fromNpcId', '');
        this.toNpcContainerItem = new PropertyItem('toNpcId', '');
        var button = document.createElement('button');
        this.viewContent.appendChild(this.nameContainerItem.container);
        this.viewContent.appendChild(this.needLevelContainerItem.container);
        this.viewContent.appendChild(this.fromNpcContainerItem.container);
        this.viewContent.appendChild(this.toNpcContainerItem.container);
        this.viewContent.appendChild(button);
        button.innerText = '保存';
        button.onclick = function () {
            _this.currentMission.name = _this.nameContainerItem.getValue();
            _this.currentMission.needLevel = _this.needLevelContainerItem.getValue();
            _this.currentMission.fromNpcId = _this.fromNpcContainerItem.getValue();
            _this.currentMission.toNpcId = _this.toNpcContainerItem.getValue();
            _this.updateChoice(_this.jsonData.mission);
            _this.saveAndReload();
        };
        this.updateContent('1');
    };
    MissionEditor.prototype.updateContent = function (id) {
        var currentMission = null;
        for (var _i = 0, _a = jsonData.mission; _i < _a.length; _i++) {
            var mission = _a[_i];
            if (mission.id == id) {
                currentMission = mission;
            }
        }
        this.currentMission = currentMission;
        if (currentMission) {
            this.nameContainerItem.update('name', currentMission.name);
            this.needLevelContainerItem.update('needLevel', currentMission.needLevel);
            this.fromNpcContainerItem.update('fromNpcId', currentMission.fromNpcId);
            this.toNpcContainerItem.update('toNpcId', currentMission.toNpcId);
        }
    };
    MissionEditor.prototype.saveAndReload = function () {
        var content = JSON.stringify(jsonData, null, '\t');
        fs.writeFileSync(missionConfigPath, content);
        var runtime = document.getElementById("runtime");
        if (runtime) {
            runtime.reload();
        }
    };
    return MissionEditor;
}());
/**
 * 属性编辑项
 */
var PropertyItem = /** @class */ (function () {
    function PropertyItem(propertyName, propertyValue) {
        this.container = document.createElement('div');
        this.name = document.createElement('span');
        this.content = document.createElement('input');
        this.container.appendChild(this.name);
        this.container.appendChild(this.content);
        this.update(propertyName, propertyValue);
    }
    PropertyItem.prototype.update = function (propertyName, propertyValue) {
        this.name.innerText = propertyName;
        this.content.value = propertyValue;
    };
    PropertyItem.prototype.getValue = function () {
        return this.content.value;
    };
    return PropertyItem;
}());
// 读取任务配置文件
var missionConfigPath = path.resolve(__dirname, '../../runtime/config/mission.json');
var content = fs.readFileSync(missionConfigPath, 'utf-8');
var jsonData = JSON.parse(content);
// 拿到任务选择和任务编辑节点
var missionEditorChoice = document.getElementById("missionEditorChoice");
var missionEditorContent = document.getElementById("missionEditorContent");
// 创建任务编辑器
var missionEditor = new MissionEditor(missionEditorChoice, missionEditorContent, jsonData);
