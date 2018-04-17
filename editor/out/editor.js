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
var MissionEditorRender = /** @class */ (function () {
    function MissionEditorRender(item) {
        var container = document.createElement('div');
        var nameContainer = this.setPropertyEditPanel(item, 'name');
        var needLevelContainer = this.setPropertyEditPanel(item, 'needLevel');
        var fromNpcContainer = this.setPropertyEditPanel(item, 'fromNpcId');
        var toNpcContainer = this.setPropertyEditPanel(item, 'toNpcId');
        var button = document.createElement('button');
        container.appendChild(nameContainer);
        container.appendChild(needLevelContainer);
        container.appendChild(fromNpcContainer);
        container.appendChild(toNpcContainer);
        container.appendChild(button);
        button.innerText = '确认';
        button.onclick = function () {
            var nodes = nameContainer.childNodes;
            for (var i = 0; i < nodes.length; ++i) {
                var node = nodes.item(i);
                // TODO
            }
        };
        this.view = container;
    }
    MissionEditorRender.prototype.setPropertyEditPanel = function (item, type) {
        var container = document.createElement('div');
        var propertyName = document.createElement('span');
        var propertyValue = document.createElement('input');
        for (var key in item) {
            if (key == type) {
                container.id = key;
                propertyName.innerText = key;
                propertyValue.value = item[key];
            }
        }
        container.appendChild(propertyName);
        container.appendChild(propertyValue);
        return container;
    };
    MissionEditorRender.prototype.saveAndReload = function () {
        var content = JSON.stringify(jsonData, null, '\t');
        fs.writeFileSync(missionConfigPath, content);
        var runtime = document.getElementById("runtime");
        if (runtime) {
            runtime.reload();
        }
    };
    return MissionEditorRender;
}());
var missionConfigPath = path.resolve(__dirname, '../../runtime/config/mission.json');
var content = fs.readFileSync(missionConfigPath, 'utf-8');
var jsonData = JSON.parse(content);
var missionEditorChoice = document.getElementById("missionEditorChoice");
var missionEditorContent = document.getElementById("missionEditorContent");
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
        var select = document.createElement('select');
        for (var _i = 0, missions_1 = missions; _i < missions_1.length; _i++) {
            var mission = missions_1[_i];
            // for (let key in mission) {
            //     if (key == 'name') {
            var option = document.createElement('option');
            option.value = mission.id;
            option.innerText = mission.name;
            select.appendChild(option);
            //     }
            // }
        }
        var button = document.createElement('button');
        button.innerText = '切换';
        button.onclick = function () {
            var id = select.options[select.selectedIndex].value;
            _this.updateContent(id);
        };
        this.viewChoice.appendChild(select);
        this.viewChoice.appendChild(button);
    };
    MissionEditor.prototype.initContent = function (missions) {
        var _this = this;
        this.nameContainerItem = new PropertyItem('name', '');
        this.needLevelContainerItem = new PropertyItem('needLeve', '');
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
    MissionEditor.prototype.setPropertyEditPanel = function (item, type) {
        var container = document.createElement('div');
        var propertyName = document.createElement('span');
        var propertyValue = document.createElement('input');
        propertyName.innerText = type;
        propertyValue.value = item[type];
        propertyValue.name = type;
        container.appendChild(propertyName);
        container.appendChild(propertyValue);
        return container;
    };
    return MissionEditor;
}());
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
var missionEditor = new MissionEditor(missionEditorChoice, missionEditorContent, jsonData);
// missionEditor.initChoice(jsonData.mission);
// missionEditor.initContent(jsonData.mission);
// if (missionChoice) {
//     for (let item of jsonData.mission) {
//         // console.log(item)
//         for (let key in item) {
//             // console.log(key)
//             if (key == 'name') {
//                 const option = document.createElement('option');
//                 option.value = item.id;
//                 option.innerText = item[key];
//                 missionChoice.appendChild(option);
//             }
//         }
//     }
// }
// if (missionEditorContent) {
//     for (let item of jsonData.mission) {
//         const itemRender = new MissionEditorRender(item);
//         missionEditorContent.appendChild(itemRender.view)
//     }
// }
