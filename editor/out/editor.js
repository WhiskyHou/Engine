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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs = __importStar(require("fs"));
var path = __importStar(require("path"));
var menu = __importStar(require("./menu"));
var history_1 = require("./history");
var url_1 = require("url");
menu.run();
/**
 * 事件派发器
 */
var EventDispatcher = /** @class */ (function () {
    function EventDispatcher() {
        this.listeners = [];
    }
    EventDispatcher.prototype.dispatchEvent = function (type, eventData) {
        for (var _i = 0, _a = this.listeners; _i < _a.length; _i++) {
            var listener = _a[_i];
            if (listener.type == type) {
                listener.callback(eventData);
            }
        }
    };
    EventDispatcher.prototype.addEventListener = function (type, callback) {
        this.listeners.push({ type: type, callback: callback });
    };
    EventDispatcher.prototype.deleteEventListener = function (type, callback) {
        for (var _i = 0, _a = this.listeners; _i < _a.length; _i++) {
            var listener = _a[_i];
            if (listener.type == type && listener.callback == callback) {
                var index = this.listeners.indexOf(listener);
                this.listeners.splice(index, 1);
                break;
            }
        }
    };
    EventDispatcher.prototype.deleteAllEventListener = function () {
        if (this.listeners.length > 0) {
            this.listeners.splice(0);
        }
    };
    return EventDispatcher;
}());
/**
 * 属性编辑命令
 */
var PropertyEditCommand = /** @class */ (function () {
    function PropertyEditCommand(object, from, to, key, inspector, input) {
        this.object = object;
        this.from = from;
        this.to = to;
        this.key = key;
        this.inspector = inspector;
        this.input = input;
    }
    PropertyEditCommand.prototype.execute = function () {
        this.object[this.key] = this.to;
        this.input.value = this.to;
        propertyEditor.saveState = false;
        console.log('execute');
        console.log(this.key);
        console.log(this.from, this.to);
    };
    PropertyEditCommand.prototype.revert = function () {
        this.object[this.key] = this.from;
        this.input.value = this.from;
        console.log('revert');
        console.log(this.key);
        console.log(this.from, this.to);
    };
    return PropertyEditCommand;
}());
/**
 * 元数据 具体数据
 */
var metadatas = [
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
        this.appendButton = document.createElement('button');
        this.appendButton.innerText = '添加';
        this.removeButton = document.createElement('button');
        this.removeButton.innerText = '删除';
        this.view.appendChild(this.propertyEditorChoice);
        this.view.appendChild(this.appendButton);
        this.view.appendChild(this.removeButton);
        this.view.appendChild(this.propertyEditorBody);
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
        // 选择器改变后更新所有属性单项的数据
        this.propertyEditorChoice.onchange = function () {
            var id = _this.propertyEditorChoice.value;
            _this.updateCurrentEditObject(id);
            for (var _i = 0, _a = _this.propertyItemArray; _i < _a.length; _i++) {
                var propertyItem = _a[_i];
                propertyItem.update(_this.currentEditObject);
            }
        };
        // 初始化各个属性编辑单项
        for (var _b = 0, _c = this.dataMetadata.propertyMetadatas; _b < _c.length; _b++) {
            var propertyMetadata = _c[_b];
            var propertyItem = new PropertyItem(propertyMetadata, this.currentEditObject);
            this.propertyItemArray.push(propertyItem);
            this.propertyEditorBody.appendChild(propertyItem.view);
        }
        // 添加按钮事件
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
            // this.saveAndReload();
        };
        this.removeButton.onclick = function () {
            var index = _this.data.indexOf(_this.currentEditObject);
            if (index >= 0) {
                _this.data.splice(index, 1);
                _this.updata();
            }
            // this.saveAndReload();
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
        this.saveState = true;
    };
    Object.defineProperty(PropertyEditor.prototype, "saveState", {
        set: function (save) {
            this.hasSaved = save;
            if (this.hasSaved) {
                menu.changeTitle('Engine');
            }
            else {
                menu.changeTitle('尚未保存 *');
            }
        },
        enumerable: true,
        configurable: true
    });
    return PropertyEditor;
}());
/**
 * 属性编辑项
 */
