    window.onload = function () { //register function to the system
    document.getElementById("register").addEventListener("click", function() {
        if(document.getElementById("your_name").value=="" || document.getElementById("your_pass").value=="" || document.getElementById("your_username").value==null)
            alert("1 or more of the fields is empty, please fill the all the fields");
        else
        {
            document.getElementById("loadingbar").style.visibility = 'visible';
            var form_data = new FormData();
            form_data.append('inputEmail', document.getElementById("your_name").value);
            form_data.append('password', document.getElementById("your_pass").value);
            form_data.append('userFullName', document.getElementById("your_username").value);
            $.ajax({
                type: 'POST',
                url: '/register',
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
                });
        }
     });
};