localStorage.clear();
    window.onload = function () {
    document.getElementById("signin").addEventListener("click", function() {
        document.getElementById("loadingbar").style.visibility = 'visible';
        var form_data = new FormData();
        form_data.append('inputEmail', document.getElementById("your_name").value);
        form_data.append('password', document.getElementById("your_pass").value);
        $.ajax({
            type: 'POST',
            url: '/login',
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
                if(data.experiments!=null)
                {
                    var userNameDB = document.getElementById("your_name").value;
                    window.localStorage.setItem("userNameDB", JSON.stringify(userNameDB));
                    var experiments=[];
                    for(exp of data.experiments){
                    //transform exp["tasks"] to Task objects
                        experiments.push(new Experiment(exp["id"],exp["experimentName"],exp["experimentDescription"],userNameDB,exp["tasks"])); //continue from here
                    }
                    window.localStorage.setItem("experiments",JSON.stringify(experiments));
                    window.location.pathname = 'static/pages/home.html'
                }
                else
                    alert("The details are incorrect, please try again.");
                    document.getElementById("loadingbar").style.visibility = 'hidden';
            });
    });
};