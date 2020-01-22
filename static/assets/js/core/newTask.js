var idExp = JSON.parse(window.localStorage.getItem("idExp")); //id of the current experiment
var data_after_cleaning;

function getDataFromjexcel() { //put dataset from excel in from_data variable for sending to the server
    var form_data = new FormData();
    if (document.getElementById("empty_cell").checked == true) {
        data_after_cleaning = jexcelSpreadSheet.getData().filter(function(arr) {
            for (var i = 0; i < arr.length; i++)
                if (isNaN(arr[i]))
                    return false;
            return true;
        });
    } else {
        data_after_cleaning = jexcelSpreadSheet.getData();
    }
    form_data.append('dataset', JSON.stringify(data_after_cleaning));
    form_data.append('datasetcols', JSON.stringify(jexcelSpreadSheet.getHeaders()));
    return (form_data);
}

window.onload = function() {
    $(function() {
        $('#fileElem').change(function() {
            var tmppath = URL.createObjectURL(event.target.files[0]);
            jexcelSpreadSheet = jexcel(document.getElementById('spreadsheet1'), {
                csv: tmppath,
                csvHeaders: true,
                tableOverflow: true,
                lazyLoading: true,
                loadingSpin: true,
                colWidths: [300, 80, 100],
            });
        });
    });

    $('#createTask').click(function() { //create new task and send it to database
        var form_data = getDataFromjexcel();
        var taskname = document.getElementById("taskname").value;
        var taskDescription = document.getElementById("taskDescription").value;
        form_data.append('taskname', taskname);
        form_data.append('taskDescription', taskDescription);
        form_data.append('current_experiment', idExp);

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
            .done(function(data) {
                if (data.error) {
                    confirm(data.error);
                }
                var experiments = JSON.parse(window.localStorage.getItem("experiments"));
                var task = new Task(data.idTask, taskname, taskDescription, data_after_cleaning, jexcelSpreadSheet.getHeaders());
                var exp = experiments.filter(x => x.id === parseInt(idExp));
                if (exp[0].task == null) {
                    exp[0].task = [];
                }
                exp[0].task.push(task);
                window.localStorage.setItem("experiments", JSON.stringify(experiments));
                alerty.toasts('added succesfully', {
                    bgColor: '#ccc',
                    fontColor: '#000',
                    place: 'top',
                })
                location.reload();
            });
    });
}