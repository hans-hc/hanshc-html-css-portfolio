<!--
- Hansen Cheng
- March 30 2025
-->
<?php
require_once 'connect.php';

//Retrieve email, name, and result from POST data
$email  = filter_input(INPUT_POST, 'email', FILTER_VALIDATE_EMAIL);
$name   = filter_input(INPUT_POST, 'name', FILTER_SANITIZE_SPECIAL_CHARS);
$result = filter_input(INPUT_POST, 'result', FILTER_SANITIZE_SPECIAL_CHARS);

//If email, name, or result is invalid, or if result is not 'win' or 'loss', stop execution and display an error message
if (!$email || !$name || !$result || !in_array($result, ['win', 'loss'])) {
    die("Invalid form submission.");
}

//SQL statement to check if the player already exists in the database
$stmt = $pdo->prepare("SELECT * FROM players WHERE email = :email");
$stmt->execute(['email' => $email]);
$user = $stmt->fetch();

//Retrieve the current date and time for updating the record
$currentDate = date('Y-m-d H:i:s');

//If the player does not exist, insert a new record with wins/losses based on the result
if (!$user) {
    //For a new player, set wins to 1 if the result is win, otherwise 0; similarly, set losses to 1 if the result is loss, otherwise 0
    $wins = ($result === 'win') ? 1 : 0;
    $losses = ($result === 'loss') ? 1 : 0;
    $insertStmt = $pdo->prepare("INSERT INTO players (email, name, wins, losses, last_played) 
                                 VALUES (:email, :name, :wins, :losses, :last_played)");
    $insertStmt->execute([
        'email' => $email,
        'name' => $name,
        'wins' => $wins,
        'losses' => $losses,
        'last_played' => $currentDate
    ]);
} else {
    //If the player exists, update their record based on the game result
    if ($result === 'win') {
        //If result is win, increment wins by 1
        $updateStmt = $pdo->prepare("UPDATE players 
                                     SET name = :name, wins = wins + 1, last_played = :last_played 
                                     WHERE email = :email");
    } else {
        //If result is loss, increment losses by 1
        $updateStmt = $pdo->prepare("UPDATE players 
                                     SET name = :name, losses = losses + 1, last_played = :last_played 
                                     WHERE email = :email");
    }
    $updateStmt->execute([
        'name' => $name,
        'last_played' => $currentDate,
        'email' => $email
    ]);
}

//SQL statement to get the current player's stats (wins and losses)
$stmt = $pdo->prepare("SELECT wins, losses FROM players WHERE email = :email");
$stmt->execute(['email' => $email]);
$userStats = $stmt->fetch();

//SQL query to retrieve the top 10 players, ordered by wins in descending order
$leaderStmt = $pdo->query("SELECT name, wins, losses, last_played 
                           FROM players 
                           ORDER BY wins DESC 
                           LIMIT 10");
$topPlayers = $leaderStmt->fetchAll(PDO::FETCH_ASSOC);
?>
<!DOCTYPE html>
<html>
<head>
    <title>Game Record Saved</title>
    <meta charset="UTF-8">
    <link rel="stylesheet" href="css/wumpus.css">
</head>
<body>
    <div id="container">
        <!--Current player's results-->
        <h2>Your Results:</h2>
        <p><?php echo $userStats['wins']; ?> Wins | <?php echo $userStats['losses']; ?> Losses</p>
        
        <!--Top 10 leaderboard-->
        <h3>Top 10 Leaderboard</h3>
        <table>
            <tr>
                <th>Name</th>
                <th>Last Played</th>
                <th>Wins</th>
                <th>Losses</th>
            </tr>
            <?php foreach ($topPlayers as $player): ?>
                <tr>
                    <td style="padding-bottom: 22px;"><?php echo htmlspecialchars($player['name']); ?></td>
                    <td style="padding-bottom: 22px;"><?php echo $player['last_played']; ?></td>
                    <td style="padding-bottom: 22px;"><?php echo $player['wins']; ?></td>
                    <td style="padding-bottom: 22px;"><?php echo $player['losses']; ?></td>
                </tr>
            <?php endforeach; ?>
        </table>

        <!--Play again-->
        <p><a href="index.php">Play Again</a></p>
    </div>
</body>
</html>
