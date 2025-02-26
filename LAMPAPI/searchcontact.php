<?php 
    // php error returning
    ini_set('display_errors', 1);
    error_reporting(E_ALL);

    $inData = json_decode(file_get_contents('php://input'), true);

    $type = $inData["type"];
    $userId = (int) $inData["userId"];

    // connect to the database
    $conn = new mysqli("localhost", "theManager", "ContactManager", "Contact");
    if($conn->connect_error) {
        returnError("Connection error: " . $conn->connect_error);
        die();
    }

    // gets all contacts associated with userId. 
    if(strcmp($type, "getall") == 0) {

        $stmt = $conn->prepare("SELECT * FROM Contacts WHERE userid = ? ORDER BY firstName");
        $stmt->bind_param("i", $userId);
        $stmt->execute();
        $stmt_result = $stmt->get_result();

        if($stmt_result == false) {
            returnError("Statement Fail");
            die();
        } 
        $jsonToReturn = [
            "numRows" => $stmt_result->num_rows,
            "Contacts" => getRowsAsArray($stmt_result)
        ];

        returnEncodeJson($jsonToReturn);
    } else if(strcmp($type, "getone") == 0) { // gets a single contact
        $firstName = $inData["firstName"];
        $lastName = $inData["lastName"];

        $stmt = $conn->prepare("SELECT * FROM Contacts WHERE userid = ? AND
        firstName = ? AND
        lastName = ?");
        $stmt->bind_param("iss", $userId, $firstName, $lastName);
        $stmt->execute();

        $stmt_result = $stmt->get_result();
        if($stmt_result == false) {
            returnError("Statement Fail");
            die();
        }

        $jsonToReturn = [
            "numRows" => $stmt_result->num_rows,
            "Contacts" => getRowsAsArray($stmt_result)
        ];

        returnEncodeJson($jsonToReturn);
    } else if(strcmp($type, "getset") == 0) {
        $lookupString = '^[a-zA-Z]*'.$inData["firstName"].'[a-zA-Z]*$';

        $stmt = $conn->prepare("SELECT * FROM Contacts WHERE userid = ? AND
        (firstName REGEXP ? OR lastName REGEXP ?) ORDER BY firstName");
        $stmt->bind_param("iss", $userId, $lookupString, $lookupString);
        $stmt->execute();

        $stmt_result = $stmt->get_result();
        if($stmt_result == false) {
            returnError("Statement error");
            die();
        }

        $jsonToReturn = [
            "numRows" => $stmt_result->num_rows,
            "Contacts" => processLookupAndReturnAsArray($stmt_result, $inData["firstName"])
        ];

        returnEncodeJson($jsonToReturn);
    }

    function returnMsg($string) {
        $retMsg = sprintf('{"msg":"%s"}', $string);
        returnJson($retMsg);
    }

    function processLookupAndReturnAsArray($sql_res, $string) {
        $retArray = [];

        while($row = $sql_res->fetch_assoc()) {
            if(str_contains(strtoupper($row["firstName"]), strtoupper($string))) {
                $old_string = explode(strtoupper($string), strtoupper($row["firstName"]), 2);
                $row["firstName"] = $old_string;
            } else {
                $old_string = explode(strtoupper($string), strtoupper($row["lastName"]), 2);
                $row["lastName"] = $old_string;
            }
            array_push($retArray, $row);
        }
        return $retArray;
    }

    function getRowsAsArray($sqlResult) {
        $retArray = [];
        while($row = $sqlResult->fetch_assoc()) {
            array_push($retArray, $row);
        }

        return $retArray;
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

    function returnEncodeJson($obj) {
        header('Contact-Type: application/json');
        echo json_encode($obj);
    }
?>