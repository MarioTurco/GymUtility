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
var pesoText = document.getElementById('pesoText');
var dataText = document.getElementById('dataText');
var kcalText = document.getElementById('kcalText');

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

function pesoError(){
    document.getElementById("pesoText").classList.add('is-danger');
}
function kcalError(){
    document.getElementById("kcalText").classList.add('is-danger');
}

function invalidFields(){
    let newPeso = pesoText.value;
    let newKcal = kcalText.value;
    
    if(newPeso == '' && newKcal == ''){
        kcalError();
        pesoError();
        return true;
    }
}

//Button Listener
editRowBtn.onclick = () =>{
    deselectEffect(lastSelectedRow);
    var oldData = lastSelectedRow.getElementsByTagName('td')[0].textContent;
    let newPeso = pesoText.value;
    let newKcal = kcalText.value;
    if(invalidFields())
        return;
    console.log(oldData);
    let where = {
        "data" : oldData
    };
    let set = {
        "peso" : newPeso,
        "kcal" : newKcal
    };
    db.updateRow('peso', where, set, (succ, msg) => {
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
        let index = 1;
        //create row
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
function clearText(){
    document.getElementById('kcalText').value='';
    document.getElementById('dataText').value='';
    document.getElementById('pesoText').value='';
    if ( document.getElementById("dataText").classList.contains('is-danger') ){
        document.getElementById("dataText").classList.remove('is-danger');
    }
    if ( document.getElementById("pesoText").classList.contains('is-danger') ){
        document.getElementById("pesoText").classList.remove('is-danger');
    }
    if ( document.getElementById("kcalText").classList.contains('is-danger') ){
        document.getElementById("kcalText").classList.remove('is-danger');
    }
}
function addRowsListeners(){
    var rows = table.getElementsByTagName("tr");
    for(i=0; i<rows.length;i++){
        var currentRow = table.rows[i];
        var createClickListener = function(row){
            return function(){
                clearText();
                deselectEffect(lastSelectedRow);
                selectEffect(row);
                lastSelectedRow = row;
                pesoText.value = lastSelectedRow.getElementsByTagName('td')[1].textContent;
                dataText.value = lastSelectedRow.getElementsByTagName('td')[0].textContent;
                kcalText.value = lastSelectedRow.getElementsByTagName('td')[2].textContent;
            }
            }
            currentRow.onclick = createClickListener(currentRow);
    }
}
fillTable();
addRowsListeners();