var cols=[];

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
    var form_data = new FormData();
    form_data.append('dataset',JSON.stringify($('#spreadsheet1').jexcel('getData', false)));
    form_data.append('datasetcols',JSON.stringify(cols));
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
    window.localStorage.setItem("dataset", JSON.stringify(data.inputArray));
    window.localStorage.setItem("kmeansLabels", JSON.stringify(data.kmeansLabels));
    });
});
