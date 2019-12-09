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
    /*jexcelSpreadSheet.insertRow(1,0,1);
    var tempArrayForTerms=[];
    for(var column=0;column<experiments[idExpArray].task[idTaskArray].dataset.length;column++){
        tempArrayForTerms.push("tom");
    }
    jexcelSpreadSheet.setRowData(0,tempArrayForTerms);*/
    window.localStorage.setItem("dataset_clustering", JSON.stringify(experiments[idExpArray].task[idTaskArray].dataset));
    window.localStorage.setItem("dataset_clustering_cols", JSON.stringify(jexcelSpreadSheet.getHeaders()));
});


 var s = document.getElementById('comboCols');
 var colsArr = experiments[idExpArray].task[idTaskArray].datasetcols.split(",")

var select = document.getElementById("comboCols");
for(var i = 0; i < colsArr.length; i++) {
    var opt = colsArr[i];
    var el = document.createElement("option");
    el.textContent = opt;
    el.value = opt;
    select.appendChild(el);
}
function myFunction() {
  var title = document.getElementById("comboCols").value;
  var index = colsArr.indexOf(title);
  var colArrForMedian=[];
  var arr=experiments[idExpArray].task[idTaskArray].dataset
         for(var i=0; i<arr.length; i++){
          colArrForMedian.push(arr[i][index]);
       }
   var median = calcMedian(colArrForMedian);

  document.getElementById("median").innerHTML = "You median: " + median;
}

function calcMedian(ar1) {
  var half = Math.floor(ar1.length / 2);
  ar1.sort(function(a, b) { return a - b;});

  if (ar1.length % 2) {
    return ar1[half];
  } else {
    return (ar1[half] + ar1[half] + 1) / 2.0;
  }
}

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
            window.localStorage.setItem("elbowValue", JSON.stringify(data.elbowValue));
            window.localStorage.setItem("silhouetteValue", JSON.stringify(data.silhouetteValue));

            location.href = "../pages/clusterGraph.html";

        });
});