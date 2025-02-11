<?php 
    $in_data = json_decode(file_get_contents("php://input"), true);

    $username = $in_data["username"];
    $password = $in_data["password"];
    $first_name = $in_data["first_name"];
    $last_name = $in_data["last_name"];

    $conn = new mysqli("localhost", "theManager", "ContactManager", "Contact");
    if( $conn->connect_error ) {
        returnMsg("Connection failed: " . $conn->connect_error);
    } else {
        // Check if the user exists
        $existence_stmt = $conn->prepare("SELECT COUNT(*) as num_users FROM Users WHERE username = ?");
        $existence_stmt->bind_param("s", $username);
        $existence_stmt->execute();

        $existence_result = $existence_stmt->get_result();

        $num_users = (int) $existence_result->fetch_assoc()["num_users"];

        if($num_users > 0) {
            returnMsg("Username already exists.");
        } else {
            $insert_stmt = $conn->prepare("INSERT INTO Users (username, password, firstName, lastName) VALUES (?, ?, ?, ?)");
            $insert_stmt->bind_param("ssss", $username, $password, $first_name, $last_name);
            $insert_stmt->execute();
            if($conn->affected_rows > 0) {
                returnMsg("User created successfully.");
            } else {
                returnMsg("Error creating user.");
            }
        }
    }

    function returnMsg($string) {
        $retMsg = sprintf('{"msg":"%s"}', $string);
        returnJson($retMsg);
    }

    function returnJson($obj) {
        header('Content-Type: application/json');
        echo $obj;
    }
?>