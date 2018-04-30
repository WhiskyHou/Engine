import * as fs from 'fs'
import * as path from 'path'
import * as electron from 'electron'
import * as menu from './menu'
import { editorHistory, TestCommand, Command } from './history'

menu.run();


/**
 * 事件派发器
 */
class EventDispatcher {
    private listeners: { type: string, callback: Function }[] = [];

    dispatchEvent(type: string, eventData: any) {
        for (let listener of this.listeners) {
            if (listener.type == type) {
                listener.callback(eventData);
            }
        }
    }

    addEventListener(type: string, callback: Function) {
        this.listeners.push({ type, callback });
    }

    deleteEventListener(type: string, callback: Function) {
        for (let listener of this.listeners) {
            if (listener.type == type && listener.callback == callback) {
                const index = this.listeners.indexOf(listener)
                this.listeners.splice(index, 1)
                break;
            }
        }
    }

    deleteAllEventListener() {
        if (this.listeners.length > 0) {
            this.listeners.splice(0);
        }
    }
}


/**
 * 属性编辑命令
 */
class PropertyEditCommand implements Command {

    object: any

    from: any

    to: any

    key: string

    inspector: PropertyEditor

    input: HTMLInputElement | HTMLSelectElement


    constructor(object: any, from: any, to: any, key: string, inspector: PropertyEditor, input: HTMLInputElement | HTMLSelectElement) {
        this.object = object;
        this.from = from;
        this.to = to;
        this.key = key;
        this.inspector = inspector;
        this.input = input;
    }

    execute(): void {

    }
    revert(): void {
    }
}


/**
 * 编辑器单项item的元数据 规范
 */
interface PropertyMetadata {
    key: string;
    description: string;
    type: "input" | "dropdown" | "primarykey";
    default: any;
    options?: {
        // dropdown类型的才有这个
        filepath: string;
        prefix: string
    }
}

/**
 * 整体编辑器的元数据 规范
 */
interface DataMetadata {
    filepath: string;
    prefix: string;
    title: string;
    propertyMetadatas: PropertyMetadata[]
}

/**
 * 元数据 具体数据
 */
