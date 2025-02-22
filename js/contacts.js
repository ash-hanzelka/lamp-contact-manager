document.addEventListener("DOMContentLoaded", function () {
    const contactsList = document.getElementById("contactsList");
    const addContactForm = document.getElementById("addcontactform");
    const toggleFormButton = document.getElementById("toggleformbutton");
    const cancelFormButton = document.getElementById("cancelForm");
    const searchInput = document.getElementById("searchInput");
    const deleteConfirmPopup = document.getElementById("deleteConfirmPopup");
    const confirmDeleteButton = document.getElementById("confirmDeleteButton");
    const cancelDeleteButton = document.getElementById("cancelDeleteButton");

    const editContactPopup = document.getElementById("editContactPopup");
    const editContactForm = document.getElementById("editContactForm");
    const editFirstName = document.getElementById("editFirstName");
    const editLastName = document.getElementById("editLastName");
    const editEmail = document.getElementById("editEmail");
    const editPhone = document.getElementById("editPhone");
    const cancelEditContactButton = document.getElementById("cancelEditContactButton");

    var urlBase = "http://ultrausefulcontactmanager.site/LAMPAPI";
    var extension = "php";
    var userId = localStorage.getItem("userId");

    if (!userId) {
        window.location.href = "index.html";
        return;
    }

    let contactToDelete = null;
    let contactToEdit = null;

    function fetchContacts() {
        fetch(`${urlBase}/searchcontact.${extension}`, {
            method: "POST",
            body: JSON.stringify({
                userId: userId,
                type: "getall"
            }),
            headers: { "Content-Type": "application/json" }
        })
        .then(response => response.json())
        .then(data => {
            if (data.numRows === 0) {
                contactsList.innerHTML = `<p style="color: white; text-align: center;">No contacts found.</p>`;
            } else {
                displayContacts(data.Contacts);
            }
        })
        .catch(error => console.error("Error fetching contacts:", error));
    }
    function displayContacts(contacts) {
        contactsList.innerHTML = contacts.map(contact => `
            <div class="contact-card"
                 data-firstname="${contact.firstName}"
                 data-lastname="${contact.lastName}"
                 data-email="${contact.email}"
                 data-phone="${contact.phone}">
                <h3>${contact.firstName} ${contact.lastName}</h3>
                <p>Email: ${contact.email}</p>
                <p>Phone: ${contact.phone}</p>
                <div class="contact-actions">
                    <button class="edit-button">
                        <i class="fas fa-edit icon-blue"></i>
                    </button>
                    <button class="delete-button">
                        <i class="fas fa-trash-alt icon-blue"></i>
                    </button>
                </div>
            </div>
        `).join("");
        document.querySelectorAll(".delete-button").forEach(button => {
            button.addEventListener("click", () => {
                const card = button.closest(".contact-card");
                contactToDelete = {
                    userId: userId,
                    firstName: card.getAttribute("data-firstname"),
                    lastName: card.getAttribute("data-lastname"),
                    email: card.getAttribute("data-email"),
                    phone: card.getAttribute("data-phone")
                };
                showDeletePopup();
            });
        });

        // click event to EDIT button
        document.querySelectorAll(".edit-button").forEach(button => {
            button.addEventListener("click", () => {
                const card = button.closest(".contact-card");
                contactToEdit = {
                    firstName: card.getAttribute("data-firstname"),
                    lastName: card.getAttribute("data-lastname"),
                    email: card.getAttribute("data-email"),
                    phone: card.getAttribute("data-phone")
                };
                openEditForm(contactToEdit);
            });
        });
    }

    function showDeletePopup() {
        deleteConfirmPopup.classList.add("show");
    }
    confirmDeleteButton.addEventListener("click", function () {
        if (contactToDelete) {
            fetch(`${urlBase}/deletecontact.${extension}`, {
                method: "POST",
                body: JSON.stringify(contactToDelete),
                headers: { "Content-Type": "application/json" }
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === "success") {
                    fetchContacts();
                } else {
                    alert("Error deleting contact: " + data.msg);
                }
            })
            .catch(error => console.error("Error deleting contact:", error));
        }
        deleteConfirmPopup.classList.remove("show");
    });
    cancelDeleteButton.addEventListener("click", function () {
        deleteConfirmPopup.classList.remove("show");
    });

    function openEditForm(contactData) {
        // populate 
        editFirstName.value = contactData.firstName;
        editLastName.value = contactData.lastName;
        editEmail.value = contactData.email;
        editPhone.value = contactData.phone;

        // slide up remove .hidden-popup, add .show
        editContactPopup.classList.remove("hidden-popup");
        editContactPopup.classList.add("show");
    }

    cancelEditContactButton.addEventListener("click", function() {
        // hide with reversing class
        editContactPopup.classList.remove("show");
        editContactPopup.classList.add("hidden-popup");
    });

    // need to refrsh list
    editContactForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const updatedContact = {
            userId: userId,
            firstName: editFirstName.value.trim(),
            lastName: editLastName.value.trim(),
            email: editEmail.value.trim(),
            phone: editPhone.value.trim()
        };
        fetch(`${urlBase}/updatecontact.${extension}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedContact)
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === "success") {
                // refetching all contacts to see the update?
                fetchContacts();

                // hide the edit popup after 
                editContactPopup.classList.remove("show");
                editContactPopup.classList.add("hidden-popup");
            } else {
                alert("Error updating contact: " + data.msg);
            }
        })
        .catch(error => console.error("Error updating contact:", error));
    });

    toggleFormButton.addEventListener("click", () => {
        if (addContactForm.classList.contains("hidden-form")) {
            addContactForm.classList.remove("hidden-form");
        } else {
            addContactForm.classList.add("hidden-form");
            addContactForm.reset();
        }
    });
    cancelFormButton.addEventListener("click", () => {
        addContactForm.classList.add("hidden-form");
        addContactForm.reset();
    });

    addContactForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const newContact = {
            userId: userId,
            firstName: document.getElementById("firstName").value.trim(),
            lastName: document.getElementById("lastName").value.trim(),
            email: document.getElementById("email").value.trim(),
            phone: document.getElementById("phone").value.trim()
        };

        fetch(`${urlBase}/newcontact.${extension}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newContact)
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === "success") {
                fetchContacts();
                addContactForm.classList.add("hidden-form");
                addContactForm.reset();
            } else {
                alert("Error: " + data.msg);
            }
        })
        .catch(error => console.error("Error adding contact:", error));
    });
    searchInput.addEventListener("input", function () {
        let searchTerm = searchInput.value.trim();
        if (searchTerm === "") {
            fetchContacts();
            return;
        }
        fetch(`${urlBase}/searchcontact.${extension}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                userId: userId,
                type: "getset",
                firstName: searchTerm
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.numRows === 0) {
                contactsList.innerHTML = `<p style="color: white; text-align: center;">No contacts found.</p>`;
            } else {
                displayContacts(data.Contacts);
            }
        })
        .catch(error => console.error("Error searching contacts:", error));
    });
    fetchContacts();
    // hide ? 
    editContactPopup.classList.add("hidden-popup");
});




// FOR LOCAL TESTING -----------------------------------------------------------------------------------
// document.addEventListener("DOMContentLoaded", function () {
//     const contactsList = document.getElementById('contactsList');
//     const addContactForm = document.getElementById('addcontactform');
//     const toggleFormButton = document.getElementById('toggleformbutton');
//     const cancelFormButton = document.getElementById('cancelForm');
//     const searchInput = document.getElementById('searchInput');

//     const deleteConfirmPopup = document.getElementById('deleteConfirmPopup');
//     const confirmDeleteButton = document.getElementById('confirmDeleteButton');
//     const cancelDeleteButton = document.getElementById('cancelDeleteButton');

//     let currentEditId = null; // To track the current editing contact ID

//     const sortByFirstNameButton = document.getElementById('sortByFirstName');
//     const sortByLastNameButton = document.getElementById('sortByLastName');

    

//     let mockContacts = [
//         { id: 1, firstName: "John", lastName: "Doe", email: "johndoe@email.com", phone: "123-456-7890" },
//         { id: 2, firstName: "Jane", lastName: "Smith", email: "janesmith@email.com", phone: "987-654-3210" },
//         { id: 3, firstName: "Alice", lastName: "Johnson", email: "alicej@email.com", phone: "555-555-5555" },
//         { id: 4, firstName: "Carly", lastName: "Miana", email: "", phone: "333-333-3333" },
//         { id: 5, firstName: "Hiana", lastName: "Crude", email: "hc@email.com", phone: "123-456-7890" }
//     ];

//     function getNextId() {
//         return mockContacts.length === 0 ? 1 : Math.max(...mockContacts.map(contact => contact.id)) + 1;
//     }

//     function fetchContacts() {
//         displayContacts(mockContacts);
//     }

//     function displayContacts(contacts) {
//         const sortBy = document.getElementById('sortBy').value;
    
//         // Sort contacts based on selected option
//         contacts.sort((a, b) => {
//             if (sortBy === 'firstName') {
//                 return a.firstName.localeCompare(b.firstName);
//             } else {
//                 return a.lastName.localeCompare(b.lastName);
//             }
//         });
//         document.getElementById('sortBy').addEventListener('change', () => {
//             displayContacts(mockContacts); // Re-display contacts based on the new sorting option
//         });
    
//         contactsList.innerHTML = contacts.map((contact) => `
//             <div class="contact-card" data-id="${contact.id}">
//                 <div class="contact-info">
//                     <h3>${contact.firstName} ${contact.lastName}</h3>
//                     <p>Email: ${contact.email}</p>
//                     <p>Phone: ${contact.phone}</p>
//                 </div>
//                 <div class="contact-actions">
//                     <button class="edit-button"><i class="fas fa-edit icon-blue"></i></button>
//                     <button class="delete-button"><i class="fas fa-trash-alt icon-blue"></i></button>
//                 </div>
//             </div>
//         `).join('');
    
//         // Attach event listeners to edit and delete buttons
//         document.querySelectorAll('.edit-button').forEach(button => {
//             button.addEventListener('click', handleEditContact);
//         });
//         document.querySelectorAll('.delete-button').forEach(button => {
//             button.addEventListener('click', handleDeleteContact);
//         });
//     }

//     function handleEditContact(event) {
//         const contactCard = event.target.closest('.contact-card');
//         const contactId = parseInt(contactCard.getAttribute('data-id'));

//         const contact = mockContacts.find(c => c.id === contactId);

//         if (contact) {
//             // Populate the form with contact details
//             document.getElementById('firstName').value = contact.firstName;
//             document.getElementById('lastName').value = contact.lastName;
//             document.getElementById('email').value = contact.email;
//             document.getElementById('phone').value = contact.phone;

//             currentEditId = contact.id; // Store the ID of the contact being edited

//             // Show the form
//             addContactForm.classList.remove('hidden-form');
//         } else {
//             alert("Contact not found.");
//         }
//     }

//     function handleDeleteContact(event) {
//         const contactCard = event.target.closest('.contact-card');
//         const contactId = contactCard.getAttribute('data-id');

//         deleteConfirmPopup.classList.add('show');

//         confirmDeleteButton.onclick = function() {
//             mockContacts = mockContacts.filter(contact => contact.id != contactId);
//             displayContacts(mockContacts);
//             deleteConfirmPopup.classList.remove('show');
//         };

//         cancelDeleteButton.onclick = function() {
//             deleteConfirmPopup.classList.remove('show');
//         };
//     }

//     function handleSaveContact(e) {
//         e.preventDefault();

//         const newContactData = {
//             id: currentEditId || getNextId(), // Use existing ID if editing
//             firstName: document.getElementById('firstName').value.trim(),
//             lastName: document.getElementById('lastName').value.trim(),
//             email: document.getElementById('email').value.trim(),
//             phone: document.getElementById('phone').value.trim()
//         };

//         if (currentEditId) {
//             // Update existing contact
//             const contactIndex = mockContacts.findIndex(c => c.id === currentEditId);
//             if (contactIndex !== -1) {
//                 mockContacts[contactIndex] = newContactData;
//             }
//         } else {
//             // Add new contact
//             mockContacts.push(newContactData);
//         }

//         // Reset form
//         addContactForm.reset();
//         addContactForm.classList.add('hidden-form');
//         currentEditId = null; // Reset the editing ID

//         displayContacts(mockContacts);
//     }

//     toggleFormButton.addEventListener('click', () => {
//         addContactForm.classList.toggle('hidden-form');
//         if (addContactForm.classList.contains('hidden-form')) {
//             addContactForm.reset();
//             currentEditId = null; // Reset when closing the form
//         }
//     });

//     cancelFormButton.addEventListener('click', () => {
//         addContactForm.classList.add('hidden-form');
//         addContactForm.reset();
//         currentEditId = null; // Reset when canceling
//     });

//     addContactForm.addEventListener('submit', handleSaveContact);

//     searchInput.addEventListener('input', function () {
//         const searchTerm = searchInput.value.trim().toLowerCase();
//         const filteredContacts = mockContacts.filter(contact => 
//             contact.firstName.toLowerCase().includes(searchTerm) ||
//             contact.lastName.toLowerCase().includes(searchTerm) ||
//             contact.email.toLowerCase().includes(searchTerm) ||
//             contact.phone.includes(searchTerm)
//         );

//         displayContacts(filteredContacts);
//     });

//     fetchContacts(); // Initial fetch
// });









