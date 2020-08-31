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

//Canvas
var ctx = document.getElementById('chart').getContext('2d');


function sortDataByDate(data){
    return( data.sort((a,b) => a.data < b.data ? -1 : 1));
}
function createChart(data){
    sortDataByDate(data);
    let peso = []
    let date = []
    for(elems in data){
        peso.push(data[elems].peso);
        date.push(data[elems].data);
    }
    console.log(data);
    var chart = new Chart(ctx, {
        // The type of chart we want to create
        type: 'line',
        // The data for our dataset
        data: {
            labels: date,
            datasets: [{
                label: 'Peso Corporeo',
                //backgroundColor: 'rgb(255, 99, 132)',
                borderColor: 'rgb(255, 99, 132)',
                data: peso
            }]
        },
    
        // Configuration options go here
        options: {}
    });
}

function fillTable(){
    
    db.getAll('peso',(succ, data) => {
        console.log(data);
        createChart(data);
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