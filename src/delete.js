const db = require('electron-db');
const { app, BrowserWindow } = require('electron');
const { ipcRenderer } = require('electron')

//Tabs
const visualizeTab = document.getElementById('visualizeTab');
const settingsTab = document.getElementById('settingsTab')
const addTab = document.getElementById('addTab');
const editTab = document.getElementById('editTab');

//Table
const table = document.getElementById('visualizeTable');

//Buttons
const deleteRowBtn = document.getElementById('deleteRowBtn');

var lastSelectedRow = null;

deleteRowBtn.onclick = () =>{
    deselectEffect(lastSelectedRow);
    var date = lastSelectedRow.getElementsByTagName('td')[0].textContent;
    db.deleteRow('peso', {'data': date}, (succ, msg) => {
        console.log(msg);
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

function getAllRows(callback){
    db.getAll('peso',(succ, data) => {
        if(succ)
            callback(data);
        })
}

function fillTable(){
    if( !(db.valid('peso')) )
        return;
    getAllRows(function(data){
        revereSortDataByDate(data);
        let index = 1;
        for(elems in data){
            var row = table.insertRow(index);
            var dataCell = row.insertCell(0);
            var pesoCell = row.insertCell(1);
            var kcalCell = row.insertCell(2);
            dataCell.innerHTML =  data[elems].data;
            pesoCell.innerHTML = data[elems].peso;
            kcalCell.innerHTML = data[elems].kcal;
            index+=1;
        }
    })
}
function revereSortDataByDate(data){
    return( data.sort((a,b) => a.data < b.data ? 1 : -1));
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
            }
            }
            currentRow.onclick = createClickListener(currentRow);
    }
}

visualizeTab.onclick = () =>{
    ipcRenderer.sendSync('synchronous-message', 'visualize');
};

settingsTab.onclick = () => {
    ipcRenderer.sendSync('synchronous-message', 'settings');
};
addTab.onclick = () =>{
    ipcRenderer.sendSync('synchronous-message', 'add');
}
editTab.onclick = () =>{
    ipcRenderer.sendSync('synchronous-message', 'edit');
}

fillTable();
addRowsListeners();