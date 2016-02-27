'use strict';

class Main {
	constructor() {
		const electron = require('electron');

		electron.app.on('window-all-closed', function() {
			if (process.platform == 'darwin') return;
			electron.app.quit();
		});

		electron.app.on('ready', function() {
			let mainWindow = new electron.BrowserWindow({
				title: 'Synergy'
				, width: 1920
				, height: 1080
				, minWidth: 1280
				, minHeight: 720
				, backgroundColor: '#000'
				, frame: false
			});

			mainWindow.loadURL('http://192.168.1.2:3000/views/index.html');
			mainWindow.webContents.openDevTools();

			mainWindow.on('closed', (): any => mainWindow = null);
		});
	}
}

new Main();