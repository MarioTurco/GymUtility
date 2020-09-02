const { app, BrowserWindow } = require('electron');
const { ipcRenderer } = require('electron')
const db = require('electron-db');

//Tabs
const addTab = document.getElementById('addTab');
const settingsTab = document.getElementById('settingsTab');
const editTab = document.getElementById('editTab');
const deleteTab = document.getElementById('deleteTab');

//Table
const table = document.getElementById('visualizeTable');


//Tabs listeners
addTab.onclick = () =>{
    created=0;
    ipcRenderer.sendSync('synchronous-message', 'add');
};

settingsTab.onclick = () => {
    created=0;
    ipcRenderer.sendSync('synchronous-message', 'settings');
};
editTab.onclick = () =>{
    created=0;
    ipcRenderer.sendSync('synchronous-message', 'edit');
}
deleteTab.onclick = () =>{
    created=0;
    ipcRenderer.sendSync('synchronous-message', 'delete');
}
//Canvas
var ctx = document.getElementById('chart').getContext('2d');



function sortDataByDate(data){
    return( data.sort((a,b) => a.data < b.data ? -1 : 1));
}
function revereSortDataByDate(data){
    return( data.sort((a,b) => a.data < b.data ? 1 : -1));
}
function createChart(records){
    let peso = [];
    let date = [];
    let kcal = [];
    sortDataByDate(records);
    for(elems in records){
        date.push(records[elems].data);
        let newPeso = records[elems].peso;
        let newKcal = records[elems].kcal;
        if(newPeso == "")
            newPeso=null;
        if(newKcal == "")
            newKcal = null;
        kcal.push(newKcal);
        peso.push(newPeso);
    }
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
                data: peso,
                yAxisID: 'y-axis-1'
            },
                {
                label: 'Kcal',
                borderColor: 'rgb(90, 130, 180)',
                data: kcal,
                yAxisID: 'y-axis-2'
                }
            ]
            
        }, 
    
        // Configuration options go here
        options: {
            spanGaps: true,
            responsive: true,
            hoverMode: 'index',
            stacked: false,
            scales: {
                yAxes: [{
                    type: 'linear', // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
                    display: true,
                    position: 'left',
                    id: 'y-axis-1',
                }, {
                    type: 'linear', // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
                    display: true,
                    position: 'right',
                    id: 'y-axis-2',

                    // grid line settings
                    gridLines: {
                        drawOnChartArea: false, // only want the grid lines for one axis to show up
                    },
                }],
            }
        }
    });
}
function getAllRows(callback){
    db.getAll('pesoTest',(succ, data) => {
        if(succ)
            callback(data);
        })
}
async function fillTable(){
    if( !(db.valid('pesoTest')) ){
        return;
    }
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
        createChart(data);
    });
     
}

fillTable();