const metadatas: DataMetadata[] = [
    {   // 任务编辑器 元数据
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
    {   // NPC编辑器 元数据
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
]


/**
 * 属性编辑器
 */
class PropertyEditor {

    view: HTMLElement;

    private jsonData: any;

    private data: any[] = [];

    private currentEditObject: any;

    private dataMetadata: DataMetadata;

    private appendButton: HTMLElement;

    private removeButton: HTMLElement;

    private propertyItemArray: PropertyItem[] = []

    private propertyEditorChoice: HTMLSelectElement;

    private propertyEditorBody: HTMLDivElement;



    constructor(dataMetadata: DataMetadata) {
        this.dataMetadata = dataMetadata;

        const file = fs.readFileSync(dataMetadata.filepath, 'utf-8');
        this.jsonData = JSON.parse(file);

        this.data = this.jsonData[dataMetadata.prefix];

        this.view = document.createElement('div');
        this.propertyEditorChoice = document.createElement('select');
        this.propertyEditorBody = document.createElement('div');
        this.appendButton = document.createElement('button'); this.appendButton.innerText = '添加';
        this.removeButton = document.createElement('button'); this.removeButton.innerText = '删除';

        this.view.appendChild(this.propertyEditorChoice);
        this.view.appendChild(this.appendButton);
        this.view.appendChild(this.removeButton);
        this.view.appendChild(this.propertyEditorBody);

        this.init();
    }

    init() {
        // 初始化当前编辑对象
        if (this.data.length > 0) {
            this.currentEditObject = this.data[0];
        } else {
            this.currentEditObject = null;
        }


        // 初始化选择器
        for (let object of this.data) {
            const option = document.createElement('option');
            option.value = object.id;
            option.innerText = object.name;
            this.propertyEditorChoice.appendChild(option);
        }

        // 选择器改变后更新所有属性单项的数据
        this.propertyEditorChoice.onchange = () => {
            const id = this.propertyEditorChoice.value;
            this.updateCurrentEditObject(id);
            for (let propertyItem of this.propertyItemArray) {
                propertyItem.update(this.currentEditObject);
            }
        }

        // 初始化各个属性编辑单项
        for (let propertyMetadata of this.dataMetadata.propertyMetadatas) {
            const propertyItem = new PropertyItem(propertyMetadata, this.currentEditObject);
            this.propertyItemArray.push(propertyItem);
            this.propertyEditorBody.appendChild(propertyItem.view);

            propertyItem.addEventListener('onfocus', () => {

            });
            propertyItem.addEventListener('onblur', () => {
                const temp = propertyItem.getValue();
                this.currentEditObject[propertyItem.key] = temp;
            });
        }


        // 添加按钮事件
        this.appendButton.onclick = () => {
            const newObject: any = {};
            for (let metadata of this.dataMetadata.propertyMetadatas) {
                if (metadata.type == "primarykey") {
                    newObject[metadata.key] = parseInt(this.data[this.data.length - 1][metadata.key]) + 1;
                }
                else {
                    newObject[metadata.key] = metadata.default;
                }
            }

            this.data.push(newObject);
            this.updata();
            // this.saveAndReload();
        }

        this.removeButton.onclick = () => {
            const index = this.data.indexOf(this.currentEditObject);
            if (index >= 0) {
                this.data.splice(index, 1)
                this.updata();
            }
            // this.saveAndReload();
        }
    }

    updata() {
        /**
         * 重新加载编辑器
         */

        // 重新加载选择栏
        this.propertyEditorChoice.innerText = '';
        for (let object of this.data) {
            const option = document.createElement('option');
            option.value = object.id;
            option.innerText = object.name;
            this.propertyEditorChoice.appendChild(option);
        }

        // 将各个属性编辑单项回到第一个对象
        if (this.data.length > 0) {
            this.currentEditObject = this.data[0];
        } else {
            this.currentEditObject = null;
        }
        for (let propertyItem of this.propertyItemArray) {
            propertyItem.update(this.currentEditObject);
        }
    }

    updateCurrentEditObject(id: string) {
        for (let object of this.data) {
            if (object.id == id) {
                this.currentEditObject = object;
            }
        }
    }

    saveAndReload() {
        const content = JSON.stringify(this.jsonData, null, '\t');
        fs.writeFileSync(this.dataMetadata.filepath, content);
        const runtime = document.getElementById("runtime") as electron.WebviewTag;
        if (runtime) {
            runtime.reload()
        }
    }
}

/**
 * 属性编辑项
 */
class PropertyItem extends EventDispatcher {

    view: HTMLElement;

    key: string;

    private name: HTMLSpanElement;

    private content: HTMLInputElement | HTMLSelectElement;

    private metadata: PropertyMetadata;


    constructor(metadata: PropertyMetadata, currentEditObject: any) {
        super();

        this.metadata = metadata;
        this.key = metadata.key;

        this.view = document.createElement('div');
        this.name = document.createElement('span');
        if (metadata.type == 'input') {
            this.content = document.createElement('input');
        } else if (metadata.type == 'dropdown') {
            this.content = document.createElement('select');
            const optionMetadata = metadata.options;
            if (optionMetadata) {
                const file = fs.readFileSync(optionMetadata.filepath, 'utf-8');
                const jsonData = JSON.parse(file);
                const items = jsonData[optionMetadata.prefix];
                for (let item of items) {
                    const option = document.createElement('option');
                    option.value = item.id;
                    option.innerText = item.name;
                    this.content.appendChild(option);
                }
            }
        } else if (metadata.type == 'primarykey') {
            this.content = document.createElement('input');
            this.content.disabled = true;
        }

        this.content.onfocus = () => {
            this.dispatchEvent('onfocus', null);
        }
        this.content.onblur = () => {
            this.dispatchEvent('onblur', null);
        }

        this.name.innerText = metadata.description;

        this.view.appendChild(this.name);
        this.view.appendChild(this.content);

        this.update(currentEditObject);
    }

    update(currentEditObject: any) {
        this.content.value = currentEditObject[this.key];
    }

    getValue() {
        return this.content.value;
    }
}


/**
 * 切换编辑器
 */
function changeEditor(metadata: DataMetadata) {
    const propertyEditorTitle = document.getElementById('propertyEditorTitle');
    const propertyEditorContainer = document.getElementById('propertyEditorContainer');
    if (propertyEditorTitle && propertyEditorContainer) {
        propertyEditorTitle.innerText = metadata.title;
        propertyEditorContainer.innerText = '';

        propertyEditor = new PropertyEditor(metadata);
        propertyEditorContainer.appendChild(propertyEditor.view);
    }
}


export function save() {
    if (propertyEditor) {
        propertyEditor.saveAndReload();
    }
}



// 初始化inspector
const buttonGroup = document.getElementById('buttonGroup');
if (buttonGroup) {
    for (const metadata of metadatas) {
        const button = document.createElement('button');
        button.innerText = metadata.title;
        buttonGroup.appendChild(button);
        button.onclick = () => {
            changeEditor(metadata);
        }
    }
}
let propertyEditor: PropertyEditor;





// 撤销恢复功能测试
let count = 0;
const button = document.getElementById('go');
if (button) {
    button.onclick = () => {
        const command = new TestCommand(count, ++count);
        editorHistory.add(command);
    };
}
