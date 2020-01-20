function submit_register_screen(){document.getElementById("registerform").submit();}

window.onload = function () { //login function to the system
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
                    alert(data.error);
                }
                if(data.experiments!=null)
                {
                    var userNameDB = document.getElementById("your_name").value;

                    var today = new Date();
                    var dd = String(today.getDate()).padStart(2, '0');
                    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
                    var yyyy = today.getFullYear();

                    today = mm + '/' + dd + '/' + yyyy;
                    window.localStorage.setItem("user", JSON.stringify(new User(userNameDB,today)));

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