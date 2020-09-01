const db = require('electron-db');
const { app, BrowserWindow } = require('electron');
const { ipcRenderer } = require('electron')

//Buttons
const addBtn = document.getElementById('addBtn');

//Tabs
const visualizeTab = document.getElementById('visualizeTab');
const settingsTab = document.getElementById('settingsTab')
const editTab = document.getElementById('editTab');
const deleteTab = document.getElementById('deleteTab');

function createDatabase(){
    db.createTable('peso',  (succ, msg) => {
        // succ - boolean, tells if the call is successful
        console.log("Success: " + succ);
        console.log("Message: " + msg);
      })
}

function insertRecord(record){
    db.insertTableContent('peso', record, (succ, msg) =>{
        console.log("Insert Success: " + succ);
        console.log("Insert Message: " + msg);
    });
}
function getAllRows(){
    db.getAll('peso',(succ, data) => {
        console.log(data);
        return succ;
      })
}
function clearText(){
    document.getElementById('dataText').value='';
    document.getElementById('pesoText').value='';
    if ( document.getElementById("dataText").classList.contains('is-danger') ){
        document.getElementById("dataText").classList.remove('is-danger');
    }
    if ( document.getElementById("pesoText").classList.contains('is-danger') ){
        document.getElementById("pesoText").classList.remove('is-danger');

    }

}
function dataError(){
    document.getElementById("dataText").classList.add('is-danger');
}
function pesoError(){
    document.getElementById("pesoText").classList.add('is-danger');
}


addBtn.onclick = () => {
    let record = new Object();
    record.data = document.getElementById('dataText').value;
    console.log("Data:" , record.data);
    record.peso = document.getElementById('pesoText').value;
    if(record.data == '' || record.peso == ''){
        console.log("Vuoto");
        if(record.data == '')
            dataError();
        if(record.peso == '')
            pesoError();
        return;
    }
    
    try{
        if( db.valid('peso') ){
            
            insertRecord(record);
        }
    } catch(error){
        console.log(error);
        createDatabase();
        insertRecord(record);
    }
    clearText();
};



//Tabs listeners
visualizeTab.onclick = () =>{
    ipcRenderer.sendSync('synchronous-message', 'visualize');
};

settingsTab.onclick = () => {
    ipcRenderer.sendSync('synchronous-message', 'settings');
};
editTab.onclick = () =>{
    ipcRenderer.sendSync('synchronous-message', 'edit');
}
deleteTab.onclick = () =>{
    ipcRenderer.sendSync('synchronous-message', 'delete');
}