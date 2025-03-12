<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

echo "Testing database connection...<br>";

try {
    $conn = new mysqli("localhost", "theManager", "ContactManager", "Contact");
    
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }
    
    echo "Successfully connected to the database!";
    $conn->close();
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
?>