'use strict';
const electron = require('electron');
const http = require('http');
const urlUtil = require('url');

class Main {
	mainWindow: Electron.BrowserWindow;

	constructor() {
		electron.app.commandLine.appendSwitch("disable-renderer-backgrounding");

		electron.app.on('window-all-closed', () => {
			if (process.platform == 'darwin') return;
			electron.app.quit();
		});

		electron.app.on('ready', () => {
			this.mainWindow = new electron.BrowserWindow({
				title: 'Synergy'
				, width: 1920
				, height: 1080
				, minWidth: 1280
				, minHeight: 720
				, backgroundColor: '#000'
				, frame: false
				, show: false
				, webPreferences: {
					experimentalFeatures: true
					, experimentalCanvasFeatures: true
				}
			});
			this.mainWindow.on('closed', (): any => this.mainWindow = null);
			this.openWindowWhenServerReady('http://192.168.1.2:3000/views/index.html');
		});
	}

	openWindowWhenServerReady(url: string) {
		const opts = urlUtil.parse(url);

		http.get(opts, (res: any) => {
			if (res.statusCode == 200) {
				this.openWindow(url);
			} else {
				setTimeout(() => {
					this.openWindowWhenServerReady(url);
				}, 50);
			}
		}).on('error', (err: any) => {
			setTimeout(() => {
				this.openWindowWhenServerReady(url);
			}, 50);
		});
	}

	openWindow(url: string) {
		this.mainWindow.loadURL(url);
		this.mainWindow.show();
		this.mainWindow.webContents.openDevTools();
	}
}

new Main();