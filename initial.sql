-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: bpitdas
-- ------------------------------------------------------
-- Server version	8.0.42

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `blacklisted_tokens`
--

DROP TABLE IF EXISTS `blacklisted_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `blacklisted_tokens` (
  `id` int NOT NULL AUTO_INCREMENT,
  `token` text NOT NULL,
  `expires_at` timestamp NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `blacklisted_tokens`
--

LOCK TABLES `blacklisted_tokens` WRITE;
/*!40000 ALTER TABLE `blacklisted_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `blacklisted_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `current_values`
--

DROP TABLE IF EXISTS `current_values`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `current_values` (
  `id` int NOT NULL AUTO_INCREMENT,
  `current_value` decimal(10,5) DEFAULT NULL,
  `datetime` datetime DEFAULT NULL,
  `timebase_id` int DEFAULT NULL,
  `parameter_id` int DEFAULT '0',
  `vc_id` int DEFAULT '0',
  `tcp_id` int DEFAULT '0',
  `serial_id` int DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `current_values`
--

LOCK TABLES `current_values` WRITE;
/*!40000 ALTER TABLE `current_values` DISABLE KEYS */;
/*!40000 ALTER TABLE `current_values` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `data_t1`
--

DROP TABLE IF EXISTS `data_t1`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `data_t1` (
  `datetime` datetime NOT NULL,
  PRIMARY KEY (`datetime`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `data_t1`
--

LOCK TABLES `data_t1` WRITE;
/*!40000 ALTER TABLE `data_t1` DISABLE KEYS */;
INSERT INTO `data_t1` VALUES ('2025-05-25 18:59:00');
/*!40000 ALTER TABLE `data_t1` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `data_t10`
--

DROP TABLE IF EXISTS `data_t10`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `data_t10` (
  `datetime` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `data_t10`
--

LOCK TABLES `data_t10` WRITE;
/*!40000 ALTER TABLE `data_t10` DISABLE KEYS */;
/*!40000 ALTER TABLE `data_t10` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `data_t1440`
--

DROP TABLE IF EXISTS `data_t1440`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `data_t1440` (
  `datetime` datetime NOT NULL,
  PRIMARY KEY (`datetime`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `data_t1440`
--

LOCK TABLES `data_t1440` WRITE;
/*!40000 ALTER TABLE `data_t1440` DISABLE KEYS */;
/*!40000 ALTER TABLE `data_t1440` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `data_t15`
--

DROP TABLE IF EXISTS `data_t15`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `data_t15` (
  `datetime` datetime NOT NULL,
  PRIMARY KEY (`datetime`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `data_t15`
--

LOCK TABLES `data_t15` WRITE;
/*!40000 ALTER TABLE `data_t15` DISABLE KEYS */;
/*!40000 ALTER TABLE `data_t15` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `data_t20`
--

DROP TABLE IF EXISTS `data_t20`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `data_t20` (
  `datetime` datetime NOT NULL,
  PRIMARY KEY (`datetime`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `data_t20`
--

LOCK TABLES `data_t20` WRITE;
/*!40000 ALTER TABLE `data_t20` DISABLE KEYS */;
/*!40000 ALTER TABLE `data_t20` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `data_t240`
--

DROP TABLE IF EXISTS `data_t240`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `data_t240` (
  `datetime` datetime NOT NULL,
  PRIMARY KEY (`datetime`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `data_t240`
--

LOCK TABLES `data_t240` WRITE;
/*!40000 ALTER TABLE `data_t240` DISABLE KEYS */;
/*!40000 ALTER TABLE `data_t240` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `data_t3`
--

DROP TABLE IF EXISTS `data_t3`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `data_t3` (
  `datetime` datetime NOT NULL,
  PRIMARY KEY (`datetime`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `data_t3`
--

LOCK TABLES `data_t3` WRITE;
/*!40000 ALTER TABLE `data_t3` DISABLE KEYS */;
/*!40000 ALTER TABLE `data_t3` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `data_t30`
--

DROP TABLE IF EXISTS `data_t30`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `data_t30` (
  `datetime` datetime NOT NULL,
  PRIMARY KEY (`datetime`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `data_t30`
--

LOCK TABLES `data_t30` WRITE;
/*!40000 ALTER TABLE `data_t30` DISABLE KEYS */;
/*!40000 ALTER TABLE `data_t30` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `data_t480`
--

DROP TABLE IF EXISTS `data_t480`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `data_t480` (
  `datetime` datetime NOT NULL,
  PRIMARY KEY (`datetime`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `data_t480`
--

LOCK TABLES `data_t480` WRITE;
/*!40000 ALTER TABLE `data_t480` DISABLE KEYS */;
/*!40000 ALTER TABLE `data_t480` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `data_t5`
--

DROP TABLE IF EXISTS `data_t5`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `data_t5` (
  `datetime` datetime NOT NULL,
  PRIMARY KEY (`datetime`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `data_t5`
--

LOCK TABLES `data_t5` WRITE;
/*!40000 ALTER TABLE `data_t5` DISABLE KEYS */;
/*!40000 ALTER TABLE `data_t5` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `data_t60`
--

DROP TABLE IF EXISTS `data_t60`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `data_t60` (
  `datetime` datetime NOT NULL,
  PRIMARY KEY (`datetime`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `data_t60`
--

LOCK TABLES `data_t60` WRITE;
/*!40000 ALTER TABLE `data_t60` DISABLE KEYS */;
/*!40000 ALTER TABLE `data_t60` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `data_t720`
--

DROP TABLE IF EXISTS `data_t720`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `data_t720` (
  `datetime` datetime NOT NULL,
  PRIMARY KEY (`datetime`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `data_t720`
--

LOCK TABLES `data_t720` WRITE;
/*!40000 ALTER TABLE `data_t720` DISABLE KEYS */;
/*!40000 ALTER TABLE `data_t720` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `serial_analyzers`
--

DROP TABLE IF EXISTS `serial_analyzers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `serial_analyzers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `device_address` int NOT NULL DEFAULT '1',
  `port_name` varchar(45) NOT NULL DEFAULT 'COM1',
  `mode` varchar(45) NOT NULL DEFAULT 'RTU',
  `sampling` int DEFAULT '80',
  `ascii_command` varchar(45) DEFAULT NULL,
  `baud_rate` int DEFAULT '9600',
  `parity` varchar(45) DEFAULT 'none',
  `data_bits` int DEFAULT '8',
  `stop_bits` int DEFAULT '1',
  `flow_control` varchar(45) DEFAULT 'none',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `serial_analyzers`
--

LOCK TABLES `serial_analyzers` WRITE;
/*!40000 ALTER TABLE `serial_analyzers` DISABLE KEYS */;
/*!40000 ALTER TABLE `serial_analyzers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `serial_parameters`
--

