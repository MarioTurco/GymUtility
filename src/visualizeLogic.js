const { app, BrowserWindow } = require('electron');
const { ipcRenderer } = require('electron')
const db = require('electron-db');

//Tabs
const addTab = document.getElementById('addTab');
const settingsTab = document.getElementById('settingsTab');

//Table
const table = document.getElementById('visualizeTable');


//Tabs listeners
addTab.onclick = () =>{
    ipcRenderer.sendSync('synchronous-message', 'add');
};

settingsTab.onclick = () => {
    ipcRenderer.sendSync('synchronous-message', 'settings');
};

function fillTable(){
    db.getAll('peso',(succ, data) => {
        console.log(data);
        let index = 1;
        for(elems in data){
            var row = table.insertRow(index);
            var dataCell = row.insertCell(0);
            var pesoCell = row.insertCell(1);
            dataCell.innerHTML =  data[elems].data;
            pesoCell.innerHTML = data[elems].peso;
            index+=1;
        }
        return data;
      })
}

fillTable();