<?php
    $inData = json_decode(file_get_contents('php://input'), true);

    $conn = new mysqli("localhost", "theManager", "ContactManager", "Contact");
    if ($conn->connect_error) {
        returnError($conn->connect_error);
    } else {
        $stmt = $conn->prepare("SELECT userid, firstName, lastName FROM Users WHERE username = ? AND password = ?");
        $stmt->bind_param("ss", $inData["username"], $inData["password"]);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($row = $result->fetch_assoc()) {
            // If user found return info
            returnInfo($row['firstName'], $row['lastName'], $row['userid']);
        } else {
            // If user not found return error
            returnError("No Records Found");
        }

        $stmt->close();
        $conn->close();
    }

    function returnJson($obj) {
        header('Content-Type: application/json');
        echo $obj;
    }
    
    function returnError($err) {
        $retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
        returnJson($retValue);
    }
    
    function returnInfo($firstName, $lastName, $id) {
        $retValue = '{"id":' . $id . ',"firstName":"' . $firstName . '","lastName":"' . $lastName . '"}';
        returnJson($retValue);
    }
?>
