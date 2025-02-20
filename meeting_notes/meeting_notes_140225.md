# Tasks for this week

## Front-end
1. Contact Layout
    2. Adding new Contacts
    3. Contact List
2. Scripts
    1. Look up Contacts
    2. Add Contact
    3. Delete Contact Update
    4. Update Contact

## Back-end/API
1. Add a new Contact {NELSON}
2. Look up Contacts (return a list of contacts) {NELSON}
    1. (?) Partial look-up TENTATIVE
    2. Full Contact name look up
3. Delete a contact (from DB) {MARCO}
4. Update Contact Information {BRITTNEY}

# Endpoints
1. add contact -> newcontact.php
    1. TAKES IN
        0. userid
        1. first name
        2. last name
        3. email address
        4. phone number
    2. On success 
        JSON w/ status: success
    3. On failure
        JSON w/ status: failure
2. delete contact -> deletecontact.php
    1. TAKES IN
        0. userid
        1. first name
        2. last name
        3. email address
        4. phone number
    2. On success
        JSON w/ status: success
    3. On failure
        JSON w/ status: failure
3. look up contact -> searchcontact.php
    1. TAKES IN
        0. userid
        1. first name
        2. last name
    2. RETURNS
        1. number of contacts
        2. list of contacts (with their information)
4. update contact -> updatecontact.php (IRONING OUT)
    1. TAKES IN
        0. userid
        1. Original information of the contact
        2. New information of the contact
    2. RETURNS Success
        1. On success -> status: success
        2. On failure -> 
            status: failure,
            msg: why it failed