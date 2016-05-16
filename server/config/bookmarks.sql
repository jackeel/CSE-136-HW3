# ************************************************************
# Sequel Pro SQL dump
# Version 3408
#
# http://www.sequelpro.com/
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
  `create_date` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `last_visit_date` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `folder_id` int(11) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  INDEX(`folder_id`),
  FOREIGN KEY(`folder_id`)
    REFERENCES `folders`(`id`)
    ON UPDATE CASCADE
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

LOCK TABLES `bookmarks` WRITE;
/*!40000 ALTER TABLE `bookmarks` DISABLE KEYS */;

INSERT INTO `bookmarks` (`id`, `title`, `url`, `folder_id`, description)
VALUES
	(1, 'user1_folder1_bookmark1', 'url1', 1, 'description1'),
	(2, 'user1_folder1_bookmark2', 'url2', 1, 'description2'),
	(3, 'user1_folder2_bookmark1', 'url3', 2, 'description3'),
	(4, 'user2_folder1_bookmark1', 'url4', 4, 'description4'),
	(5, 'user2_folder1_bookmark2', 'url5', 4, 'description5'),
	(6, 'user2_folder2_bookmark1', 'url6', 5, 'description6'),
	(7, 'user3_folder1_bookmark1', 'url7', 6, 'description7');

/*!40000 ALTER TABLE `bookmarks` ENABLE KEYS */;
UNLOCK TABLES;

/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
