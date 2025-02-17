<?php 
    // php error returning
    ini_set('display_errors', 1);
    error_reporting(E_ALL);

    $inData = json_decode(file_get_contents('php://input'), true);

    $type = $inData["type"];

    // connect to the database
    $conn = new mysqli("localhost", "theManager", "ContactManager", "Contact");
    if($conn->connect_error) {
        returnError("Connection error: " . $conn->connect_error);
        die();
    }

    // gets all contacts associated with userId. 
    if(strcmp($type, "getall") == 0) {
        $userId = (int) $inData["userId"];

        $stmt = $conn->prepare("SELECT * FROM Contacts WHERE userid = ?");
        $stmt->bind_param("i", $userId);
        $stmt->execute();
        $stmt_result = $stmt->get_result();

        if($stmt_result == false) {
            returnError("Statement Fail");
            die();
        } 

        if($stmt_result->num_rows == 0) {
            returnRows(0, "[]");
        } else {
            returnRows(1, "[test test test]");
        }
    }

    function buildJsonList($sql_result) {

    }

    function returnRows($num_rows, $json_object) {
        $retJson = sprintf('{"num_rows":"%i", "contacts":%s}', $num_rows, $json_object);
        returnJson($retJson);
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