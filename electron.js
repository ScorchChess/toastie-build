const { app, BrowserWindow } = require('electron');
const isDev = require('electron-is-dev') && !process.argv.slice(2).includes('--production');
// Modules to control application life and create native browser windowconst { app, BrowserWindow } = require('electron');
const path = require('path');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let window = null;

const iconPath = path.join(__dirname, 'public', 'favicon.ico');

const createWindow = () => {

	// Create the browser window.
	window = new BrowserWindow({
		width: 1200,
		height: 800,
		icon: iconPath,
		show: false,
		frame: false,
		preload: path.join(__dirname, 'preload.js'),
		webPreferences: {
			nodeIntegration: true,
			// additionalArguments: process.argv.slice(2)
		}
    });

    console.log(`file://${__dirname}/index.html`);

	// and load the index.html of the app.
	if (isDev) {
		window.loadURL('http://localhost:3000');
	} else {
		window.loadURL(`file://${__dirname}/index.html`);
    }

	window.on('ready-to-show', () => {
    
		global.mainWindow = window;
		window.show();
	});
	//window.show();

	window.on('did-finish-load', () => {
        console.log(window);
    
		global.mainWindow = window;
		window.show();
	});

	window.on('closed', function () {
		// Dereference the window object, usually you would store windows
		// in an array if your app supports multi windows, this is the time
		// when you should delete the corresponding element.
		window = null;
	});
};

// Quit when all windows are closed.
app.on('window-all-closed', function () {
	// On macOS it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q
	if (process.platform !== 'darwin') app.quit();
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
	createWindow();
});

app.on('activate', function () {
	// On macOS it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (window === null) createWindow();
});