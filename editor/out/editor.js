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
var missionEditorContent = document.getElementById("missionEditorContent");
if (missionEditorContent) {
    for (var _i = 0, _a = jsonData.mission; _i < _a.length; _i++) {
        var item = _a[_i];
        var itemRender = new MissionEditorRender(item);
        missionEditorContent.appendChild(itemRender.view);
    }
}
