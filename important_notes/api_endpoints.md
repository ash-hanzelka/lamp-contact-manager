# Api Endpoints
1. $(website)/LAMPAPI/signup.php
    1. Takes in:
        1. username
        2. password
        3. firstName
        4. lastName
    2. returns
        1. status: success/error
        2. msg: user was created successfully/nature of the error
    3. What it does: 
        1. Adds a new user to the database

2. $(website)/LAMPAPI/searchcontact.php
    1. Fetch all contacts associated with one user
        1. Takes in:
            1. type: getall
            2. userId: (userId of user)
        2. returns
            1. numRows: number of contacts associated with userId
            2. Contacts: Array of Contacts
                1. Contact has:
                    1. userid
                    2. firstName
                    3. lastName
                    4. email
                    5. phone
        3. Notes: if there are no contacts it will return numRows: 0 and an empty array for Contacts
    2. Fetch one contact
        1. Takes in:
            1. type: getone
            2. userId: (userId of user)
            3. firstName
            4. lastName
        2. returns
            1. numRows: number of contacts with matching parameters
            2. Contacts: Array of Contacts
                1. Contact has:
                    1. userid
                    2. firstName
                    3. lastName
                    4. email
                    5. phone   
            3. Notes: if there are no contacts it will return numRows: 0 and an empty array for Contacts
    3. Fetch a set of contacts
        1. Takes in:
            1. type: getone
            2. userId: (userId of user)
            3. firstName
        2. returns
            1. numRows: number of contacts with matching parameters
            2. Contacts: Array of Contacts
                1. Contact has:
                    1. userid
                    2. firstName
                    3. lastName
                    4. email
                    5. phone   
            3. Notes: if there are no contacts it will return numRows: 0 and an empty array for Contacts    
        3. **Notice: what this option does is that it will get all the contacts that have a first name starting with what was entered as firstName**

        