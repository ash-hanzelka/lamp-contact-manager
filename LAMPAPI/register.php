<?php 
    $inData = json_decode(file_get_contents("php://input"), true);

    $username = $inData["username"];
    $password = $inData["password"];
    $first_name = $inData["firstName"];
    $last_name = $inData["lastName"];

    $conn = new mysqli("localhost", "theManager", "ContactManager", "Contact");
    if( $conn->connect_error ) {
        returnError("Connection failed: " . $conn->connect_error);
    } else {
        // Check if the user exists
        $existenceStmt = $conn->prepare("SELECT COUNT(*) as num_users FROM Users WHERE username = ?");
        $existenceStmt->bind_param("s", $username);
        $existenceStmt->execute();

        $existenceResult = $existenceStmt->get_result();

        $numUsers = (int) $existenceResult->fetch_assoc()["num_users"];
        $existenceStmt->close();

        // If the user exists, return an error message
        if($numUsers > 0) {
            returnError("Username already exists.");
        } else {
            // Hash the password before inserting it into the database
            $hashedPassword = md5($password);

            $insertStmt = $conn->prepare("INSERT INTO Users (username, password, firstName, lastName) VALUES (?, ?, ?, ?)");
            $insertStmt->bind_param("ssss", $username, $hashedPassword, $first_name, $last_name);
            $insertStmt->execute();
            if($conn->affected_rows > 0) {
                returnSuccess("User created successfully.");
            } else {
                returnError("Error creating user.");
            }
            $insertStmt->close();
        }
    }

    function returnMsg($string) {
        $retMsg = sprintf('{"msg":"%s"}', $string);
        returnJson($retMsg);
    }

    function returnError($string) {
        $retMsg = sprintf('{"status":"error","msg":"%s"}', $string);
        returnJson($retMsg);
    }

    function returnSuccess($string) {
        $retMsg = sprintf('{"status":"success","msg":"%s"}', $string);
        returnJson($retMsg);
    }
    function returnJson($obj) {
        header('Content-Type: application/json');
        echo $obj;
    }
?>