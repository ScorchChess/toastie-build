const { app, BrowserWindow, ipcMain } = require('electron');
const isDev = process.argv.slice(2).includes('--dev');
// Modules to control application life and create native browser myWindowconst { app, BrowsermyWindow } = require('electron');
const path = require('path');

// Keep a global reference of the myWindow object, if you don't, the myWindow will
// be closed automatically when the JavaScript object is garbage collected.
let myWindow = null;

const iconPath = path.join(__dirname, 'public', 'favicon.ico');

function createmyWindow () {

	// Create the browser myWindow.
	myWindow = new BrowserWindow({
		width: 1200,
		height: 800,
		//icon: iconPath,
		show: false,
		frame: false,
		icon: iconPath,
		webPreferences: {
			nodeIntegration: false,
			enableRemoteModule: true,
			contextIsolation: true,
			preload: path.join(__dirname, 'preload.js'),
			additionalArguments: process.argv.slice(2)
		}
	});

	console.log(`file://${__dirname}/index.html`);

	// and load the index.html of the app.
	if (isDev) {
		myWindow.loadURL('http://localhost:3000');
	} else {
		myWindow.loadURL(`file://${__dirname}/index.html`);
	}

	ipcMain.on('toggleMax', (event) => {
		if (myWindow.isMaximized()) myWindow.restore();
		else myWindow.maximize();
		event.reply('toggleMax', !myWindow.isMaximized());
	});
	ipcMain.on('min', () => {
		myWindow.minimize();
	});
	ipcMain.on('close', () => {
		myWindow.close();
	});

	myWindow.on('ready-to-show', () => {
    
		global.mainmyWindow = myWindow;
		myWindow.show();
	});
	//myWindow.show();

	myWindow.on('did-finish-load', () => {
		console.log(myWindow);
    
		global.mainmyWindow = myWindow;
		myWindow.show();
	});

	myWindow.on('closed', function () {
		// Dereference the myWindow object, usually you would store myWindows
		// in an array if your app supports multi myWindows, this is the time
		// when you should delete the corresponding element.
		myWindow = null;
	});
}

// This method will be called when Electron has finished
// initialization and is ready to create browser myWindows.
// Some APIs can only be used after this event occurs.
app.whenReady(createmyWindow);
app.on('ready', () => {
	console.log('ready');
	createmyWindow();
});

// Quit when all myWindows are closed.
app.on('myWindow-all-closed', function () {
	// On macOS it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q
	if (process.platform !== 'darwin') app.quit();
});

app.on('activate', function () {
	if (BrowserWindow.getAllmyWindows().length === 0) createmyWindow();

	// On macOS it's common to re-create a myWindow in the app when the
	// dock icon is clicked and there are no other myWindows open.
	if (myWindow === null) createmyWindow();
});