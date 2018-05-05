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
var electron = require('electron');
var path = require('path');
var ipcRenderer = electron.ipcRenderer;
var button = document.getElementById('button');
if (button) {
    button.onclick = function () {
        ipcRenderer.send('onclick', 'go');
    };
}
/**
 * 获取历史记录
 *
 * 返回app.json地址
 */
function getConfigPath() {
    var dir = path.join(electron.remote.app.getPath("appData"), "TSengine");
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
    var configFilepath = path.join(dir, 'app.json');
    if (!fs.existsSync(configFilepath)) {
        fs.writeFileSync(configFilepath, '{}', 'utf-8');
    }
    return configFilepath;
}
function parseConfig() {
    var content = fs.readFileSync(configFilepath, 'utf-8');
    var config = JSON.parse(content);
    var gameUrl = config.gameUrl;
    return gameUrl;
}
var configFilepath = getConfigPath();
var historyUrl = parseConfig();
var historyDiv = document.getElementById('history');
if (historyDiv) {
    var item = document.createElement('button');
    item.innerText = historyUrl;
    item.onclick = function () {
        ipcRenderer.send('onclick', historyUrl);
    };
    historyDiv.appendChild(item);
}
