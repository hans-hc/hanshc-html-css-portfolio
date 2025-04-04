<!--
- Hansen Cheng
- March 30 2025
-->
<?php
require_once "connect.php";

//Retrieve row, retrieve column
$row = filter_input(INPUT_GET, 'row', FILTER_VALIDATE_INT);
$col = filter_input(INPUT_GET, 'column', FILTER_VALIDATE_INT);

//If either row or column is invalid, stop execute and display error message
if (!$row || !$col) {
    die("Invalid row or column.");
}

//sql statement to check if Wumpus exists at specified row and column
$stmt = $pdo->prepare("SELECT * FROM `wumpuses` WHERE `row` = :row AND `col` = :col");
$stmt->execute(['row' => $row, 'col' => $col]);
$wumpus = $stmt->fetch();

//if Wumpus exists, set true
$foundWumpus = $wumpus ? true : false;
?>

<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Wumpus Game Result</title>
    <link rel="stylesheet" href="css/wumpus.css">
    <script src="js/validation.js"></script>
</head>
<body>
    <div id="container">
        <!--Wumpus Found-->
        <?php if ($foundWumpus): ?>
            <h2>You found Wumpus!</h2>
            <img src="images/wumpus.jpg" alt="You Found Wumpus!" style="width:300px;">
        <!--Wumpus Not Found-->
        <?php else: ?>
            <h2>You did not find Wumpus.</h2>
            <img src="images/nowumpus.jpg" alt="You did not find Wumpus." style="width:300px;"/>
        <?php endif; ?>

        <!--User Form-->
        <form id="playerForm" action="save.php" method="post">
            <input type="hidden" name="result" value="<?php echo $foundWumpus ? 'win' : 'loss'; ?>">
    
            <label for="email">Email:</label>
            <input type="email" id="email" name="email" required>
            <span id="email-error" style="color: red;"></span><br>
            
            <label for="name">Name:</label>
            <input type="text" id="name" name="name" required>
            <span id="name-error" style="color: red;"></span><br>
            
            <button type="submit">Submit</button>
        </form>
    </div>
</body>
</html>