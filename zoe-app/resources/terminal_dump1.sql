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
-- Table structure for table `t_doors`
--

DROP TABLE IF EXISTS `t_doors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `t_doors` (
  `door_id` int NOT NULL AUTO_INCREMENT,
  `room_id` int NOT NULL,
  `node_id` int NOT NULL,
  PRIMARY KEY (`door_id`),
  UNIQUE KEY `door_id_UNIQUE` (`door_id`),
  KEY `f_room_id_idx` (`room_id`),
  KEY `f_node_id_idx` (`node_id`),
  CONSTRAINT `f_node_id` FOREIGN KEY (`node_id`) REFERENCES `t_nodes` (`node_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `f_room_id` FOREIGN KEY (`room_id`) REFERENCES `t_rooms` (`room_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t_doors`
--

LOCK TABLES `t_doors` WRITE;
/*!40000 ALTER TABLE `t_doors` DISABLE KEYS */;
/*!40000 ALTER TABLE `t_doors` ENABLE KEYS */;
UNLOCK TABLES;

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
  `cost` int NOT NULL,
  PRIMARY KEY (`edge_id`),
  UNIQUE KEY `edge_id_UNIQUE` (`edge_id`),
  KEY `f_start_node_idx` (`f_start_node`),
  KEY `f_end_node_idx` (`f_end_node`),
  CONSTRAINT `f_end_node` FOREIGN KEY (`f_end_node`) REFERENCES `t_nodes` (`node_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `f_start_node` FOREIGN KEY (`f_start_node`) REFERENCES `t_nodes` (`node_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t_edges`
--

LOCK TABLES `t_edges` WRITE;
/*!40000 ALTER TABLE `t_edges` DISABLE KEYS */;
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
  `name` varchar(45) NOT NULL,
  `description` varchar(256) DEFAULT NULL,
  `event_start` datetime NOT NULL,
  `event_end` datetime NOT NULL,
  `f_room_id` int NOT NULL,
  PRIMARY KEY (`event_id`),
  UNIQUE KEY `idt_eveevent_idnts_UNIQUE` (`event_id`),
  KEY `f_event_room_id_idx` (`f_room_id`),
  CONSTRAINT `f_event_room_id` FOREIGN KEY (`f_room_id`) REFERENCES `t_rooms` (`room_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t_events`
--

LOCK TABLES `t_events` WRITE;
/*!40000 ALTER TABLE `t_events` DISABLE KEYS */;
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
  `name` varchar(5) NOT NULL,
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
  `name` varchar(45) NOT NULL,
  `pos_x` decimal(10,0) NOT NULL,
  `pos_y` decimal(10,0) NOT NULL,
  `f_floor_id` int NOT NULL,
  PRIMARY KEY (`node_id`),
  UNIQUE KEY `node_id_UNIQUE` (`node_id`),
  UNIQUE KEY `name_UNIQUE` (`name`),
  KEY `f_floor_id_idx` (`f_floor_id`),
  KEY `f_node_floor_id_idx` (`f_floor_id`),
  CONSTRAINT `f_node_floor_id` FOREIGN KEY (`f_floor_id`) REFERENCES `t_floors` (`floor_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t_nodes`
--

LOCK TABLES `t_nodes` WRITE;
/*!40000 ALTER TABLE `t_nodes` DISABLE KEYS */;
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
  `name` varchar(20) NOT NULL,
  `f_floor_id` int NOT NULL,
  PRIMARY KEY (`room_id`),
  KEY `f_floor_id_idx` (`f_floor_id`),
  CONSTRAINT `f_floor_id` FOREIGN KEY (`f_floor_id`) REFERENCES `t_floors` (`floor_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t_rooms`
--

LOCK TABLES `t_rooms` WRITE;
/*!40000 ALTER TABLE `t_rooms` DISABLE KEYS */;
INSERT INTO `t_rooms` VALUES (1,'K1001',2),(2,'K1002',2),(3,'K2001',3),(4,'K3001',4),(5,'K4004',5);
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

-- Dump completed on 2025-10-30 14:38:54
