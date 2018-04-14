import * as fs from 'fs'
import * as path from 'path'
import * as electron from 'electron'


class MissionEditorRender {
    view: HTMLElement;

    constructor(item: any) {
        const container = document.createElement('div');
        const propertyName = document.createElement('span');
        const propertyValue = document.createElement('input');
        const button = document.createElement('button')

        container.appendChild(propertyName);
        container.appendChild(propertyValue);
        container.appendChild(button);

        propertyName.innerText = '12333';
        propertyValue.value = item.name;
        button.innerText = 'submit';

        button.onclick = () => {
            item.name = propertyValue.value;
            this.saveAndReload();
        }

        this.view = container;
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