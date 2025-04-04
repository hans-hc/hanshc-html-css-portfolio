DROP TABLE IF EXISTS `players`;
DROP TABLE IF EXISTS `wumpuses`;


CREATE TABLE IF NOT EXISTS `players` (
  `email` VARCHAR(255) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `wins` INT DEFAULT 0,
  `losses` INT DEFAULT 0,
  `last_played` DATETIME DEFAULT NULL,
  PRIMARY KEY (`email`)
) 


INSERT INTO `players` (email, name, wins, losses, last_played) VALUES
('John@example.com',    'John',   4, 3, '2025-03-25 11:12:43'),
('Johnathan@example.com',      'Johnathan',     8, 3, '2025-03-26 11:15:53'),
('Johnny@example.com',  'Johnny', 8, 1, '2025-03-27 04:23:12'),
('Bob@example.com',    'Bob',   3, 3, '2025-03-27 05:42:15'),
('Bobby@example.com',      'Bobby',     2, 4, '2025-03-28 20:23:55'),
('Bobber@example.com',    'Bobber',   1, 1, '2025-03-28 12:53:34')



CREATE TABLE IF NOT EXISTS `wumpuses` (
  `row` INT NOT NULL,
  `col` INT NOT NULL,
  PRIMARY KEY (`row`, `col`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


INSERT INTO `wumpuses` (`row`, `col`) VALUES
(4, 4),   
(1, 5),
(1, 3),
(2, 6),
(2, 7),
(3, 1),
(4, 7),
(6, 6),
(7, 2);

