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

    var ctx1=document.getElementById('canvas1').getContext('2d');
    var ctx2=document.getElementById('canvas2').getContext('2d');
    var xCord1=document.getElementById("xCord1");
    var yCord1=document.getElementById("yCord1");
    var xCord2=document.getElementById("xCord2");
    var yCord2=document.getElementById("yCord2");

    var kmeansLabels1 = JSON.parse(window.localStorage.getItem("labels1"));
    var data1 = JSON.parse(window.localStorage.getItem("task1_dataset"));
    var dataset_clustering_cols1 = JSON.parse(window.localStorage.getItem("dataset_clustering_cols"));

    var kmeansLabels2 = JSON.parse(window.localStorage.getItem("labels2"));
    var data2 = JSON.parse(window.localStorage.getItem("task2_dataset"));
    var dataset_clustering_cols2 = JSON.parse(window.localStorage.getItem("dataset_clustering_cols"));

    var clustering1=new Clustering(kmeansLabels1,data1,dataset_clustering_cols1,ctx1,xCord1,yCord1);
    var clustering2=new Clustering(kmeansLabels2,data2,dataset_clustering_cols2,ctx2,xCord2,yCord2);

    clustering1.plotPoints();

    clustering2.plotPoints();

    jexcelSpreadSheet = jexcel(document.getElementById('spreadsheet1'), {
        //colHeaders: headArray,
        //data:data.excelDetails,
        data: coclusteringtable,
        csvHeaders: false,
        loadingSpin: true,
        editable: false,
    });
});