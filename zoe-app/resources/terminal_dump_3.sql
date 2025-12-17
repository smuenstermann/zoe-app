CREATE DATABASE  IF NOT EXISTS `terminal` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `terminal`;
-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: localhost    Database: terminal
-- ------------------------------------------------------
-- Server version	8.0.36

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
-- Table structure for table `t_edges`
--

DROP TABLE IF EXISTS `t_edges`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `t_edges` (
  `edge_id` int NOT NULL AUTO_INCREMENT,
  `f_start_node` int NOT NULL,
  `f_end_node` int NOT NULL,
  `weight` int NOT NULL,
  PRIMARY KEY (`edge_id`),
  UNIQUE KEY `edge_id_UNIQUE` (`edge_id`),
  KEY `f_start_node_idx` (`f_start_node`),
  KEY `f_end_node_idx` (`f_end_node`),
  CONSTRAINT `f_end_node` FOREIGN KEY (`f_end_node`) REFERENCES `t_nodes` (`node_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `f_start_node` FOREIGN KEY (`f_start_node`) REFERENCES `t_nodes` (`node_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t_edges`
--

LOCK TABLES `t_edges` WRITE;
/*!40000 ALTER TABLE `t_edges` DISABLE KEYS */;
INSERT INTO `t_edges` VALUES (1,1,2,5),(2,2,1,5);
/*!40000 ALTER TABLE `t_edges` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `t_events`
--

DROP TABLE IF EXISTS `t_events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `t_events` (
  `event_id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(50) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `event_start` datetime NOT NULL,
  `event_end` datetime NOT NULL,
  `f_room_id` int DEFAULT NULL,
  PRIMARY KEY (`event_id`),
  UNIQUE KEY `unique_event_per_room_time` (`title`,`event_start`,`event_end`),
  KEY `idx_event_start` (`event_start`),
  KEY `idx_event_end` (`event_end`),
  KEY `f_room_id_idx` (`f_room_id`),
  CONSTRAINT `f_room_id` FOREIGN KEY (`f_room_id`) REFERENCES `t_rooms` (`room_id`),
  CONSTRAINT `t_events_chk_1` CHECK ((`event_end` > `event_start`))
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t_events`
--

LOCK TABLES `t_events` WRITE;
/*!40000 ALTER TABLE `t_events` DISABLE KEYS */;
INSERT INTO `t_events` VALUES (1,'JA-Versammlung','Versammlung der JAV-AZ und JAV-HVW mit allen Azubis','2025-12-03 08:00:00','2025-12-03 14:00:00',249),(2,'Prüfungsvorbereitung','Vorbereitung der FISI und FIAE auf die AP2 Prüfung','2025-11-11 07:05:00','2025-11-25 15:00:00',225),(3,'Shop Your Job','Ausgeschriebene Jobs für auslernende Azubis werden vorgestellt','2025-10-09 08:00:00','2025-10-09 13:00:00',249),(4,'MoA','Mobiles Arbeiten für die IT Azubis','2025-11-13 07:00:00','2025-11-14 14:47:00',225);
/*!40000 ALTER TABLE `t_events` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `t_floors`
--

DROP TABLE IF EXISTS `t_floors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `t_floors` (
  `floor_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL,
  `map_path` varchar(45) NOT NULL,
  PRIMARY KEY (`floor_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t_floors`
--

LOCK TABLES `t_floors` WRITE;
/*!40000 ALTER TABLE `t_floors` DISABLE KEYS */;
INSERT INTO `t_floors` VALUES (1,'og1','1'),(2,'og2','1'),(3,'og3','1'),(4,'og4','1'),(5,'eg','2');
/*!40000 ALTER TABLE `t_floors` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `t_nodes`
--

DROP TABLE IF EXISTS `t_nodes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `t_nodes` (
  `node_id` int NOT NULL AUTO_INCREMENT,
  `pos_x` decimal(10,0) NOT NULL,
  `pos_y` decimal(10,0) NOT NULL,
  `f_floor_id` int NOT NULL,
  `f_room_id` int DEFAULT NULL,
  PRIMARY KEY (`node_id`),
  UNIQUE KEY `node_id_UNIQUE` (`node_id`),
  KEY `f_floor_id_idx` (`f_floor_id`),
  KEY `f_node_floor_id_idx` (`f_floor_id`),
  CONSTRAINT `f_node_floor_id` FOREIGN KEY (`f_floor_id`) REFERENCES `t_floors` (`floor_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t_nodes`
--

LOCK TABLES `t_nodes` WRITE;
/*!40000 ALTER TABLE `t_nodes` DISABLE KEYS */;
INSERT INTO `t_nodes` VALUES (1,300,350,1,NULL),(2,110,180,1,NULL);
/*!40000 ALTER TABLE `t_nodes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `t_rooms`
--

DROP TABLE IF EXISTS `t_rooms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `t_rooms` (
  `room_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `description` varchar(50) DEFAULT NULL,
  `f_floor_id` int NOT NULL,
  PRIMARY KEY (`room_id`),
  UNIQUE KEY `unique_room_per_floor` (`name`,`f_floor_id`),
  KEY `f_floor_id_idx` (`f_floor_id`),
  CONSTRAINT `f_floor_id` FOREIGN KEY (`f_floor_id`) REFERENCES `t_floors` (`floor_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=280 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t_rooms`
--

LOCK TABLES `t_rooms` WRITE;
/*!40000 ALTER TABLE `t_rooms` DISABLE KEYS */;
INSERT INTO `t_rooms` VALUES (6,'KE001','Foyer',1),(7,'KE002','Lager',1),(8,'KE003','Lager',1),(9,'KE004','Lager',1),(10,'KE005','Diagnose Werkstatt',1),(11,'KE006','Hauptwerkstatt',1),(12,'KE007','Büro',1),(13,'KE008','Büro',1),(14,'KE009','Kopierraum',1),(15,'KE010','Büro',1),(16,'KE011','',1),(17,'KE012','Büro',1),(18,'KE013','Teeküche',1),(19,'KE014','Ausbilderbüro',1),(20,'KE015','Elektromaschinenlager',1),(21,'KE016','Lager',1),(22,'KE017','Werkstattraum 1',1),(23,'KE018','Tiefbauplatz',1),(24,'KE019','Umkleide D',1),(25,'KE020','',1),(26,'KE021','Umkleide H',1),(27,'KE022','Reinigung',1),(28,'LE001','Schienenlagerplatz',1),(29,'LE002','Lager',1),(30,'LE003','Weichenmontageplatz 2',1),(31,'LE004','Weichenmontageplatz 1',1),(32,'LE005','Jochmontageplatz',1),(33,'LE106','Lager',1),(34,'LE007','Gleis 49',1),(35,'LE008','Lager',1),(36,'LE009','Werkstatt',1),(37,'LE101','Lager',1),(38,'LE102','Lager',1),(39,'LE107','1. Hilfe',1),(40,'LE110','Zerspanung',1),(41,'LE111','Blechverarbeitung',1),(42,'LE112','Expansionsfläche',1),(43,'LE113','Strohmabnehmer',1),(44,'LE114','Prüfung',1),(45,'LE115','Lager',1),(46,'LE116','Kompressoren',1),(47,'LE117','Prüfung',1),(48,'LE118','Kupplungsbau',1),(49,'LE119','Reinigung',1),(50,'LE120','',1),(51,'LE121','Lager',1),(52,'LE122','Kabinenfahrzeuge',1),(53,'LE123','Prüfung',1),(54,'LE124','Schweißerei',1),(55,'LE125','Werkzeugausgabe',1),(56,'LE126','Türzylinder',1),(57,'LE127','Gliederdeckenbau',1),(58,'LE128','Fahrersitzbau',1),(59,'KET01','NSHV',1),(60,'KET02','Trafo 3',1),(61,'KET03','Trafo 2',1),(62,'KET04','Trafo 1',1),(63,'KET05','MSHV',1),(64,'KET06','Batterie',1),(65,'KET07','MSR',1),(66,'KET08','Heizung',1),(67,'KET09','Technik',1),(68,'KET10','ELA',1),(69,'KET11','BMA/BOS',1),(70,'KET12','EDV',1),(71,'KET13','USV PC',1),(72,'KET14','Technik',1),(73,'LET02','Medienü.',1),(74,'ELT04','',1),(75,'K1001','Foyer',2),(76,'K1002','Pausenraum',2),(77,'K1003','Werkstattraum 2',2),(78,'K1004','Unterricihtsraum 1',2),(79,'K1005','Unterricihtsraum 2',2),(80,'K1006','Büro',2),(81,'K1007','Büro',2),(82,'K1008','Unterweisung',2),(83,'K1009','Stromschienenlager',2),(84,'K1010','Standardlabor',2),(85,'K1011','Standardlabor',2),(86,'K1012','1. Hilfe',2),(87,'K1013','Lager Modelle',2),(88,'K1014','Lager',2),(89,'K1015','Kopierraum',2),(90,'K1016','Lager',2),(91,'K1017','Lager',2),(92,'K1018','Umkleide H',2),(93,'K1020','Umkleide D',2),(94,'L1002','Lager',2),(95,'L1004','Umkleide D',2),(96,'L1008','Umkleide H',2),(97,'L1011','Küche',2),(98,'L1012','Archiv',2),(99,'L1013','Besprechung',2),(100,'L1014','Büro',2),(101,'L1015','Büro',2),(102,'L1016','Büro',2),(103,'L1017','Büro',2),(104,'L1018','Wertefächer',2),(105,'L1019','Küche',2),(106,'L1020','Pausenraum',2),(107,'L1021','Lager',2),(108,'LE1023','Prüfraum',2),(109,'LE1024','ELT Werkstatt',2),(110,'LE1025','Lager',2),(111,'LE1026','Lager',2),(112,'LE1027','Prüfraum',2),(113,'LE1028','Pneumatik',2),(114,'LE1029','Reinigung',2),(115,'LE1030','Schleif.',2),(116,'LE1031','Brücke',2),(117,'K1T01','ELT UV',2),(118,'K1T02','IT',2),(119,'L1T01','Technik',2),(120,'L1T02','Technik',2),(121,'L1T04','ELT UV',2),(122,'K2001','Foyer',3),(123,'K2002','Pausenraum',3),(124,'K2003','Standardlabor',3),(125,'K2004','Büro',3),(126,'K2005','Mehrzweck.',3),(127,'K2006','Standardlabor',3),(128,'K2007','Umkleide D',3),(129,'K2008','Büro',3),(130,'K2009','Standardlabor',3),(131,'K2010','Standardlabor',3),(132,'K2011','Büro',3),(133,'K2012','Umkleide H',3),(134,'K2013','Standardlabor',3),(135,'K2014','Büro',3),(136,'K2015','Mehrzweck.',3),(137,'K2016','Standardlabor',3),(138,'K2017','Büro',3),(139,'K2018','Büro',3),(140,'K2019','Besprechung',3),(141,'K2020','Umkleide H',3),(142,'K2021','WC',3),(143,'K2022','Umkleide D',3),(144,'K2023','WC',3),(145,'K2024','Büro',3),(146,'K2025','Büro',3),(147,'K2026','Büro',3),(148,'K2027','Büro',3),(149,'K2028','Büro',3),(150,'K2029','Standardlabor',3),(151,'K2030','Büro',3),(152,'K2031','Mehrzweck.',3),(153,'K2032','Standardlabor',3),(154,'K2033','Büro',3),(155,'K2034','Verwaltung',3),(156,'K2035','Büro',3),(157,'K2038','Prüfraum',3),(158,'K2039','Büro',3),(159,'K2040','Mehrzweck.',3),(160,'K2041','Projektraum',3),(161,'K2042','Lager',3),(162,'K2043','Medienserver',3),(163,'K2044','Pausenraum',3),(164,'K2045','Server',3),(165,'K2046','Lakierraum',3),(166,'K2047','Ätzraum',3),(167,'K2048','Standardlabor',3),(168,'K2049','Projektraum',3),(169,'K2050','Standardlabor',3),(170,'K2051','Lager',3),(171,'K2052','Putzmittel',3),(172,'K2053','Büro',3),(173,'K2054','Büro',3),(174,'K2055','Mehrzweck.',3),(175,'K2056','Putzmittel',3),(176,'K2057','Kopierraum',3),(177,'K2T01','ELT UV',3),(178,'K2T02','IT',3),(179,'K2T03','ELT UV',3),(180,'K2T04','IT',3),(181,'K2T05','bei Treppe?',3),(182,'K2T06','Technik',3),(183,'K2T07','Technik',3),(184,'K2T08','ELT UV',3),(185,'K2T09','IT',3),(186,'K2T10','IT',3),(187,'K2T11','ELT UV',3),(188,'K3001','Foyer',4),(189,'K3002','Pausenraum',4),(190,'K3003','Standardlabor',4),(191,'K3004','Büro',4),(192,'K3005','Mehrzweck.',4),(193,'K3006','Standardlabor',4),(194,'K3007','Umkleide D',4),(195,'K3008','Werkstoffbereitung',4),(196,'K3009','Werkstoffbereitung',4),(197,'K3010','Umkleide H',4),(198,'K3011','Schweißerei',4),(199,'K3012','Prüflabor Schweißerei',4),(200,'K3013','AB Schweißerei',4),(201,'K3018','Umkleide H',4),(202,'K3021','Mehrzweck.',4),(203,'K3022','Mehrzweck.',4),(204,'K3023','Equipment',4),(205,'K3024','Mehrzweck.',4),(206,'K3025','Standardlabor',4),(207,'K3026','Büro',4),(208,'K3027','Mehrzweck.',4),(209,'K3028','Standardlabor',4),(210,'K3029','Unterricht',4),(211,'K3030','Büro',4),(212,'K3031','Büro',4),(213,'K3032','Equipment',4),(214,'K3033','Equipment',4),(215,'K3034','Kunststoffaufbereitung',4),(216,'K3036','AB KB',4),(217,'K3037','Unterricht',4),(218,'K3038','Pausenraum',4),(219,'K3039','Standardlabor',4),(220,'K3040','Büro',4),(221,'K3041','Mehrzweck.',4),(222,'K3042','Standardlabor',4),(223,'K3043','Mehrzweck.',4),(224,'K3044','Putzmittel',4),(225,'K3045','Seminarraum 2',4),(226,'K3046','Seminarraum 2',4),(227,'K3047','Putzmittel',4),(228,'K3048','Kopierraum',4),(229,'K3T01','ELT UV',4),(230,'K3T02','IT',4),(231,'K3T03','ELT UV',4),(232,'K3T04','IT',4),(233,'K3T05','bei Treppe?',4),(234,'K3T06','Technik',4),(235,'K3T07','Technik',4),(236,'K3T08','ELT UV',4),(237,'K3T09','IT',4),(238,'K3T10','IT',4),(239,'K3T11','ELT UV',4),(240,'K4001','Foyer',5),(241,'K4002','Pausenraum',5),(242,'K4003','Labor',5),(243,'K4004','Metalllager',5),(244,'K4005','Grundlehrgang',5),(245,'K4006','Umkleide D',5),(246,'K4007','Fachabteilung',5),(247,'K4008','Umkleide H',5),(248,'K4009','Fachabteilung',5),(249,'K4010','Seminarraum 1',5),(250,'K4011','Seminarraum 1',5),(251,'K4012','Lager',5),(252,'K4013','Lager',5),(253,'K4014','Werkstatt',5),(254,'K4015','Lehrgang',5),(255,'K4016','Seminarraum 1',5),(256,'K4017','Pausenraum',5),(257,'K4018','Werkstatt',5),(258,'K4019','Lehrgang',5),(259,'K4020','PC-Raum',5),(260,'K4021','PC-Raum',5),(261,'K4022','Werkstatt',5),(262,'K4023','Lehrgang',5),(263,'K4024','Putzmittel',5),(264,'K4025','Büro',5),(265,'K4026','Besprechung',5),(266,'K4027','Besprechung',5),(267,'K4028','Putzmittel',5),(268,'K4029','Kopierraum',5),(269,'K4T01','ELT UV',5),(270,'K4T02','IT',5),(271,'K4T03','ELT UV',5),(272,'K4T04','IT',5),(273,'K4T05','Technik',5),(274,'K4T06','Technik',5),(275,'K4T07','Technik',5),(276,'K4T08','ELT UV',5),(277,'K4T09','IT',5),(278,'K4T10','IT',5),(279,'K4T11','ELT UV',5);
/*!40000 ALTER TABLE `t_rooms` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-12-10  9:39:04
