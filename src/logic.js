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

function createPesoDatabase(){
    db.createTable('peso',  (succ, msg) => {
        // succ - boolean, tells if the call is successful
        console.log("Success: " + succ);
        console.log("Message: " + msg);
      })
}

function isDuplicate(day, callback){
    db.search('peso', 'data', day, (succ, data) => {
       if(data.length>0)
            callback(true);
        else 
            callback(false);
      });
}

function insertPesoAndKcal(record){
    try{
        if( db.valid('peso') ){
            console.log(record);
            isDuplicate(record.data, function(result){
                console.log(result); 
                if(result){
                    console.log("duplicato");
                    dataError();
                    return;
                }else{
                    db.insertTableContent('peso', record, (succ, msg) =>{
                        console.log("Insert Success: " + succ);
                        console.log("Insert Message: " + msg);
                    });
                }
            })
        };
    }catch(error){
        console.log(error);
        createPesoDatabase();
        insertPesoAndKcal(record);
    }
}

function getAllRows(){
    db.getAll('peso',(succ, data) => {
        console.log(data);
        return succ;
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
function dataError(){
    document.getElementById("dataText").classList.add('is-danger');
}
function pesoError(){
    document.getElementById("pesoText").classList.add('is-danger');
}
function kcalError(){
    document.getElementById("kcalText").classList.add('is-danger');
}

function emptyFields(record){
    let ret = false;
    if(record.data == ''){
        ret = true;
        dataError();
       
    }
    if(record.peso == '' || record.kcal == ''){
        if(record.kcal == '' && !(record.peso == '')){
            ret = ret || false;
            kcalError();
            
        }
        if(record.peso == '' && !(record.kcal == '')){
            ret = ret || false;
            pesoError();
            
        }if(record.peso == '' && record.kcal == ''){
            pesoError();
            kcalError();
            ret = ret || true;
          
        }
    }
    
    return ret;
}
addBtn.onclick = () => {
    let record = new Object();
    record.data = document.getElementById('dataText').value;
    record.peso = document.getElementById('pesoText').value;
    record.kcal = document.getElementById('kcalText').value;
    console.log(record);
    if(emptyFields(record))
        return;
    insertPesoAndKcal(record);
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