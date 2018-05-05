import * as menu from './menu'
import * as fs from 'fs'
const electron = require('electron')
const path = require('path')


const ipcRenderer = electron.ipcRenderer

const button = document.getElementById('button');
if (button) {
    button.onclick = () => {
        ipcRenderer.send('onclick', 'go');
    }
}

/**
 * 获取历史记录
 * 
 * 返回app.json地址
 */
function getConfigPath() {
    const dir = path.join(electron.remote.app.getPath("appData"), "TSengine");
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
    const configFilepath = path.join(dir, 'app.json');
    if (!fs.existsSync(configFilepath)) {
        fs.writeFileSync(configFilepath, '{}', 'utf-8');
    }
    return configFilepath;
}


/**
 * 
 */
function parseConfig() {
    const content = fs.readFileSync(configFilepath, 'utf-8');
    const config = JSON.parse(content);
    const gameUrl = config.gameUrl;

    return gameUrl;
}


const configFilepath = getConfigPath();

const historyUrl = parseConfig();

if (historyUrl) {
    const historyDiv = document.getElementById('history');
    if (historyDiv) {
        const item = document.createElement('button');
        item.innerText = historyUrl;
        item.onclick = () => {
            ipcRenderer.send('onclick', historyUrl);
        }
        historyDiv.appendChild(item);
    }
}
else {

}