DROP TABLE IF EXISTS `serial_parameters`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `serial_parameters` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  `unit` varchar(45) DEFAULT NULL,
  `enable` tinyint(1) DEFAULT '0',
  `ascii_command` varchar(45) DEFAULT NULL,
  `request_interval` int DEFAULT '5',
  `format` varchar(45) DEFAULT '16-bit',
  `function_code` varchar(45) DEFAULT '0x03 Read Holding Register',
  `start_register_address` int DEFAULT '0',
  `register_count` int DEFAULT '1',
  `formula` varchar(45) DEFAULT 'x*1',
  `analyzer_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_serial_analyzer_idx` (`analyzer_id`),
  CONSTRAINT `fk_serial_analyzer` FOREIGN KEY (`analyzer_id`) REFERENCES `serial_analyzers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `serial_parameters`
--

LOCK TABLES `serial_parameters` WRITE;
/*!40000 ALTER TABLE `serial_parameters` DISABLE KEYS */;
/*!40000 ALTER TABLE `serial_parameters` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `station`
--

DROP TABLE IF EXISTS `station`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `station` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `location` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `station`
--

LOCK TABLES `station` WRITE;
/*!40000 ALTER TABLE `station` DISABLE KEYS */;
INSERT INTO `station` VALUES (1,'Default Name','Default Location');
/*!40000 ALTER TABLE `station` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tcp_analyzers`
--

DROP TABLE IF EXISTS `tcp_analyzers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tcp_analyzers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `host_address` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `port` int NOT NULL,
  `device_address` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `sampling` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=178 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tcp_analyzers`
--

