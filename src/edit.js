const db = require('electron-db');
const { app, BrowserWindow } = require('electron');
const { ipcRenderer } = require('electron')


//Tabs
const visualizeTab = document.getElementById('visualizeTab');
const settingsTab = document.getElementById('settingsTab')
const addTab = document.getElementById('addTab');
const deleteTab = document.getElementById('deleteTab');

//Tabs listeners
visualizeTab.onclick = () =>{
    ipcRenderer.sendSync('synchronous-message', 'visualize');
};

settingsTab.onclick = () => {
    ipcRenderer.sendSync('synchronous-message', 'settings');
};
addTab.onclick = () =>{
    ipcRenderer.sendSync('synchronous-message', 'add');
}
deleteTab.onclick = () =>{
    ipcRenderer.sendSync('synchronous-message', 'delete');
}