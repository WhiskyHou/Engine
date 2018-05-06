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
/**
 * 从app.json解析出历史项目文件夹地址
 */
function parseConfig() {
    var content = fs.readFileSync(configFilepath, 'utf-8');
    var config = JSON.parse(content);
    var gameUrl = config.gameUrl;
    return gameUrl;
}
/**
 * 打开文件夹选择窗口
 */
function openSelectWindow(callback) {
    electron.remote.dialog.showOpenDialog({
        title: "选项项目文件夹",
        properties: ["openDirectory"]
    }, function (dirs) {
        if (dirs) {
            callback(dirs[0]);
        }
    });
}
/**
 * 选择文件夹的回调函数，用来检测选择的文件夹是否是项目文件
 */
function onSelectProject(gameURL) {
    if (fs.existsSync(gameURL + "/engineproj.json")) {
        var data = { gameUrl: gameURL };
        fs.writeFileSync(configFilepath, JSON.stringify(data, null, '\t'));
        // openEditorWindow(gameURL);
        ipcRenderer.send('onclick', gameURL);
    }
    else {
        electron.remote.dialog.showMessageBox({ message: "此目录非项目文件" });
        // openSelectWindow(onSelectProject)
    }
}
var ipcRenderer = electron.ipcRenderer;
var configFilepath = getConfigPath();
var historyUrl = parseConfig();
if (historyUrl) {
    var historyDiv = document.getElementById('historyTab');
    if (historyDiv) {
        var item = document.createElement('button');
        item.innerText = historyUrl;
        item.onclick = function () {
            ipcRenderer.send('onclick', historyUrl);
        };
        historyDiv.appendChild(item);
    }
}
var openButton = document.getElementById('openTabButton');
if (openButton) {
    openButton.onclick = function () {
        openSelectWindow(onSelectProject);
    };
}
