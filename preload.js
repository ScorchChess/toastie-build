const { contextBridge, remote, shell, ipcRenderer } = require('electron');
const Package = require('../package.json');
const isProd = process.argv[2] !== '--dev';
const isElectron = navigator.userAgent.toLowerCase().includes('electron');
const isDev = process.env.NODE_ENV === 'development'; //detects a react dev build

const api = { isElectron, isDev, isProd, Package, remote, shell,
	open: shell.openExternal,

	/**
	 * @param {string} channel 
	 * @param {any} data 
	 */
	send: (channel, data) => {
		console.log('send', channel, data);
		const validChannels = ['toggleMax', 'min', 'close'];
		if (validChannels.includes(channel)) {
			ipcRenderer.send(channel, data);
		}
	},

	/**
	 * @param {string} channel 
	 * @param {(...params: any[]) => void} func
	 */
	listen: (channel, func) => {
		console.log('listen', channel, func);
		const validChannels = ['toggleMax'];
		if (validChannels.includes(channel)) {
			ipcRenderer.on(channel, (_event, ...args) => func(...args));
		}
	},
};

contextBridge.exposeInMainWorld(
	'api', api
);

// All of the Node.js APIs are available in the preload process.

// It has the same sandbox as a Chrome extension.
window.addEventListener('DOMContentLoaded', () => {
	const replaceText = (selector, text) => {
		const element = document.getElementById(selector);
		if (element) element.innerText = text;
	};

	for (const type of ['chrome', 'node', 'electron']) {
		replaceText(`${type}-version`, process.versions[type]);
	}
});