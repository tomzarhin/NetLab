$( document ).ready(function() {
    var coModalButton = document.getElementById("coModalButton");
    var span = document.getElementsByClassName("close")[0];
    var userNameDB = JSON.parse(window.localStorage.getItem("userNameDB"));
    var idExp = JSON.parse(window.localStorage.getItem("idExp"));
    var experiments = JSON.parse(window.localStorage.getItem("experiments"));
    var buttons = document.getElementsByName('taskButton');
    var xButton=document.getElementsByName('xButton');
    var spanBayes = document.getElementsByClassName("close")[1];
    var bayesianModalButton = document.getElementById("bayesianModalButton");

    var j=0;

    var firstDataset = document.getElementById("firstDataset");
    var secoundDataset = document.getElementById("secoundDataset");
    var option;

    for (exp of experiments.filter(x => x.id === parseInt(idExp))) {
        if(exp.task!=null){
            for(task of exp.task){
                option = document.createElement("option");
                option.text = task.taskName;
                firstDataset.add(option);
                option = document.createElement("option");
                option.text = task.taskName;
                secoundDataset.add(option);
                 j=j+1;
                    document.getElementById("p10").innerHTML = document.getElementById("p10").innerHTML +("<div class=\"col-lg-3 col-md-6 col-sm-6\"><div class=\"card card-stats\"><div class=\"card-body \">\n" +
                          "                <div class=\"row\">\n" +
                          "                  <div class=\"col-12 col-md-12\">\n" +
                          "                    <div class=\"numbers\">\n" +
                          "                      <div style='font-size:11px;cursor: pointer;'name=\"xButton\" id="+task.task_id+">&#10006;</div>\n"+
                          "                      <p style=\"font-size:25px\" class=\"card-title text-left\">"+task.taskName+"</p>\n" +
                          "                      <p class=\"card-category text-left\">"+task.taskDescription+"\n" +
                          "                        <p>\n" +
                          "                    </div>\n" +
                          "                  </div>\n" +
                          "                </div>\n" +
                          "              </div>\n" +
                          "              <div class=\"card-footer \">\n" +
                          "                <hr>\n" +
                          "                <div class=\"stats\">\n" +
                          "                   <button class=\"btn btn-warning \" name=\"taskButton\" id="+task.task_id+" href=\"#\" role=\"button\">Enter now</button>" +
                          "                </div>\n" +
                          "              </div>\n" +
                          "            </div>\n" +
                          "          </div>");
            }
        }
    }

    for (var i = 0; i < buttons.length; i++) {
        buttons[i].onclick = function(){
            var idTask= this.id;
            var idExpArray = experiments.findIndex(x => x.id === parseInt(idExp));
            var idTaskArray = experiments[idExpArray].task.findIndex(x => x.task_id === parseInt(idTask))
            window.localStorage.setItem("idTask", JSON.stringify(idTask));
            window.localStorage.setItem("taskName", JSON.stringify(experiments[idExpArray].task[idTaskArray].taskName));
            location.href = "../pages/dataset.html";

        };
        xButton[i].onclick = function(){
            var idTask= this.id;
            var idExpArray = experiments.findIndex(x => x.id === parseInt(idExp));

            // alerty.confirm(content, opts, onOk, onCancel)
            alerty.confirm(
              'Are you sure?',
              {title: 'Notes', cancelLabel: 'Cancel', okLabel: 'Confirm'},
              function(){
                    var form_data = new FormData();
                    form_data.append('idTask', JSON.stringify(idTask));
                    form_data.append('idExp', JSON.stringify(idExp));

                    $.ajax({
                        type: 'POST',
                        url: '/deleteTask',
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
                            // alerty.toasts(content, opts, callback)
                            var idTaskArray = experiments[idExpArray].task.findIndex(x => x.task_id === parseInt(idTask))
                            if (idTaskArray > -1) {
                              experiments[idExpArray].task.splice(idTaskArray, 1);
                            }
                            window.localStorage.setItem("experiments", JSON.stringify(experiments));
                            alerty.toasts('Task deleted successfully', {
                              bgColor: '#ccc',
                              fontColor: '#000',
                              place: 'top',
                            })
                            setTimeout(function(){ location.reload(); }, 2500);
                        });
              },
              function() {
                    alerty.toasts('Action cancelled')
              }
            )
        }
    }

    // When the user clicks the button, open the modal
    coModalButton.onclick = function() {
      coModal.style.display = "block";
    }

    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
      coModal.style.display = "none";
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
      if (event.target == coModal) {
        coModal.style.display = "none";
      }
    }

    $('#goCoClustering').click(function () {
    if(firstDataset.value === secoundDataset.value){
        alert("unable to analyze the same task");
        return;
    }
    var form_data = new FormData();
    var exp=experiments.filter(x => x.id === parseInt(idExp));

    var task1=exp[0].task.filter(x => x.taskName === firstDataset.value);
    var task1_dataset=task1[0].dataset;

    var task2=exp[0].task.filter(x => x.taskName === secoundDataset.value);
    var task2_dataset=task2[0].dataset;


    window.localStorage.setItem("task1", JSON.stringify(task1));
    window.localStorage.setItem("task2", JSON.stringify(task2));

    form_data.append('dataset1', JSON.stringify(task1_dataset));
    form_data.append('dataset2', JSON.stringify(task2_dataset));
    form_data.append('clusteringNum', document.getElementById("clusteringNum").value);

    $.ajax({
        type: 'POST',
        url: '/goCoClustering',
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
            window.localStorage.setItem("coclusteringtable", JSON.stringify(data.contingency_table));
            window.localStorage.setItem("labels1", JSON.stringify(data.labels1));
            window.localStorage.setItem("labels2", JSON.stringify(data.labels2));

            alert(data.contingency_table);
            location.href = "../pages/coclustering.html";
        });
});


  $('#goExpBaysienNetwork').click(function () {
    var form_data = new FormData();
    var exp=experiments.filter(x => x.id === parseInt(idExp));
    form_data.append('expDataset', JSON.stringify(exp[0].task));
    form_data.append('numberOfParents', document.getElementById("numberOfParents").value);
    form_data.append('dontKnowTheArrangement', document.getElementById("dontKnowTheArrangement").value);

    $.ajax({
        type: 'POST',
        url: '/goExpBaysienNetwork',
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
            window.localStorage.setItem("dataset_k2", JSON.stringify(data.dataset_k2));
            window.localStorage.setItem("categories", JSON.stringify(data.categories));
            window.localStorage.setItem("cpt_list",JSON.stringify(data.cpt_list));
            window.localStorage.setItem("element_categories",JSON.stringify(data.element_categories))
            location.href = "../pages/bayesGraph.html";
        });
   });

// When the user clicks the button, open the modal
bayesianModalButton.onclick = function() {
  bayesianModal.style.display = "block";
}
spanBayes.onclick = function() {
  bayesianModal.style.display = "none";
}

window.onclick = function(event) {
  if (event.target == bayesianModal) {
    bayesianModal.style.display = "none";
  }
}

});

function changeFlagValue(){
  var checkBox = document.getElementById("dontKnowTheArrangement");
  if (checkBox.checked == true){
    checkBox.value = "block";
  } else {
     checkBox.value = "none";
  }
}