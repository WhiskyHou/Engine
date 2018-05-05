const { app, BrowserWindow, dialog, Menu, ipcMain } = require('electron')
const path = require('path')
const fs = require('fs')


function getConfigPath() {
    const dir = path.join(app.getPath("appData"), "TSengine");
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
    const configFilepath = path.join(dir, 'app.json');
    if (!fs.existsSync(configFilepath)) {
        fs.writeFileSync(configFilepath, '{}', 'utf-8');
    }
    return configFilepath;
}


function openEditorWindow(gameUrl) {
    window = new BrowserWindow({ width: 1920, height: 1000 });
    const editorUrl = 'file://' + __dirname + '/editor/index.html?gameUrl=' + encodeURIComponent(gameUrl);
    window.loadURL(editorUrl);
    window.openDevTools();
}


function openSelectWindow(callback) {
    dialog.showOpenDialog({
        title: "请选择一个游戏文件夹!",
        properties: ["openDirectory"]
    }, (dirs) => {
        if (!dirs) {
            dialog.showMessageBox({ message: "由于您没有选择文件夹，本游戏引擎即将关闭" })
            app.exit();
        }
        else {
            callback(dirs[0])
        }
    });
}


function onSelectProject(gameURL) {
    if (fs.existsSync(gameURL + "/engineproj.json")) {
        const data = { gameUrl: gameURL };
        fs.writeFileSync(configFilepath, JSON.stringify(data, null, '\t', 'utf-8'));
        openEditorWindow(gameURL);
    }
    else {
        dialog.showMessageBox({ message: "请选择一个游戏文件夹" })
        openSelectWindow(onSelectProject)
    }
}


function initEditor(gameUrl) {
    if (gameUrl) {
        openEditorWindow(gameUrl);
    }
    else {
        openSelectWindow(onSelectProject);
    }
}


function initLauncher() {
    Menu.setApplicationMenu(null)

    window = new BrowserWindow({ width: 800, height: 500 });
    window.loadURL('file://' + __dirname + '/launcher/index.html');

    ipcMain.on('onclick', function (event, arg) {
        console.log(arg);
        initEditor(arg);
        // window.close();
    })

    window.openDevTools()
}

// function createWindow() {
//     // Create the browser window.
//     win = new BrowserWindow({ width: 1920, height: 1000 })
//     // 然后加载应用的 index.html。
//     win.loadURL(url.format({
//         pathname: path.join(__dirname, 'editor/index.html'),
//         protocol: 'file:',
//         slashes: true
//     }))
//     win.openDevTools()
// }


const configFilepath = getConfigPath();

app.on('ready', initLauncher)