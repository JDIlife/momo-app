const { app, BrowserWindow } = require('electron')
const path = require('path')

const Database = require('better-sqlite3')
const db = new Database('MOMO.db', {verbose: console.log});

db.table('folder', {
	columns: ['folderName', 'folderIndex'],
	rows: function* () {
		let folderName = "normal";
		let folderIndex = new Date().getTime() + Math.random();
		yield { folderName, folderIndex };
	}
})

const folders = db.prepare('SELECT * FROM folder').all();

console.log(folders);

function createWindow () {
	const win = new BrowserWindow({
		width: 1000,
		height: 800,
		webPreferences: {
			preload: path.join(__dirname, 'preload.js'),
			nodeIntegration: true,
		},
	})

	win.loadFile('./app/index.html')
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
