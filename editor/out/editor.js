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
 * 元数据 具体数据
 */
var metadastas = [
    {
        filepath: path.resolve(__dirname, '../../runtime/config/mission.json'),
        prefix: 'mission',
        title: '任务编辑器',
        propertyMetadatas: [
            { key: 'id', description: '编号', type: 'primarykey', default: '0' },
            { key: 'name', description: '标题', type: 'input', default: 'new mission' },
            { key: 'needLevel', description: '限制等级', type: 'input', default: '1' },
            { key: 'fromNpcId', description: '接受方', type: 'dropdown', default: '1', options: { filepath: path.resolve(__dirname, '../../runtime/config/npc.json'), prefix: 'npc' } },
            { key: 'toNpcId', description: '提交方', type: 'dropdown', default: '1', options: { filepath: path.resolve(__dirname, '../../runtime/config/npc.json'), prefix: 'npc' } }
        ]
    },
    {
        filepath: path.resolve(__dirname, '../../runtime/config/npc.json'),
        prefix: 'npc',
        title: 'NPC编辑器',
        propertyMetadatas: [
            { key: 'id', description: '编号', type: 'primarykey', default: '0' },
            { key: 'name', description: '名字', type: 'input', default: '吴' },
            { key: 'view', description: '图片', type: 'input', default: '' },
            { key: 'head', description: '头像', type: 'input', default: '' }
        ]
    }
];
/**
 * 属性编辑器
 */
var PropertyEditor = /** @class */ (function () {
    function PropertyEditor(dataMetadata) {
        this.data = [];
        this.propertyItemArray = [];
        this.dataMetadata = dataMetadata;
        var file = fs.readFileSync(dataMetadata.filepath, 'utf-8');
        this.jsonData = JSON.parse(file);
        this.data = this.jsonData[dataMetadata.prefix];
        this.view = document.createElement('div');
        this.propertyEditorChoice = document.createElement('select');
        this.propertyEditorBody = document.createElement('div');
        this.switchButton = document.createElement('button');
        this.switchButton.innerText = '切换';
        this.appendButton = document.createElement('button');
        this.appendButton.innerText = '添加';
        this.removeButton = document.createElement('button');
        this.removeButton.innerText = '删除';
        this.saveButton = document.createElement('button');
        this.saveButton.innerText = '保存';
        this.view.appendChild(this.propertyEditorChoice);
        this.view.appendChild(this.switchButton);
        this.view.appendChild(this.appendButton);
        this.view.appendChild(this.removeButton);
        this.view.appendChild(this.propertyEditorBody);
        this.view.appendChild(this.saveButton);
        this.init();
    }
    PropertyEditor.prototype.init = function () {
        var _this = this;
        // 初始化当前编辑对象
        if (this.data.length > 0) {
            this.currentEditObject = this.data[0];
        }
        else {
            this.currentEditObject = null;
        }
        // 初始化选择器
        for (var _i = 0, _a = this.data; _i < _a.length; _i++) {
            var object = _a[_i];
            var option = document.createElement('option');
            option.value = object.id;
            option.innerText = object.name;
            this.propertyEditorChoice.appendChild(option);
        }
        // 初始化各个属性编辑单项
        for (var _b = 0, _c = this.dataMetadata.propertyMetadatas; _b < _c.length; _b++) {
            var propertyMetadata = _c[_b];
            var propertyItem = new PropertyItem(propertyMetadata, this.currentEditObject);
            this.propertyItemArray.push(propertyItem);
            this.propertyEditorBody.appendChild(propertyItem.view);
        }
        // 添加按钮事件
        this.saveButton.onclick = function () {
            for (var _i = 0, _a = _this.propertyItemArray; _i < _a.length; _i++) {
                var propertyItem = _a[_i];
                var temp = propertyItem.getValue();
                _this.currentEditObject[propertyItem.key] = temp;
            }
            _this.updata();
            _this.saveAndReload();
        };
        this.switchButton.onclick = function () {
            var id = _this.propertyEditorChoice.value;
            _this.updateCurrentEditObject(id);
            for (var _i = 0, _a = _this.propertyItemArray; _i < _a.length; _i++) {
                var propertyItem = _a[_i];
                propertyItem.update(_this.currentEditObject);
            }
        };
        this.appendButton.onclick = function () {
            var newObject = {};
            for (var _i = 0, _a = _this.dataMetadata.propertyMetadatas; _i < _a.length; _i++) {
                var metadata = _a[_i];
                if (metadata.type == "primarykey") {
                    newObject[metadata.key] = parseInt(_this.data[_this.data.length - 1][metadata.key]) + 1;
                }
                else {
                    newObject[metadata.key] = metadata.default;
                }
            }
            _this.data.push(newObject);
            _this.updata();
            _this.saveAndReload();
        };
        this.removeButton.onclick = function () {
            var index = _this.data.indexOf(_this.currentEditObject);
            if (index >= 0) {
                _this.data.splice(index, 1);
                _this.updata();
            }
            _this.saveAndReload();
        };
    };
    PropertyEditor.prototype.updata = function () {
        /**
         * 重新加载编辑器
         */
        // 重新加载选择栏
        this.propertyEditorChoice.innerText = '';
        for (var _i = 0, _a = this.data; _i < _a.length; _i++) {
            var object = _a[_i];
            var option = document.createElement('option');
            option.value = object.id;
            option.innerText = object.name;
            this.propertyEditorChoice.appendChild(option);
        }
        // 将各个属性编辑单项回到第一个对象
        if (this.data.length > 0) {
            this.currentEditObject = this.data[0];
        }
        else {
            this.currentEditObject = null;
        }
        for (var _b = 0, _c = this.propertyItemArray; _b < _c.length; _b++) {
            var propertyItem = _c[_b];
            propertyItem.update(this.currentEditObject);
        }
    };
    PropertyEditor.prototype.updateCurrentEditObject = function (id) {
        for (var _i = 0, _a = this.data; _i < _a.length; _i++) {
            var object = _a[_i];
            if (object.id == id) {
                this.currentEditObject = object;
            }
        }
    };
    PropertyEditor.prototype.saveAndReload = function () {
        var content = JSON.stringify(this.jsonData, null, '\t');
        fs.writeFileSync(this.dataMetadata.filepath, content);
        var runtime = document.getElementById("runtime");
        if (runtime) {
            runtime.reload();
        }
    };
    return PropertyEditor;
}());
/**
 * 属性编辑项
 */
