const db = require('electron-db');
const { app, BrowserWindow } = require('electron');
const { ipcRenderer } = require('electron')

//Buttons
const editRowBtn = document.getElementById("editRowBtn");
//Tabs
const visualizeTab = document.getElementById('visualizeTab');
const settingsTab = document.getElementById('settingsTab')
const addTab = document.getElementById('addTab');
const deleteTab = document.getElementById('deleteTab');

//Table
const table = document.getElementById('visualizeTable');

//Fields
const pesoText = document.getElementById('pesoText');
const dataText = document.getElementById('dataText');

var lastSelectedRow = null;

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
function dataError(){
    document.getElementById("dataText").classList.add('is-danger');
}
function pesoError(){
    document.getElementById("pesoText").classList.add('is-danger');
}
//Button Listener
editRowBtn.onclick = () =>{
    deselectEffect(lastSelectedRow);
    var oldData = lastSelectedRow.getElementsByTagName('td')[0].textContent;
    var newPeso = pesoText.value;
    var newData = dataText.value;
    if(newPeso.length == 0 || newData.length != 10){
        if(newPeso.length == 0)
            pesoError();
        if(newData.length != 10)
            dataError();
        return;
    }
    let where = {
        "data" : oldData
    };
    let set = {
        "data" : newData,
        "peso" : newPeso
    };
    db.updateRow('pesoTest', where, set, (succ, msg) => {
        // succ - boolean, tells if the call is successful
        console.log("Success: " + succ);
        console.log("Message: " + msg);
      });

    location.reload();

}
function selectEffect(row){
    if(row != null)
        row.classList.add('is-selected');
}
function deselectEffect(row){
    if(row != null)
        if ( row.classList.contains('is-selected') )
            row.classList.remove('is-selected');
        
}
function fillTable(){
    if( !(db.valid('pesoTest')) )
        return;
    db.getAll('pesoTest',(succ, data) => {
        console.log(data);
        let index = 1;
        //create row
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
function addRowsListeners(){
    var rows = table.getElementsByTagName("tr");
    for(i=0; i<rows.length;i++){
        var currentRow = table.rows[i];
        var createClickListener = function(row){
            return function(){
                deselectEffect(lastSelectedRow);
                selectEffect(row);
                lastSelectedRow = row;
                pesoText.value = lastSelectedRow.getElementsByTagName('td')[1].textContent;
                dataText.value = lastSelectedRow.getElementsByTagName('td')[0].textContent;
                console.log(tmp);
            }
            }
            currentRow.onclick = createClickListener(currentRow);
    }
}
fillTable();
addRowsListeners();