LOCK TABLES `tcp_analyzers` WRITE;
/*!40000 ALTER TABLE `tcp_analyzers` DISABLE KEYS */;
/*!40000 ALTER TABLE `tcp_analyzers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tcp_parameters`
--

DROP TABLE IF EXISTS `tcp_parameters`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tcp_parameters` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  `unit` varchar(45) DEFAULT NULL,
  `enable` tinyint(1) DEFAULT '0',
  `request_interval` varchar(45) DEFAULT '5',
  `format` varchar(45) DEFAULT '16-bit',
  `function_code` varchar(45) DEFAULT '0x03 Read Holding Register',
  `start_register_address` int DEFAULT '0',
  `register_count` int DEFAULT '1',
  `formula` varchar(45) DEFAULT 'x * 1',
  `analyzer_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_tcp_analyzer_id_idx` (`analyzer_id`),
  CONSTRAINT `fk_tcp_analyzer_id` FOREIGN KEY (`analyzer_id`) REFERENCES `tcp_analyzers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tcp_parameters`
--

LOCK TABLES `tcp_parameters` WRITE;
/*!40000 ALTER TABLE `tcp_parameters` DISABLE KEYS */;
/*!40000 ALTER TABLE `tcp_parameters` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `timebases`
--

DROP TABLE IF EXISTS `timebases`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `timebases` (
  `id` int NOT NULL AUTO_INCREMENT,
  `custom` tinyint NOT NULL,
  `enable` tinyint(1) NOT NULL,
  `timebase` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `timebase` (`timebase`)
) ENGINE=InnoDB AUTO_INCREMENT=52 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `timebases`
--

LOCK TABLES `timebases` WRITE;
/*!40000 ALTER TABLE `timebases` DISABLE KEYS */;
INSERT INTO `timebases` VALUES (1,0,1,1),(2,0,1,5),(3,0,1,15),(4,0,1,30),(5,0,1,60),(6,0,1,240),(7,0,1,480),(8,0,1,720),(9,0,1,1440),(46,1,0,3),(47,1,0,20),(50,0,1,10),(51,0,1,0);
/*!40000 ALTER TABLE `timebases` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_login_history`
--

DROP TABLE IF EXISTS `user_login_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_login_history` (
  `id` int NOT NULL,
  `login_time` varchar(45) DEFAULT NULL,
  `success` tinyint DEFAULT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_user_login_histoy_id` FOREIGN KEY (`id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_login_history`
--

LOCK TABLES `user_login_history` WRITE;
/*!40000 ALTER TABLE `user_login_history` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_login_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_logs`
--

DROP TABLE IF EXISTS `user_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_logs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `full_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `datetime` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `tags` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `changes` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_logs`
--

LOCK TABLES `user_logs` WRITE;
/*!40000 ALTER TABLE `user_logs` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_roles`
--

DROP TABLE IF EXISTS `user_roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_roles` (
  `id` smallint NOT NULL,
  `role` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_roles`
--

LOCK TABLES `user_roles` WRITE;
/*!40000 ALTER TABLE `user_roles` DISABLE KEYS */;
INSERT INTO `user_roles` VALUES (1,'admin'),(2,'standard'),(3,'integrator'),(4,'guest');
/*!40000 ALTER TABLE `user_roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(45) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `first_name` varchar(45) NOT NULL,
  `last_name` varchar(45) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `role_id` smallint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username_UNIQUE` (`username`),
  KEY `fk_user_roles_idx` (`role_id`),
  CONSTRAINT `fk_user_roles` FOREIGN KEY (`role_id`) REFERENCES `user_roles` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (11,'guest','','$2b$10$TqpvCRdCGeUPAcJJ7uw2jefcK2SwxhLB8TQkUCDCQNFqBkTUVlGzW','guest','guest','2025-03-30 09:40:21',4),(12,'integrator','','$2b$10$E7OQa8bNCTqG8Y50bNzdRecatuFl8snzWA0Qx3mKYGcAzpCn8x8be','integrator','integrator','2025-03-30 09:40:53',3),(17,'admin','','$2b$10$xZBAs92f2RsNhyn2LtwF7eeqWg1klLBKNEFmygJNhEmSgrbgGV5/W','Kyle','','2025-03-30 09:56:51',1),(22,'standard','','$2b$10$kN2psDOY/LWIGThCJAApQuMmIZ81Js6eyRPvyprvXXLDtS0/5B4nS','standard','','2025-05-25 09:52:25',2);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `virtual_channels`
--

DROP TABLE IF EXISTS `virtual_channels`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `virtual_channels` (
  `id` int NOT NULL AUTO_INCREMENT,
  `enable` tinyint DEFAULT '0',
  `name` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `unit` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `formula` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `a` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `b` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `c` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `x` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `y` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `z` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=107 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `virtual_channels`
--

LOCK TABLES `virtual_channels` WRITE;
/*!40000 ALTER TABLE `virtual_channels` DISABLE KEYS */;
/*!40000 ALTER TABLE `virtual_channels` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-25 18:59:41
