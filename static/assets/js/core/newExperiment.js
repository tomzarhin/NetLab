var currId;
$(window).on('load',function() {
document.getElementById("createExp").addEventListener("click", function() { //create new experiment and send it to database
  var user = JSON.parse(window.localStorage.getItem("user"));
  var userNameDB=user["username"];
  var name = document.getElementById("name").value;
  var description = document.getElementById("description").value;
  if(name=="" || description=="")
      alerty.toasts("1 or more of the fields is empty, please fill the all fields");
  else
  {
  var form_data = new FormData();
  form_data.append('name', name);
  form_data.append('description',description);
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
            var experiments = JSON.parse(window.localStorage.getItem("experiments"));
            experiments.push(new Experiment(data.nextId,name,description,userNameDB,null));
            window.localStorage.setItem("experiments",JSON.stringify(experiments));
            alerty.toasts('Experiment has been added successfully', {
                              bgColor: '#ccc',
                              fontColor: '#000',
                              place: 'top',
                            })
        setTimeout(function() {
            location.reload();
        }, 2500);
        });
}
});
});