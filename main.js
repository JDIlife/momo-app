const { app, BrowserWindow } = require('electron')
const path = require('path')

function createWindow () {
	const win = new BrowserWindow({
		width: 1000,
		height: 800,
		webPreferences: {
			preload: path.join(__dirname, 'preload.js'),
			nodeIntegration: true,
		},
	})

	win.loadFile('./index.html')

	win.webContents.openDevTools();
}

app.whenReady().then(() => {
	createWindow()

	app.on('activate', () => {
		if (BrowserWindow.getAllWindows().length === 0) {
			createwindow()
		}
	})
})

try {
	require('electron-reloader')(module)
} catch (_) {}
