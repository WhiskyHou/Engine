import * as fs from 'fs'
import * as path from 'path'
import * as electron from 'electron'


/**
 * 任务属性编辑器
 */
class MissionEditor {
    jsonData: any;

    viewChoice: HTMLElement;
    private choiceSelect: HTMLSelectElement;

    viewContent: HTMLElement;
    private nameContainerItem: PropertyItem;
    private needLevelContainerItem: PropertyItem;
    private fromNpcContainerItem: PropertyItem;
    private toNpcContainerItem: PropertyItem;

    private currentMission: any;

    constructor(choice: any, content: any, data: any) {
        this.viewChoice = choice;
        this.viewContent = content;
        this.jsonData = data;

        this.initChoice(this.jsonData.mission);
        this.initContent(this.jsonData.mission);
    }

    initChoice(missions: any) {
        this.choiceSelect = document.createElement('select');

        this.updateChoice(missions);

        const button = document.createElement('button');
        button.innerText = '切换';
        button.onclick = () => {
            const id = this.choiceSelect.options[this.choiceSelect.selectedIndex].value;
            this.updateContent(id);
        }

        this.viewChoice.appendChild(this.choiceSelect);
        this.viewChoice.appendChild(button);
    }

    updateChoice(missions: any) {
        this.choiceSelect.innerText = '';
        for (let mission of missions) {
            // for (let key in mission) {
            //     if (key == 'name') {
            const option = document.createElement('option');
            option.value = mission.id;
            option.innerText = mission.name;
            this.choiceSelect.appendChild(option);
            //     }
            // }
        }
    }

    initContent(missions: any) {
        this.nameContainerItem = new PropertyItem('name', '');
        this.needLevelContainerItem = new PropertyItem('needLevel', '');
        this.fromNpcContainerItem = new PropertyItem('fromNpcId', '');
        this.toNpcContainerItem = new PropertyItem('toNpcId', '');
        const button = document.createElement('button');

        this.viewContent.appendChild(this.nameContainerItem.container);
        this.viewContent.appendChild(this.needLevelContainerItem.container);
        this.viewContent.appendChild(this.fromNpcContainerItem.container);
        this.viewContent.appendChild(this.toNpcContainerItem.container);
        this.viewContent.appendChild(button);

        button.innerText = '保存';
        button.onclick = () => {
            this.currentMission.name = this.nameContainerItem.getValue();
            this.currentMission.needLevel = this.needLevelContainerItem.getValue();
            this.currentMission.fromNpcId = this.fromNpcContainerItem.getValue();
            this.currentMission.toNpcId = this.toNpcContainerItem.getValue();

            this.updateChoice(this.jsonData.mission);

            this.saveAndReload();
        }

        this.updateContent('1');
    }

    updateContent(id: string) {
        let currentMission = null;
        for (let mission of jsonData.mission) {
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
    }

    private saveAndReload() {
        const content = JSON.stringify(jsonData, null, '\t');
        fs.writeFileSync(missionConfigPath, content);
        const runtime = document.getElementById("runtime") as electron.WebviewTag;
        if (runtime) {
            runtime.reload()
        }
    }
}

/**
 * 属性编辑项
 */
class PropertyItem {

    container: HTMLDivElement;

    name: HTMLSpanElement;

    content: HTMLInputElement;

    constructor(propertyName: string, propertyValue: string) {
        this.container = document.createElement('div');
        this.name = document.createElement('span');
        this.content = document.createElement('input');

        this.container.appendChild(this.name);
        this.container.appendChild(this.content);

        this.update(propertyName, propertyValue);
    }

    update(propertyName: string, propertyValue: string) {
        this.name.innerText = propertyName;
        this.content.value = propertyValue;
    }

    getValue() {
        return this.content.value;
    }
}


// 读取任务配置文件
const missionConfigPath = path.resolve(__dirname, '../../runtime/config/mission.json');
const content = fs.readFileSync(missionConfigPath, 'utf-8');
const jsonData = JSON.parse(content);

// 拿到任务选择和任务编辑节点
const missionEditorChoice = document.getElementById("missionEditorChoice");
const missionEditorContent = document.getElementById("missionEditorContent");

// 创建任务编辑器
const missionEditor = new MissionEditor(missionEditorChoice, missionEditorContent, jsonData);
