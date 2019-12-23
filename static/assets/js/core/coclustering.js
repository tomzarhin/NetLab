function getDataFromjexcel() {
    var form_data = new FormData();
    form_data.append('dataset', JSON.stringify(jexcelSpreadSheet.getData()));
    form_data.append('datasetcols', JSON.stringify(jexcelSpreadSheet.getHeaders()));
    return (form_data);
}

var idExp = JSON.parse(window.localStorage.getItem("idExp"));
var idTask = JSON.parse(window.localStorage.getItem("idTask"));
var experiments = JSON.parse(window.localStorage.getItem("experiments"));
var idExpArray = experiments.findIndex(x => x.id === parseInt(idExp));
var idTaskArray = experiments[idExpArray].task.findIndex(x => x.task_id === parseInt(idTask))
var datasetToBayes = JSON.parse(JSON.stringify(experiments[idExpArray].task[idTaskArray].dataset));
var coclusteringtable = JSON.parse(window.localStorage.getItem("coclusteringtable"));

var colsArr = experiments[idExpArray].task[idTaskArray].datasetcols.split(",");
var datasetWithPrior=JSON.parse(JSON.stringify(experiments[idExpArray].task[idTaskArray].dataset));

$(document).ready(function () {
    var headArray=experiments[idExpArray].task[idTaskArray].datasetcols.split(",")
    jexcelSpreadSheet = jexcel(document.getElementById('spreadsheet1'), {
        //colHeaders: headArray,
        //data:data.excelDetails,
        data: coclusteringtable,
        csvHeaders: false,
        loadingSpin: true,
        editable: false,
    });

    /*jexcelSpreadSheet.insertRow(1,0,1);
    var tempArrayForTerms=[];
    for(var column=0;column<experiments[idExpArray].task[idTaskArray].dataset.length;column++){
        tempArrayForTerms.push("tom");
    }
    jexcelSpreadSheet.setRowData(0,tempArrayForTerms);*/
    window.localStorage.setItem("dataset_clustering", JSON.stringify(experiments[idExpArray].task[idTaskArray].dataset));
    window.localStorage.setItem("dataset_clustering_cols", JSON.stringify(jexcelSpreadSheet.getHeaders()));
});



