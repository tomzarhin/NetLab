$( document ).ready(function() {
    var idExp = JSON.parse(window.localStorage.getItem("idExp"));
    var idTask = JSON.parse(window.localStorage.getItem("idTask"));
    var experiments = JSON.parse(window.localStorage.getItem("experiments"));
                jexcelSpreadSheet=jexcel(document.getElementById('spreadsheet1'), {
                    //colHeaders: data.excelCols,
                    //data:data.excelDetails,
                    data:experiments[parseInt(idExp)-1].task[parseInt(idTask)-1].dataset,
                    csvHeaders:true,
                    tableOverflow:true,

                    loadingSpin:true,
                    colWidths: [ 300, 80, 100 ],
                });
});

