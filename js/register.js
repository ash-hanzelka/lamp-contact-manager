const urlBase = "http://ultrausefulcontactmanager.site/LAMPAPI";
const extension = "php";

function doRegister() {
    // reset error messages
    document.getElementById("registerUsername").classList.remove('error');
    document.getElementById("registerPassword").classList.remove('error');
    document.getElementById("confirmPassword").classList.remove('error');

    // get input values
    var username = document.getElementById("registerUsername").value;
    var password = document.getElementById("registerPassword").value;
    var confirmPassword = document.getElementById("confirmPassword").value;

    // check for empty fields or mismatched passwords
    if (checkRegister(username, password, confirmPassword)) {
        return;
    }

    // hash the password
    var hash = md5(password); // hashing password

    // prepare data to send
    var jsonPayload = JSON.stringify({ "username": username, "password": hash });
    var url = urlBase + '/register.' + extension;

    // make HTTP request
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    // wait for response
    xhr.onreadystatechange = function () {
        if (this.readyState == 4) {
            if (this.status == 200) {
                try {
                    var jsonObject = JSON.parse(xhr.responseText);

                    // handle errors from API response
                    if (jsonObject.error) {
                        document.getElementById("registerResult").innerHTML = jsonObject.error;
                        return;
                    }

                    // If registration successful, redirect to login page
                    window.location.href = "index.html";
                } 
                catch (error) {
                    document.getElementById("registerResult").innerHTML = "Error processing registration response.";
                }
            } else {
                document.getElementById("registerResult").innerHTML = "Registration failed. Please try again.";
            }
        }
    }

    xhr.onerror = function () {
        document.getElementById("registerResult").innerHTML = "Request failed. Please try again.";
    };

    xhr.send(jsonPayload);
}

// handle validation errors
function checkRegister(username, password, confirmPassword) {
    if (!username || !password || !confirmPassword) {
        document.getElementById("registerResult").innerHTML = "All fields are required.";
        if (!username)  {
            document.getElementById("registerUsername").classList.add('error');
        }
        if (!password) {
            document.getElementById("registerPassword").classList.add('error');
        }
        if (!confirmPassword){
            document.getElementById("confirmPassword").classList.add('error');
        }
        return true; // registration has failed
    }

    if (password !== confirmPassword) {
        document.getElementById("registerResult").innerHTML = "Passwords do not match.";
        document.getElementById("registerPassword").classList.add('error');
        document.getElementById("confirmPassword").classList.add('error');
        return true;
    }

    return false;
}
