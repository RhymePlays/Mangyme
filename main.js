const { app, BrowserWindow, screen } = require('electron')

const createWindow = () => {
    const {width, height} = screen.getPrimaryDisplay().workAreaSize

    const win = new BrowserWindow({
        width: width > 400? (width-50) : 400,
        height: height > 400? (height-50) : 400,
        minWidth: 400,
        minHeight: 400,
        autoHideMenuBar: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        }
    })

    win.loadFile('reader.html')
    win.webContents.openDevTools()
}
  
app.on("ready", createWindow)

app.on("window-all-closed", () => {app.quit()})