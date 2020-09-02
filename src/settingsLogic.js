const { app, BrowserWindow } = require('electron');
const { ipcRenderer } = require('electron');
const db = require('electron-db');
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
editTab.onclick = () =>{
    ipcRenderer.sendSync('synchronous-message', 'edit');
}
deleteTab.onclick = () =>{
    ipcRenderer.sendSync('synchronous-message', 'delete');
}
//Buttons
const resetBtn = document.getElementById('resetBtn');

resetBtn.onclick = () => {
    deleteDatabase();
};


function deleteDatabase(){
    db.clearTable('pesoTest', (succ, msg) => {
        if (succ) {
            console.log(msg)
            // Show the content now
            db.getAll(dbName, (succ, data) => {
                if (succ) {
                    console.log(data);
                }
            });
        }
    })
}