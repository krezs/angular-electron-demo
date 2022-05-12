// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const { networkInterfaces } = require('os');


const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, "preload.js")
    }
  })

  // and load the index.html of the app.
 // mainWindow.loadFile('index.html')
  mainWindow.loadURL(`file://${__dirname}/dist/index.html`);
  mainWindow.setMenu(null);
  // mainWindow.webContents.openDevTools(); //uncomment to display webdevtools

  mainWindow.on("closed", () => {
      mainWindow = null;
  });
  // Open the DevTools.
  mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Algunas APIs pueden solamente ser usadas despues de que este evento ocurra.
app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})


ipcMain.on("ip-request", (event, message) => {
  const nets = networkInterfaces();
  const results = Object.create(null); // Or just '{}', an empty object
  
  //nets.find(net => net.family == 'IPv4' && !net.internal);
  let ipAddress;
  for (const name of Object.keys(nets)) {
      for (const net of nets[name]) {
          // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
          if (net.family === 'IPv4' && !net.internal) {
              if (!results[name]) {
                  results[name] = [];
              }
              ipAddress = net.address;
              results[name].push(net.address);
          }
      }
  }

  event.reply("reply", JSON.stringify(results));

});

// In this file you can include the rest of your app's specific main process
// code. Tu también puedes ponerlos en archivos separados y requerirlos aquí.


// ipcMain.on("message", (event, message) => { 
//   if (message === "ping") {
//       event.reply("reply", "pong"); 
//   }
// });