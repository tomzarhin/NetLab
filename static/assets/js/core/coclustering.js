//import {getRandomColor} from './clusterGraph.js';

$(document).ready(function () {
    var idExp = JSON.parse(window.localStorage.getItem("idExp"));
    var idTask = JSON.parse(window.localStorage.getItem("idTask"));
    var experiments = JSON.parse(window.localStorage.getItem("experiments"));
    var idExpArray = experiments.findIndex(x => x.id === parseInt(idExp));
    var idTaskArray = experiments[idExpArray].task.findIndex(x => x.task_id === parseInt(idTask))
    var coclusteringtable = JSON.parse(window.localStorage.getItem("coclusteringtable"));

    var colsArr = experiments[idExpArray].task[idTaskArray].datasetcols.split(",");
    var datasetWithPrior=JSON.parse(JSON.stringify(experiments[idExpArray].task[idTaskArray].dataset));
    var headArray=experiments[idExpArray].task[idTaskArray].datasetcols.split(",")

    //var color = getRandomColor();

    jexcelSpreadSheet = jexcel(document.getElementById('spreadsheet1'), {
        //colHeaders: headArray,
        //data:data.excelDetails,
        data: coclusteringtable,
        csvHeaders: false,
        loadingSpin: true,
        editable: false,
    });
});