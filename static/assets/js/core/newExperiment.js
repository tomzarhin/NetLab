var userNameDB = JSON.parse(window.localStorage.getItem("userNameDB"));
var name = document.getElementById("name").value;
  var description = document.getElementById("description").value;
document.getElementById("createExp").addEventListener("click", function() {
  var form_data = new FormData();
  form_data.append('name', document.getElementById("name").value);
  form_data.append('description', document.getElementById("description").value);
  form_data.append('userName',userNameDB);//document.getElementById("userName").value);
    $.ajax({
        type: 'POST',
        url: '/createExperiment',
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
            alert("Experiment has been added successfully");
        });

});