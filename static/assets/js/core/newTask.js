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
                var excel_matrix=[];
                var cols=[];
                excel_matrix[0]=[];
                var i=0,j=0;
                var firstComma=false;
                for (value of data.excelDetails) {
                    if(firstComma==false && value!=','){
                        cols[j]=value;
                        j++;
                    }
                    else{
                        firstComma=true;
                        if(value==','){
                            i++;
                            excel_matrix[i] = [];
                            j=0;
                        }
                        else{
                            excel_matrix[i][j]=value;
                            j++;
                        }
                    }
                }
                $('#spreadsheet1').jexcel({ data:excel_matrix, colWidths: [ 300, 80, 100 ] });
                //$('#spreadsheet1').jexcel.setColumnData(3,cols);
            });
    });
});

$('#goKmeans').click(function() {
    var form_data = new FormData();
    form_data.append('dataset',JSON.stringify($('#spreadsheet1').jexcel('getData', false)));
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

    });
});
