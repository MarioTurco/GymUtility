const db = require('electron-db');
const { app, BrowserWindow } = require('electron');


//Buttons
const addBtn = document.getElementById('addBtn');
const seeBtn = document.getElementById('seeBtn');
const resetBtn = document.getElementById('resetBtn');
//Tabs
const visualizeTab = document.getElementById('visualizeTab');

visualizeTab.onclick = () =>{
    loadVisualizeWindow();
};
function deleteDatabase(){
    db.clearTable('peso', (succ, msg) => {
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
seeBtn.onclick = () =>{
    getAllRows();
};

addBtn.onclick = () => {
    let record = new Object();
    record.data =document.getElementById('dataText').value;
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
resetBtn.onclick = () => {
    deleteDatabase();
};