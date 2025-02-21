document.addEventListener("DOMContentLoaded", function () {
    const contactsList = document.getElementById("contactsList");
    const addContactForm = document.getElementById("addcontactform");
    const toggleFormButton = document.getElementById("toggleformbutton");
    const cancelFormButton = document.getElementById("cancelForm");
    const searchInput = document.getElementById("searchInput");

    let contacts = JSON.parse(localStorage.getItem("contacts")) || [];

    function saveContacts() {
        localStorage.setItem("contacts", JSON.stringify(contacts));
    }

    function displayContacts() {
        contactsList.innerHTML = contacts.map((contact, index) => `
            <div class="contact-card" data-index="${index}">
                <h3>${contact.firstName} ${contact.lastName}</h3>
                <p>Email: ${contact.email}</p>
                <p>Phone: ${contact.phone}</p>
                <div class="contact-actions">
                    <button class="delete-button" data-index="${index}">
                        <i class="fas fa-trash-alt icon-blue"></i>
                    </button>
                </div>
            </div>
        `).join("");

        document.querySelectorAll(".delete-button").forEach(button => {
            button.addEventListener("click", function () {
                const index = this.getAttribute("data-index");
                contacts.splice(index, 1);
                saveContacts();
                displayContacts();
            });
        });
    }

    addContactForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const newContact = {
            firstName: document.getElementById("firstName").value.trim(),
            lastName: document.getElementById("lastName").value.trim(),
            email: document.getElementById("email").value.trim(),
            phone: document.getElementById("phone").value.trim()
        };

        contacts.push(newContact);
        saveContacts();
        displayContacts();
        addContactForm.classList.add("hidden-form");
        addContactForm.reset();
    });

    toggleFormButton.addEventListener("click", () => {
        addContactForm.classList.toggle("hidden-form");
    });

    cancelFormButton.addEventListener("click", () => {
        addContactForm.classList.add("hidden-form");
        addContactForm.reset();
    });

    displayContacts();
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









