<?php 
    $inData = json_decode(file_get_contents("php://input"), true);

    $username = $inData["username"];
    $password = $inData["password"];

    returnMsg(sprintf("Hello %s! Your password is %s", $username, $password));

    function returnMsg($string) {
        $retMsg = sprintf('{"msg":"%s"}', $string);
        returnJson($retMsg);
    }

    function returnJson($obj) {
        header('Content-Type: application/json');
        echo $obj;
    }
?>