localStorage.clear();
    window.onload = function () { //login function to the system
    document.getElementById("register").addEventListener("click", function() {
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
};