var cols=[];
var idExp = JSON.parse(window.localStorage.getItem("idExp")); //id of the current experiment

function getDataFromjexcel(){
    var form_data = new FormData();
    form_data.append('dataset',JSON.stringify($('#spreadsheet1').jexcel('getData', false)));
    form_data.append('datasetcols',JSON.stringify(cols));
    return(form_data);
}

$(function() {
    $('#fileElem').change(function() {
        var form_data = new FormData($('#upload-file')[0]);
        $.ajax({
            type: 'POST',
            url: '/uploadfile',
            data: form_data,
            contentType: false,
            cache: false,
            processData: false,
            success: function(data) {
                console.log('Success!');
            },
        })
            .done(function (data) {
                if (data.error) {
                    confirm(data.error);
                }
                cols=data.excelCols;
                $('#spreadsheet1').jexcel({colHeaders: data.excelCols,data:data.excelDetails, colWidths: [ 300, 80, 100 ] });
                //$('#spreadsheet1').jexcel('deleteRow', excel_matrix.length-1);
                //console.log(excel_matrix.length-1);
                //$('#spreadsheet1').jexcel.setColumnData(3,cols);
            });
    });
});

$('#goKmeans').click(function() {
    var form_data = getDataFromjexcel();
    form_data.append('clusteringNum', document.getElementById("clusteringNum").value);
    $.ajax({
    type: 'POST',
    url: '/goKmeans',
    data: form_data,
    contentType: false,
    cache: false,
    processData: false,
    success: function(data) {
        console.log('Success!');
    },
})
    .done(function (data) {
        if (data.error) {
            confirm(data.error);
        }
    window.localStorage.setItem("dataset_clustering", JSON.stringify(data.inputArray));
    window.localStorage.setItem("kmeansLabels", JSON.stringify(data.kmeansLabels));
    });
});
$('#goK2').click(function() {
    var form_data = getDataFromjexcel();
    $.ajax({
    type: 'POST',
    url: '/goK2',
    data: form_data,
    contentType: false,
    cache: false,
    processData: false,
    success: function(data) {
        console.log('Success!');
    },
})
    .done(function (data) {
        if (data.error) {
            confirm(data.error);
        }
    alert(data.dataset_k2)
    window.localStorage.setItem("dataset_k2", JSON.stringify(data.dataset_k2));
    window.localStorage.setItem("categories", JSON.stringify(data.categories));

    });
});

$('#createTask').click(function() {
    var taskname = document.getElementById("taskname").value;
    var taskDescription = document.getElementById("taskDescription").value;
    var form_data = new FormData();
    form_data.append('taskname',taskname );
    form_data.append('taskDescription',taskDescription );
    form_data.append('current_experiment',idExp);
    $.ajax({
    type: 'POST',
    url: '/createTask',
    data: form_data,
    contentType: false,
    cache: false,
    processData: false,
    success: function(data) {
        console.log('Success!');
    },
})
    .done(function (data) {
        if (data.error) {
            confirm(data.error);
        }
        var experiments = JSON.parse(window.localStorage.getItem("experiments"));
        var task=new Task(taskname,taskDescription,null);
        var exp=experiments.filter(x => x.id === parseInt(idExp));
        exp[0].task.push(task);
        window.localStorage.setItem("experiments",JSON.stringify(experiments));
        alert("added succesfully");
    });
});


