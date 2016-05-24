# ************************************************************
# Sequel Pro SQL dump
# Version 3408
#
# http://http://www.sequelpro.com/
# http://code.google.com/p/sequel-pro/
#
# Host: 127.0.0.1 (MySQL 5.1.63)
# Database: bookmarks
# Generation Time: 2016-04-25 21:12:36 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table bookmarks
# ------------------------------------------------------------

DROP TABLE IF EXISTS `bookmarks`;

CREATE TABLE `bookmarks` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(25) DEFAULT '',
  `url` varchar(2083) DEFAULT '',
  `description` text,
  `star` boolean DEFAULT 0,
  `create_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `last_visit_date` TIMESTAMP DEFAULT 0,
  `folder_id` int(11) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `bookmark_duplicate` (`title`, `folder_id`),
  INDEX(`folder_id`),
  FOREIGN KEY(`folder_id`)
    REFERENCES `folders`(`id`)
    ON UPDATE CASCADE
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


LOCK TABLES `bookmarks` WRITE;
/*!40000 ALTER TABLE `bookmarks` DISABLE KEYS */;

/* Bookmarks inserted into user1 and user 2 accounts */
INSERT INTO `bookmarks` (`id`, `title`, `url`, `folder_id`, `description`)
VALUES
	(1, 'Google', 'http://www.google.com', 1, 'description1'),
	(2, 'Yahoo', 'http://www.yahoo.com', 1, 'description2'),
	(3, 'UCSD', 'http://www.ucsd.edu', 2, 'description3'),
	(4, 'Facebook', 'http://www.facebook.com', 2, 'description4'),
	(5, 'Reddit', 'http://www.reddit.com', 3, 'description5'),
  (6, 'CSE136 Slack', 'http://www.cse136.slack.com', 3, 'description6'),
  (7, 'Piazza', 'http://www.piazza.com', 4, 'description7'),
  (8, 'Github', 'http://www.github.com', 4, 'description8'),
  (9, 'Bing', 'http://www.bing.com', 5, 'description9'),
  (10, 'Amazon', 'http://www.amazon.com', 5, 'description10'),
  (11, 'Google', 'http://www.google.com', 6, 'description1'),
  (12, 'Yahoo', 'http://www.yahoo.com', 6, 'description2'),
  (13, 'UCSD', 'http://www.ucsd.edu', 7, 'description3'),
  (14, 'Facebook', 'http://www.facebook.com', 7, 'description4'),
  (15, 'Reddit', 'http://www.reddit.com', 8, 'description5'),
  (16, 'CSE136 Slack', 'http://www.cse136.slack.com', 8, 'description6'),
  (17, 'Piazza', 'http://www.piazza.com', 9, 'description7'),
  (18, 'Github', 'http://www.github.com', 9, 'description8'),
  (19, 'Bing', 'http://www.bing.com', 10, 'description9'),
  (20, 'Amazon', 'http://www.amazon.com', 10, 'description10');
/*!40000 ALTER TABLE `bookmarks` ENABLE KEYS */;
UNLOCK TABLES;

/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
