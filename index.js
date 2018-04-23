const { app, BrowserWindow } = require('electron')
const path = require('path')
const url = require('url')

function createWindow() {
    // Create the browser window.
    win = new BrowserWindow({ width: 1920, height: 1000 })

    // 然后加载应用的 index.html。
    win.loadURL(url.format({
        pathname: path.join(__dirname, 'editor/index.html'),
        protocol: 'file:',
        slashes: true
    }))
    win.openDevTools()
}

app.on('ready', createWindow)