# ************************************************************
# Sequel Pro SQL dump
# Version 3408
#
# http://www.sequelpro.com/
# http://code.google.com/p/sequel-pro/
#
# Host: 127.0.0.1 (MySQL 5.1.63)
# Database: users
# Generation Time: 2016-04-25 21:12:36 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table users
# ------------------------------------------------------------
DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(25) DEFAULT NULL UNIQUE,
  `password` varchar(64) DEFAULT NULL,
  `email` varchar(254) DEFAULT NULL UNIQUE,
  `salt` varchar(44) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;

/* Dummy data. 
   Login: user1    Password: a
   Login: user2    Password: a
   Login: user3    Password: a
*/
INSERT INTO `users` (`id`, `username`, `password`, `email`, `salt`)
VALUES
	(1, 'user1', '9ordKrh3iU7231SuS9M3TUexHoLKjiwh2/Ag8s4k2ck=', 'user1@user1.com', 'unacjpzWYupjqbSdQvOfw+rmHcjmwFL9eEuYgGYNn5I='),
	(2, 'user2', '9ordKrh3iU7231SuS9M3TUexHoLKjiwh2/Ag8s4k2ck=', 'user2@user2.com', 'unacjpzWYupjqbSdQvOfw+rmHcjmwFL9eEuYgGYNn5I='),
	(3, 'user3', '9ordKrh3iU7231SuS9M3TUexHoLKjiwh2/Ag8s4k2ck=', 'user3@user3.com', 'unacjpzWYupjqbSdQvOfw+rmHcjmwFL9eEuYgGYNn5I=');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;



/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
