document.addEventListener("DOMContentLoaded", function () {
    const contactsList = document.getElementById('contactsList');
    const addContactForm = document.getElementById('addcontactform');
    const toggleFormButton = document.getElementById('toggleformbutton');
    const cancelFormButton = document.getElementById('cancelForm');
    // search 
    // delete

    // Define API base URL and extension
    var urlBase = "http://ultrausefulcontactmanager.site/LAMPAPI";
    var extension = "php";

    // trying local storage
    var userId = localStorage.getItem("userId");




    // fetch
    if (!userId) {
        window.location.href = "index.html"; // redirect
        return;
    }
    function fetchContacts() {
        fetch(`${urlBase}/searchcontact.${extension}`, {
            method: 'POST',
            body: JSON.stringify({ userId: userId, type: "getall" }), 
            headers: { "Content-Type": "application/json" }
        })
        .then(response => response.json())
        .then(data => {
            if (data.numRows === 0) {
                contactsList.innerHTML = "<p>No contacts found.</p>"; 
            } else if (Array.isArray(data.Contacts)) {
                displayContacts(data.Contacts);
            } else {
                console.error("Unexpected response:", data);
            }
        })
        .catch(error => console.error("Error fetching contacts:", error));
    }

    // display contacts
    function displayContacts(contacts) {
        contactsList.innerHTML = contacts.map(contact => `
            <div class="contact-card">
                <h3>${contact.firstName} ${contact.lastName}</h3>
                <p>Email: ${contact.email}</p>
                <p>Phone: ${contact.phone}</p>
            </div>
        `).join('');
    }

    // toggle add form
    toggleFormButton.addEventListener('click', () => {
    if (addContactForm.classList.contains('hidden-form')) {
        addContactForm.classList.remove('hidden-form'); // show
    } 
    else {
        addContactForm.classList.add('hidden-form'); 
        addContactForm.reset();
    }
});

    // toggle add contacts

    // cancel add 
    cancelFormButton.addEventListener('click', () => {
        addContactForm.classList.add('hidden-form');
        addContactForm.reset();
    });

    // add new contact
    addContactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const contactData = {
            userId: userId, 
            firstName: document.getElementById('firstName').value.trim(),
            lastName: document.getElementById('lastName').value.trim(),
            email: document.getElementById('email').value.trim(),
            phone: document.getElementById('phone').value.trim()
        };

        fetch(`${urlBase}/newcontact.${extension}`, {
            method: 'POST',
            body: JSON.stringify(contactData),
            headers: { 'Content-Type': 'application/json' }
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === "success") {
                alert("Contact added successfully!");
                fetchContacts(); 
                addContactForm.classList.add('hidden-form');
                addContactForm.reset();
            } else {
                alert("Error: " + data.msg);
            }
        })
        .catch(error => console.error("Error:", error));
    });

    // load contacts when page loads
    fetchContacts();
});




// fetch
// search
// add
// display contact
    // delete
    // edit
        // showing the edit form
        // cancel
