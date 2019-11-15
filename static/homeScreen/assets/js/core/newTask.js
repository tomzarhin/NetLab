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
                excel_matrix[0]=[];
                var i=0,j=0;
                for (value of data.excelDetails) {
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
                $('#my').jexcel({ data:excel_matrix, colWidths: [ 300, 80, 100 ] });
            });
    });
});