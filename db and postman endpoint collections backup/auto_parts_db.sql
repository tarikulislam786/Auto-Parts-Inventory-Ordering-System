-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 23, 2025 at 08:21 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `auto_parts_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `parts`
--

CREATE TABLE `parts` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `brand` varchar(255) DEFAULT NULL,
  `price` float DEFAULT 0,
  `stock` int(11) DEFAULT 0,
  `category` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `parts`
--

INSERT INTO `parts` (`id`, `name`, `brand`, `price`, `stock`, `category`, `created_at`, `image_url`) VALUES
(1, 'Brake Padi', 'Brembo', 29.99, 250, 'Brakes', '2025-10-17 12:29:20', 'https://res.cloudinary.com/dlwusbpob/image/upload/v1760819808/auto-parts/1760819803932-b2.jpg'),
(2, 'Oil Filter', 'Bosch', 29.99, 250, 'Brakes', '2025-10-17 12:29:20', 'https://res.cloudinary.com/dlwusbpob/image/upload/v1760820944/auto-parts/1760820940139-b5.jpg'),
(3, 'Air Filter', 'K&N', 19, 200, 'Engine', '2025-10-17 12:29:20', 'https://res.cloudinary.com/dlwusbpob/image/upload/v1760822796/auto-parts/1760822793338-b8.jpg'),
(4, 'Spark Plug', 'NGK', 5.5, 500, 'Ignition', '2025-10-17 12:29:20', 'https://res.cloudinary.com/dlwusbpob/image/upload/v1760851020/auto-parts/1760851018792-b10.jpg'),
(6, 'Disc Brake', 'Mandofa', 120, 10, 'Brakes', '2025-10-18 04:20:03', 'https://res.cloudinary.com/dlwusbpob/image/upload/v1760815889/auto-parts/1760815885091-parts.jpg'),
(18, 'Cipron', 'Camerun', 70, 10, 'Engine', '2025-10-18 17:45:16', 'https://res.cloudinary.com/dlwusbpob/image/upload/v1760809517/auto-parts/1760809513321-istockphoto-470745230-612x612.jpg'),
(24, 'Car & Truck Parts ', 'Clavia', 150, 100, 'Brakes', '2025-10-18 20:40:35', 'https://res.cloudinary.com/dlwusbpob/image/upload/v1760820036/auto-parts/1760820032870-b4.jpg'),
(26, 'Brake Caliper Assembly', 'Clavia', 150, 100, 'Brakes', '2025-10-18 20:54:29', 'https://res.cloudinary.com/dlwusbpob/image/upload/v1760820870/auto-parts/1760820867661-b6.jpg'),
(27, ' Brake System', 'Viola 2', 65, 15, 'Brakes', '2025-10-18 21:04:16', 'https://res.cloudinary.com/dlwusbpob/image/upload/v1760821501/auto-parts/1760821497081-96014ef55824433e796ed32604bdc652.jpg'),
(29, 'NAPA Brakes ', 'Birla', 60, 10, 'Brakes', '2025-10-18 21:29:10', 'https://res.cloudinary.com/dlwusbpob/image/upload/v1760822951/auto-parts/1760822948478-b9.jpg'),
(31, 'Genuine Perkins Engine Spark Ignition Lock', 'Perkins', 320, 10, 'Ignition', '2025-10-23 17:57:10', 'https://res.cloudinary.com/dlwusbpob/image/upload/v1761242229/auto-parts/1761242227276-ignition1.png');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `created_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password_hash`, `created_at`) VALUES
(1, 'Admin', 'admin@auto.com', '$2b$10$uNLI07iH/2y0fN.98PY5POLS9oTX9Dg4PwAUnL908AeWNq/MDYJJi', '2025-10-17 12:29:20'),
(2, 'tarik', 'tarik@auto.com', '$2b$10$MQvmp3fMYSzB78HuqSzE5O6SIq1Oiy/06bScfjNU/QiKSj5Uj0gpe', '2025-10-17 12:46:32'),
(3, 'yeamin', 'yeamin@auto.com', '$2b$10$D1.lU6bpKign51GCuJsXMuLoH8/tdHT0CzxvNLe2IdxY6JnEpT.ja', '2025-10-17 12:47:56'),
(4, 'yeamin2', 'yeamin2@auto.com', '$2b$10$CIaDLEwZyIHr/mEdYME6XO3.eyI4IaxpyQMLB5a4RjSS.OReNlHB.', '2025-10-18 05:16:17'),
(5, 'hero', 'hero@auto.com', '$2b$10$296AMKdkYsIgFK5JkKjhDuwRPLPrEsZkmL8YoWzWuLWOFzwK7lVlC', '2025-10-18 07:28:59'),
(6, 'user2', 'user2@auto.com', '$2b$10$nBhiBoKf0rTEritBbe1KEuchXSbgfi8nkHm9UrJ0VhNN6unQjUnzO', '2025-10-18 18:50:59'),
(7, 'user24', 'user24@auto.com', '$2b$10$HGGWSle9pPI0sTLLKRnKDO.yrs1UZnslj/FvubXBvpsUghvKrmq0a', '2025-10-18 19:21:18'),
(8, 'user25', 'user25@auto.com', '$2b$10$4DYxIPBctYY6v8bmq6yqEOeIPAHib3X9zVVSTwwU7fqfwxnUhmH7m', '2025-10-18 20:38:26'),
(9, 'user26', 'user26@auto.com', '$2b$10$ilW78paxaFuTVNF1SLoWReDLhQRADxtJsduivcDcPUogGnDNT0cBq', '2025-10-18 20:52:39'),
(10, 'yeamin22', 'yeamin22@auto.com', '$2b$10$pL9cU8ZgiYuR2dvoaIIIdOEV3Mx769FmSQ9pOzV2uL61IHXpz9Yhe', '2025-10-23 18:10:53');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `parts`
--
ALTER TABLE `parts`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `parts`
--
ALTER TABLE `parts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
