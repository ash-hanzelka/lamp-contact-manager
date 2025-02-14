// fix cookies function call later
const urlBase = "http://ultrausefulcontactmanager.site/LAMPAPI";
const extension = "php";

function doLogin() {
    // reset errors
    document.getElementById("loginName").classList.remove('error');
    document.getElementById("loginPassword").classList.remove('error');

    // get text entries
    var username = document.getElementById("loginName").value;
    var password = document.getElementById("loginPassword").value;
    // var hash = md5(password); // hash of password

    // check login
    if (checkLogin(username, password)) {
        return;
    }

    // clear previous login errors
    document.getElementById("loginResult").innerHTML = "";

    // store username and hashed password in JSON
    var jsonPayload = JSON.stringify({ "username": username, "password": password });
    var url = urlBase + '/signin.' + extension;

    // make HTTP request
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    // wait for response
    // Handle server response
    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            if (this.status == 200) {
                try {
                    var jsonObject = JSON.parse(xhr.responseText);

                    // check errors if API response invalid
                    if (!jsonObject || jsonObject.error) {
                        document.getElementById("loginResult").innerHTML = jsonObject.error || "invalid login response.";
                        return;
                    }

                    let userId = jsonObject.id;

                    if (userId < 1) {
                        document.getElementById("loginResult").innerHTML = "Invalid username or password.";
                        return;
                    }

                    let firstName = jsonObject.firstname;
                    let lastName = jsonObject.lastname;


                    // Redirect to contacts page after successful login
                    window.location.href = "contacts.html";
                } 
                catch (error) {
                    document.getElementById("loginResult").innerHTML = "Error processing login response.";
                }
            } else {
                // checking for parsing failure
                document.getElementById("loginResult").innerHTML = "Login failed. Please try again.";
            }
        }
    }

    // Handle request failure - TESTING 
    xhr.onerror = function () {
        document.getElementById("loginResult").innerHTML = "Request failed. Please try again.";
    };

    xhr.send(jsonPayload);
}

// handling missing fields
function checkLogin(username, password) {
    if (!username || !password) {
        document.getElementById("loginResult").innerHTML = "Missing a field. Please try again.";
        
        if (!username) {
            document.getElementById("loginName").classList.add('error');
        }
        if (!password) {
            document.getElementById("loginPassword").classList.add('error');
        }

        return true; // login fail
    }
    
    document.getElementById("loginName").classList.remove('error');
    document.getElementById("loginPassword").classList.remove('error');
    return false;
}
