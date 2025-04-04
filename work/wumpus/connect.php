<!--
- Hansen Cheng
- March 30 2025
-->
<?php
//Set the default timezone to America/Toronto for proper date and time handling
date_default_timezone_set('America/Toronto');

try {
    //Create a new PDO instance to connect to the MySQL database
    $pdo = new PDO(
        "mysql:host=localhost;dbname=chengc86_db",
        "chengc86_local",
        "tyotxkfL"
    );
} catch (Exception $e) {
    //If the connection fails, output an error message and stop the script
    die("ERROR: Couldn't connect. {$e->getMessage()}");
}
?>
