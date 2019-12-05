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
$(document).ready(function () {
    var headArray=experiments[idExpArray].task[idTaskArray].datasetcols.split(",")
    jexcelSpreadSheet = jexcel(document.getElementById('spreadsheet1'), {
        colHeaders: headArray,
        //data:data.excelDetails,
        data: experiments[idExpArray].task[idTaskArray].dataset,
        csvHeaders: false,
        tableOverflow: true,

        loadingSpin: true,
        colWidths: [300, 80, 100],

    });
    window.localStorage.setItem("dataset_clustering", JSON.stringify(experiments[idExpArray].task[idTaskArray].dataset));
    window.localStorage.setItem("dataset_clustering_cols", JSON.stringify(jexcelSpreadSheet.getHeaders()));
});

$('#goK2').click(function () {
    var form_data = new FormData();
    form_data.append('dataset', JSON.stringify(experiments[idExpArray].task[idTaskArray].dataset));
    form_data.append('datasetcols', JSON.stringify(experiments[idExpArray].task[idTaskArray].datasetcols));
    $.ajax({
        type: 'POST',
        url: '/goK2',
        data: form_data,
        contentType: false,
        cache: false,
        processData: false,
        success: function (data) {
            console.log('Success!');
        },
    })
        .done(function (data) {
            if (data.error) {
                confirm(data.error);
            }
            //alert(data.dataset_k2)
            window.localStorage.setItem("dataset_k2", JSON.stringify(data.dataset_k2));
            window.localStorage.setItem("categories", JSON.stringify(data.categories));
            location.href = "../pages/bayesGraph.html";
        });
});
$('#goKmeans').click(function () {
    var form_data = new FormData();
    form_data.append('dataset', JSON.stringify(experiments[idExpArray].task[idTaskArray].dataset));
    form_data.append('clusteringNum', document.getElementById("clusteringNum").value);
    $.ajax({
        type: 'POST',
        url: '/goKmeans',
        data: form_data,
        contentType: false,
        cache: false,
        processData: false,
        success: function (data) {
            console.log('Success!');
        },
    })
        .done(function (data) {
            if (data.error) {
                confirm(data.error);
            }
            window.localStorage.setItem("dataset_clustering", JSON.stringify(data.inputArray));
            window.localStorage.setItem("kmeansLabels", JSON.stringify(data.kmeansLabels));
            window.localStorage.setItem("dataset_clustering_cols", JSON.stringify(jexcelSpreadSheet.getHeaders()));
            location.href = "../pages/clusterGraph.html";

        });
});