var PropertyItem = /** @class */ (function () {
    function PropertyItem(metadata, currentEditObject) {
        this.metadata = metadata;
        this.key = metadata.key;
        this.view = document.createElement('div');
        this.name = document.createElement('span');
        if (metadata.type == 'input') {
            this.content = document.createElement('input');
        }
        else if (metadata.type == 'dropdown') {
            this.content = document.createElement('select');
            var optionMetadata = metadata.options;
            if (optionMetadata) {
                var file = fs.readFileSync(optionMetadata.filepath, 'utf-8');
                var jsonData = JSON.parse(file);
                var items = jsonData[optionMetadata.prefix];
                for (var _i = 0, items_1 = items; _i < items_1.length; _i++) {
                    var item = items_1[_i];
                    var option = document.createElement('option');
                    option.value = item.id;
                    option.innerText = item.name;
                    this.content.appendChild(option);
                }
            }
        }
        else if (metadata.type == 'primarykey') {
            this.content = document.createElement('input');
            this.content.disabled = true;
        }
        this.name.innerText = metadata.description;
        this.view.appendChild(this.name);
        this.view.appendChild(this.content);
        this.update(currentEditObject);
    }
    PropertyItem.prototype.update = function (currentEditObject) {
        this.content.value = currentEditObject[this.key];
    };
    PropertyItem.prototype.getValue = function () {
        return this.content.value;
    };
    return PropertyItem;
}());
// 读取任务配置文件
// const missionConfigPath = path.resolve(__dirname, '../../runtime/config/mission.json');
// const content = fs.readFileSync(missionConfigPath, 'utf-8');
// const jsonData = JSON.parse(content);
// 拿到任务选择和任务编辑节点
// const propertySelect = document.getElementById("propertySelect");
// const propertyContent = document.getElementById("propertyContent");
// 创建任务编辑器
var propertyEditorTitle = document.getElementById('propertyEditorTitle');
var propertyEditorContainer = document.getElementById('propertyEditorContainer');
if (propertyEditorTitle && propertyEditorContainer) {
    propertyEditorTitle.innerText = metadastas[0].title;
    var propertyEditor = new PropertyEditor(metadastas[0]);
    propertyEditorContainer.appendChild(propertyEditor.view);
}
