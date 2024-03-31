-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:8889
-- Generation Time: Mar 31, 2024 at 03:37 PM
-- Server version: 5.7.39
-- PHP Version: 7.4.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `socialmedia`
--

-- --------------------------------------------------------

--
-- Table structure for table `comments`
--

CREATE TABLE `comments` (
  `comment_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `post_id` int(11) DEFAULT NULL,
  `comment_date` datetime DEFAULT NULL,
  `comment_content` varchar(255) CHARACTER SET utf8mb4 DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `comments`
--

INSERT INTO `comments` (`comment_id`, `user_id`, `post_id`, `comment_date`, `comment_content`) VALUES
(17, 985102, 25, '2024-03-24 09:39:00', 'wow!!'),
(18, 113636, 25, '2024-03-24 08:08:00', 'Nice!'),
(19, 537257, 26, '2024-03-02 12:09:00', 'Where is it？'),
(20, 852782, 25, '2024-03-26 00:00:00', 'beautiful sky'),
(27, 852782, 25, '2024-03-29 22:36:18', 'good!'),
(31, 852782, 25, '2024-03-29 23:26:53', 'i love!'),
(32, 852782, 26, '2024-03-29 23:28:00', 'Dublin?'),
(33, 537257, 27, '2024-03-29 23:31:04', 'So cute!'),
(34, 705717, 27, '2024-03-29 23:56:39', 'Lovely!'),
(35, 113636, 27, '2024-03-30 20:21:04', 'Border Collie？'),
(36, 113636, 28, '2024-03-30 20:29:10', 'is it Dublin?'),
(39, 456964, 25, '2024-03-30 21:50:26', '🥰🥺'),
(40, 456964, 27, '2024-03-30 21:52:42', '🐕🐶');

-- --------------------------------------------------------

--
-- Table structure for table `follow`
--

CREATE TABLE `follow` (
  `follow_id` int(11) NOT NULL,
  `followers` varchar(100) NOT NULL,
  `following` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `likes`
--

CREATE TABLE `likes` (
  `like_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `post_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `likes`
--

INSERT INTO `likes` (`like_id`, `user_id`, `post_id`) VALUES
(45, 985102, 26),
(46, 985102, 25),
(70, 852782, 25),
(71, 537257, 27),
(72, 705717, 25),
(73, 705717, 26),
(74, 705717, 27),
(92, 113636, 28),
(93, 113636, 25),
(94, 537257, 25);

-- --------------------------------------------------------

--
-- Table structure for table `posts`
--

CREATE TABLE `posts` (
  `post_id` int(11) NOT NULL,
  `user_id` varchar(100) NOT NULL,
  `image_url` varchar(100) NOT NULL,
  `post_date` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `posts`
--

INSERT INTO `posts` (`post_id`, `user_id`, `image_url`, `post_date`) VALUES
(25, '537257', '/uploads/image_1711216794826.jpg', '2024-03-23 20:10:00'),
(26, '113636', '/uploads/image_1711296955896.JPG', '2024-03-24 15:34:00'),
(27, '852782', '/uploads/image_1711747972445.png', '2024-03-29 21:32:52'),
(28, '456964', '/uploads/image_1711830512426.jpg', '2024-03-30 20:28:32');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_name` varchar(100) DEFAULT NULL,
  `user_id` varchar(100) NOT NULL,
  `user_password` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_name`, `user_id`, `user_password`) VALUES
('Marina', '113636', 'bd0fd165a7c50e22ec8d8ddb94c60077175a3f81f52382d2f554b431c26e665c'),
('Sandy', '456964', 'dc3ba31417a97d6681d294682f1f9725a5b7ab5d2e351cd11919ad1e16e51adb'),
('MayFu', '537257', '2a8610aefdd0028c6bf074dd18721c0ef8bc43241cc7a653d7aedf2036bdf6b3'),
('Murphy', '625702', 'd3bf0bc270c59f340b441dbc51f92cfcd9e9e21ad846fb605e49b93d1512e763'),
('John', '705717', '85d778cb8768f51b71a7e8466443356bfd7b7c0f8b4edbb80c92e8f46f711e97'),
('Celine', '852782', 'bf1125cfc1178c7e63d20715f8238bb3102b16a4aa1b96aa4fed797a5bcb320c'),
('JackyChen', '985102', '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`comment_id`);

--
-- Indexes for table `follow`
--
ALTER TABLE `follow`
  ADD PRIMARY KEY (`follow_id`);

--
-- Indexes for table `likes`
--
ALTER TABLE `likes`
  ADD PRIMARY KEY (`like_id`);

--
-- Indexes for table `posts`
--
ALTER TABLE `posts`
  ADD PRIMARY KEY (`post_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `comments`
--
ALTER TABLE `comments`
  MODIFY `comment_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT for table `likes`
--
ALTER TABLE `likes`
  MODIFY `like_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=96;

--
-- AUTO_INCREMENT for table `posts`
--
ALTER TABLE `posts`
  MODIFY `post_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
