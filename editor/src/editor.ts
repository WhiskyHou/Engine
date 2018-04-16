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

const missionEditorContent = document.getElementById("missionEditorContent");

if (missionEditorContent) {
    for (let item of jsonData.mission) {
        const itemRender = new MissionEditorRender(item);
        missionEditorContent.appendChild(itemRender.view)
    }
}