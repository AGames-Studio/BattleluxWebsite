<?php
// Connect to MySQL database
$servername = "fdb28.awardspace.net";
$username = "3698237_battlelux";
$password = "OC:O-DP[2VM+}Ysq";
$dbname = "3698237_battlelux";

$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Get JSON data from the POST request
$data = json_decode(file_get_contents("php://input"), true);

// Iterate through the processes and insert them into the database
foreach ($data as $process) {
    $name = $process["Name"];
    $id = $process["Id"];
    $conn->query("INSERT INTO processes (name, id) VALUES ('$name', '$id')");
}

$conn->close();
?>