var PropertyItem = /** @class */ (function (_super) {
    __extends(PropertyItem, _super);
    function PropertyItem(metadata, currentEditObject) {
        var _this = _super.call(this) || this;
        _this.metadata = metadata;
        _this.key = metadata.key;
        _this.view = document.createElement('div');
        _this.name = document.createElement('span');
        if (metadata.type == 'input') {
            _this.content = document.createElement('input');
        }
        else if (metadata.type == 'dropdown') {
            _this.content = document.createElement('select');
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
                    _this.content.appendChild(option);
                }
            }
        }
        else if (metadata.type == 'primarykey') {
            _this.content = document.createElement('input');
            _this.content.disabled = true;
        }
        _this.content.onfocus = function () {
            _this.dispatchEvent('onfocus', null);
            _this.from = _this.content.value;
        };
        _this.content.onblur = function () {
            _this.dispatchEvent('onblur', null);
            if (_this.content.value != _this.from) {
                _this.to = _this.content.value;
                var command = new PropertyEditCommand(currentEditObject, _this.from, _this.to, _this.key, propertyEditor, _this.content);
                history_1.editorHistory.add(command);
            }
        };
        _this.name.innerText = metadata.description;
        _this.view.appendChild(_this.name);
        _this.view.appendChild(_this.content);
        _this.update(currentEditObject);
        return _this;
    }
    PropertyItem.prototype.update = function (currentEditObject) {
        this.content.value = currentEditObject[this.key];
    };
    PropertyItem.prototype.getValue = function () {
        return this.content.value;
    };
    PropertyItem.prototype.setValue = function (value) {
        this.content.value = value;
    };
    return PropertyItem;
}(EventDispatcher));
/**
 * 切换编辑器
 */
function changeEditor(metadata) {
    var propertyEditorTitle = document.getElementById('propertyEditorTitle');
    var propertyEditorContainer = document.getElementById('propertyEditorContainer');
    if (propertyEditorTitle && propertyEditorContainer) {
        propertyEditorTitle.innerText = metadata.title;
        propertyEditorContainer.innerText = '';
        propertyEditor = new PropertyEditor(metadata);
        propertyEditorContainer.appendChild(propertyEditor.view);
    }
}
function save() {
    if (propertyEditor) {
        propertyEditor.saveAndReload();
    }
}
exports.save = save;
// 初始化webView
var webView = document.getElementById('runtime');
if (webView) {
    // search 属性是一个可读可写的字符串，可设置或返回当前 URL 的查询部分（问号 ? 之后的部分
    var search = location.search;
    // 解析获得 gameUrl 的值，就是该项目的地址
    var param = new url_1.URLSearchParams(search);
    var gameUrl = decodeURIComponent(param.get('gameUrl'));
    // 设置预览窗口的 url
    webView.setAttribute('src', gameUrl + "/index.html");
}
// 初始化inspector
var buttonGroup = document.getElementById('buttonGroup');
if (buttonGroup) {
    var _loop_1 = function (metadata) {
        var button_1 = document.createElement('button');
        button_1.innerText = metadata.title;
        buttonGroup.appendChild(button_1);
        button_1.onclick = function () {
            changeEditor(metadata);
        };
    };
    for (var _i = 0, metadatas_1 = metadatas; _i < metadatas_1.length; _i++) {
        var metadata = metadatas_1[_i];
        _loop_1(metadata);
    }
}
var propertyEditor;
// 撤销恢复功能测试
var count = 0;
var button = document.getElementById('go');
if (button) {
    button.onclick = function () {
        var command = new history_1.TestCommand(count, ++count);
        history_1.editorHistory.add(command);
    };
}
