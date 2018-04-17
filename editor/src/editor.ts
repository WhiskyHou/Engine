import * as fs from 'fs'
import * as path from 'path'
import * as electron from 'electron'


class MissionEditorRender {
    view: HTMLElement;

    constructor(item: any) {
        const container = document.createElement('div');

        const nameContainer = this.setPropertyEditPanel(item, 'name');
        const needLevelContainer = this.setPropertyEditPanel(item, 'needLevel');
        const fromNpcContainer = this.setPropertyEditPanel(item, 'fromNpcId');
        const toNpcContainer = this.setPropertyEditPanel(item, 'toNpcId');
        const button = document.createElement('button');

        container.appendChild(nameContainer);
        container.appendChild(needLevelContainer);
        container.appendChild(fromNpcContainer);
        container.appendChild(toNpcContainer);
        container.appendChild(button);

        button.innerText = '确认';
        button.onclick = () => {
            const nodes = nameContainer.childNodes;
            for (let i = 0; i < nodes.length; ++i) {
                const node = nodes.item(i);
                // TODO
            }
        }

        this.view = container;
    }


    private setPropertyEditPanel(item: any, type: string): HTMLDivElement {
        let container = document.createElement('div');

        const propertyName = document.createElement('span');
        const propertyValue = document.createElement('input');

        for (let key in item) {
            if (key == type) {
                container.id = key;
                propertyName.innerText = key;
                propertyValue.value = item[key];
            }
        }

        container.appendChild(propertyName);
        container.appendChild(propertyValue);

        return container;
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


const missionConfigPath = path.resolve(__dirname, '../../runtime/config/mission.json');
const content = fs.readFileSync(missionConfigPath, 'utf-8');
const jsonData = JSON.parse(content);

const missionEditorChoice = document.getElementById("missionEditorChoice");
const missionEditorContent = document.getElementById("missionEditorContent");


class MissionEditor {

    viewChoice: HTMLElement;

    viewContent: HTMLElement;

    jsonData: any;

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
        const select = document.createElement('select');
        for (let mission of missions) {
            // for (let key in mission) {
            //     if (key == 'name') {
            const option = document.createElement('option');
            option.value = mission.id;
            option.innerText = mission.name;
            select.appendChild(option);
            //     }
            // }
        }
        const button = document.createElement('button');
        button.innerText = '切换';
        button.onclick = () => {
            const id = select.options[select.selectedIndex].value;
            this.updateContent(id);
        }

        this.viewChoice.appendChild(select);
        this.viewChoice.appendChild(button);
    }

    initContent(missions: any) {
        this.nameContainerItem = new PropertyItem('name', '');
        this.needLevelContainerItem = new PropertyItem('needLeve', '');
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

    private setPropertyEditPanel(item: any, type: string): HTMLDivElement {
        const container = document.createElement('div');

        const propertyName = document.createElement('span');
        const propertyValue = document.createElement('input');

        propertyName.innerText = type;
        propertyValue.value = item[type];
        propertyValue.name = type;

        container.appendChild(propertyName);
        container.appendChild(propertyValue);

        return container;
    }
}


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


const missionEditor = new MissionEditor(missionEditorChoice, missionEditorContent, jsonData);
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