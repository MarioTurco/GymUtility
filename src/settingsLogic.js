const { app, BrowserWindow } = require('electron');
const { ipcRenderer } = require('electron')
//Tabs
const addTab = document.getElementById('addTab');
const visualizeTab = document.getElementById('visualizeTab');

//Tabs listeners
addTab.onclick = () =>{
    ipcRenderer.sendSync('synchronous-message', 'add');
};

visualizeTab.onclick = () =>{
    ipcRenderer.sendSync('synchronous-message', 'visualize');
};