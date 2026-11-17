-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 11, 2026 at 07:51 AM
-- Server version: 10.4.6-MariaDB
-- PHP Version: 8.3.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `bank_app`
--

-- --------------------------------------------------------

--
-- Table structure for table `accounts`
--

CREATE TABLE `accounts` (
  `id` int(11) NOT NULL,
  `AccountNumber` varchar(50) DEFAULT NULL,
  `PIN` varchar(255) NOT NULL,
  `TotalBalance` decimal(10,2) DEFAULT NULL,
  `status` varchar(20) DEFAULT NULL,
  `is_deleted` tinyint(1) DEFAULT 0,
  `deleted_at` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `accounts`
--

INSERT INTO `accounts` (`id`, `AccountNumber`, `PIN`, `TotalBalance`, `status`, `is_deleted`, `deleted_at`, `created_at`, `updated_at`) VALUES
(1, '12345', '1111', 5664.00, 'active', 0, NULL, '2026-05-06 16:37:01', '2026-05-06 16:37:01'),
(14, 'ACC1762225742', '0000', 670.50, 'active', 0, NULL, '2026-05-06 16:37:01', '2026-05-06 16:54:02'),
(15, 'ACC1762228137', '0000', 450.00, 'active', 0, NULL, '2026-05-06 16:37:01', '2026-05-06 16:37:01'),
(23, 'ACC1775272590', '0000', 320.00, 'active', 0, NULL, '2026-05-06 16:37:01', '2026-05-06 16:37:01'),
(24, 'ACC-10001', '$2y$10$92I', 5000.00, 'active', 0, NULL, '2026-05-06 16:37:01', '2026-05-06 16:37:01'),
(25, 'ACC-10002', '$2y$10$92I', 12500.50, 'active', 1, '2026-05-11 07:49:44', '2026-05-06 16:37:01', '2026-05-11 15:49:44'),
(26, 'ACC-10003', '$2y$10$92I', 750.00, 'inactive', 0, NULL, '2026-05-06 16:37:01', '2026-05-06 16:37:01'),
(27, 'ACC-10001', '$2y$10$92I', 5000.00, 'active', 0, NULL, '2026-05-06 16:37:01', '2026-05-06 16:37:01'),
(28, 'ACC-10002', '$2y$10$92I', 12500.50, 'active', 0, NULL, '2026-05-06 16:37:01', '2026-05-06 16:37:01'),
(29, 'ACC-10003', '$2y$10$92I', 750.00, 'inactive', 0, NULL, '2026-05-06 16:37:01', '2026-05-06 16:37:01'),
(30, 'Fever2432', '$2y$10$kzlV9oM0t8IdBalCbpJZg.pYB6OwLbD9vrBXWDyDC4J8opTNO0yNK', 400.50, 'active', 0, NULL, '2026-05-06 17:01:57', '2026-05-08 11:21:35'),
(31, 'ACC-10001', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 5000.00, 'active', 0, NULL, '2026-05-08 11:05:24', '2026-05-08 11:05:24'),
(32, 'ACC-10002', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 12500.50, 'active', 0, NULL, '2026-05-08 11:05:24', '2026-05-08 11:05:24'),
(33, 'ACC-10003', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 760.00, 'inactive', 0, NULL, '2026-05-08 11:05:24', '2026-05-08 11:11:52');

-- --------------------------------------------------------

--
-- Table structure for table `account_holders`
--

CREATE TABLE `account_holders` (
  `id` int(11) NOT NULL,
  `account_id` int(11) NOT NULL,
  `full_name` varchar(150) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `account_holders`
--

INSERT INTO `account_holders` (`id`, `account_id`, `full_name`, `email`, `phone`, `address`, `created_at`) VALUES
(1, 30, 'Kool kids klan', 'koolkids43@gmail.com', '09532782958', 'Quezon city', '2026-05-08 11:13:28');

-- --------------------------------------------------------

--
-- Table structure for table `audit_trail`
--

CREATE TABLE `audit_trail` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `username` varchar(100) DEFAULT 'system',
  `action` varchar(50) NOT NULL,
  `table_name` varchar(100) DEFAULT NULL,
  `record_id` int(11) DEFAULT NULL,
  `old_value` text DEFAULT NULL,
  `new_value` text DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `audit_trail`
--

INSERT INTO `audit_trail` (`id`, `user_id`, `username`, `action`, `table_name`, `record_id`, `old_value`, `new_value`, `ip_address`, `created_at`) VALUES
(1, 1, 'admin', 'LOGIN', '', NULL, NULL, NULL, '127.0.0.1', '2026-05-06 16:13:48'),
(2, 1, 'admin', 'LOGOUT', '', NULL, NULL, NULL, '127.0.0.1', '2026-05-06 16:28:26'),
(3, 1, 'admin', 'LOGIN', '', NULL, NULL, NULL, '127.0.0.1', '2026-05-06 16:28:55'),
(4, 1, 'admin', 'UPDATE', 'accounts', 1, '{\"TotalBalance\":\"5664.00\",\"status\":\"active\"}', '{\"TotalBalance\":5664,\"status\":\"active\"}', '127.0.0.1', '2026-05-06 16:38:11'),
(5, 1, 'admin', 'LOGOUT', '', NULL, NULL, NULL, '127.0.0.1', '2026-05-06 16:38:28'),
(6, 2, 'user1', 'LOGIN', '', NULL, NULL, NULL, '127.0.0.1', '2026-05-06 16:40:01'),
(7, 2, 'user1', 'LOGOUT', '', NULL, NULL, NULL, '127.0.0.1', '2026-05-06 16:40:11'),
(8, 3, 'guest', 'LOGIN', '', NULL, NULL, NULL, '127.0.0.1', '2026-05-06 16:40:36'),
(9, 3, 'guest', 'LOGOUT', '', NULL, NULL, NULL, '127.0.0.1', '2026-05-06 16:41:18'),
(10, 1, 'admin', 'LOGIN', '', NULL, NULL, NULL, '127.0.0.1', '2026-05-06 16:42:15'),
(11, 1, 'admin', 'LOGOUT', '', NULL, NULL, NULL, '127.0.0.1', '2026-05-06 16:51:33'),
(12, 1, 'admin', 'LOGIN', '', NULL, NULL, NULL, '127.0.0.1', '2026-05-06 16:53:03'),
(13, 1, 'admin', 'LOGIN', '', NULL, NULL, NULL, '127.0.0.1', '2026-05-06 16:53:11'),
(14, 1, 'admin', 'UPDATE', 'accounts', 14, '{\"TotalBalance\":\"670.00\",\"status\":\"active\"}', '{\"TotalBalance\":670.5,\"status\":\"active\"}', '127.0.0.1', '2026-05-06 16:54:02'),
(15, 1, 'admin', 'UPDATE', 'accounts', 14, '{\"TotalBalance\":\"670.50\",\"status\":\"active\"}', '{\"TotalBalance\":670.5,\"status\":\"active\"}', '127.0.0.1', '2026-05-06 16:54:02'),
(16, 1, 'admin', 'INSERT', 'accounts', 30, NULL, '{\"AccountNumber\":\"Fever2432\",\"TotalBalance\":200,\"status\":\"active\"}', '127.0.0.1', '2026-05-06 17:01:57'),
(17, 1, 'admin', 'LOGOUT', '', NULL, NULL, NULL, '127.0.0.1', '2026-05-06 17:05:51'),
(18, 1, 'admin', 'LOGIN', '', NULL, NULL, NULL, '127.0.0.1', '2026-05-06 17:12:10'),
(19, 1, 'admin', 'LOGIN', '', NULL, NULL, NULL, '127.0.0.1', '2026-05-07 07:27:00'),
(20, 1, 'admin', 'UPDATE', 'accounts', 30, '{\"TotalBalance\":\"200.00\",\"status\":\"active\"}', '{\"TotalBalance\":210.5,\"status\":\"active\"}', '127.0.0.1', '2026-05-07 07:27:26'),
(21, 1, 'admin', 'LOGIN', '', NULL, NULL, NULL, '127.0.0.1', '2026-05-07 14:41:22'),
(22, 1, 'admin', 'LOGIN', '', NULL, NULL, NULL, '127.0.0.1', '2026-05-08 08:35:21'),
(23, 1, 'admin', 'LOGOUT', '', NULL, NULL, NULL, '127.0.0.1', '2026-05-08 08:36:27'),
(24, 2, 'user1', 'LOGIN', '', NULL, NULL, NULL, '127.0.0.1', '2026-05-08 08:36:57'),
(25, 2, 'user1', 'LOGOUT', '', NULL, NULL, NULL, '127.0.0.1', '2026-05-08 08:37:46'),
(26, 3, 'guest', 'LOGIN', '', NULL, NULL, NULL, '127.0.0.1', '2026-05-08 08:37:59'),
(27, 3, 'guest', 'LOGOUT', '', NULL, NULL, NULL, '127.0.0.1', '2026-05-08 08:39:26'),
(28, 1, 'admin', 'LOGIN', '', NULL, NULL, NULL, '127.0.0.1', '2026-05-08 08:39:38'),
(29, 1, 'admin', 'EXPORT_CSV', 'accounts', NULL, NULL, NULL, '127.0.0.1', '2026-05-08 11:07:15'),
(30, 1, 'admin', 'CHANGE_PASSWORD', 'users', 1, NULL, NULL, '127.0.0.1', '2026-05-08 11:08:42'),
(31, 1, 'admin', 'LOGOUT', '', NULL, NULL, NULL, '127.0.0.1', '2026-05-08 11:08:54'),
(32, 1, 'admin', 'LOGIN', '', NULL, NULL, NULL, '127.0.0.1', '2026-05-08 11:09:31'),
(33, 1, 'admin', 'TRANSACTION', 'transactions', 1, '{\"balance\":\"750.00\"}', '{\"type\":\"deposit\",\"amount\":10,\"balance\":760}', '127.0.0.1', '2026-05-08 11:11:52'),
(34, 1, 'admin', 'SAVE_HOLDER', 'account_holders', 30, NULL, '{\"full_name\":\"Kool\"}', '127.0.0.1', '2026-05-08 11:13:28'),
(35, 1, 'admin', 'SAVE_HOLDER', 'account_holders', 30, NULL, '{\"full_name\":\"Kool\"}', '127.0.0.1', '2026-05-08 11:13:46'),
(36, 1, 'admin', 'UPDATE', 'accounts', 30, '{\"TotalBalance\":\"210.50\",\"status\":\"active\"}', '{\"TotalBalance\":210.5,\"status\":\"active\"}', '127.0.0.1', '2026-05-08 11:13:55'),
(37, 1, 'admin', 'SAVE_HOLDER', 'account_holders', 30, NULL, '{\"full_name\":\"Kool kids klan\"}', '127.0.0.1', '2026-05-08 11:14:32'),
(38, 1, 'admin', 'TRANSACTION', 'transactions', 2, '{\"balance\":\"210.50\"}', '{\"type\":\"deposit\",\"amount\":100,\"balance\":310.5}', '127.0.0.1', '2026-05-08 11:15:05'),
(39, 1, 'admin', 'UPDATE', 'accounts', 30, '{\"TotalBalance\":\"310.50\",\"status\":\"active\"}', '{\"TotalBalance\":510.5,\"status\":\"active\"}', '127.0.0.1', '2026-05-08 11:15:55'),
(40, 1, 'admin', 'TRANSACTION', 'transactions', 3, '{\"balance\":\"510.50\"}', '{\"type\":\"withdrawal\",\"amount\":100,\"balance\":410.5}', '127.0.0.1', '2026-05-08 11:16:29'),
(41, 1, 'admin', 'TRANSACTION', 'transactions', 4, '{\"balance\":\"410.50\"}', '{\"type\":\"transfer\",\"amount\":10,\"balance\":400.5}', '127.0.0.1', '2026-05-08 11:21:35'),
(42, 1, 'admin', 'LOGOUT', '', NULL, NULL, NULL, '127.0.0.1', '2026-05-08 11:28:28'),
(43, 3, 'guest', 'LOGIN', '', NULL, NULL, NULL, '127.0.0.1', '2026-05-08 11:29:18'),
(44, 3, 'guest', 'LOGOUT', '', NULL, NULL, NULL, '127.0.0.1', '2026-05-08 11:30:03'),
(45, 2, 'user1', 'LOGIN', '', NULL, NULL, NULL, '127.0.0.1', '2026-05-08 11:30:52'),
(46, 2, 'user1', 'LOGOUT', '', NULL, NULL, NULL, '127.0.0.1', '2026-05-08 11:35:10'),
(47, 1, 'admin', 'LOGIN', '', NULL, NULL, NULL, '127.0.0.1', '2026-05-08 11:35:29'),
(48, 1, 'admin', 'LOGIN', '', NULL, NULL, NULL, '127.0.0.1', '2026-05-08 14:10:42'),
(49, 1, 'admin', 'LOGIN', '', NULL, NULL, NULL, '127.0.0.1', '2026-05-08 15:32:23'),
(50, 1, 'admin', 'LOGIN', '', NULL, NULL, NULL, '127.0.0.1', '2026-05-08 17:59:54'),
(51, 1, 'admin', 'LOGIN', '', NULL, NULL, NULL, '127.0.0.1', '2026-05-11 15:42:01'),
(52, 1, 'admin', 'LOGOUT', '', NULL, NULL, NULL, '127.0.0.1', '2026-05-11 15:44:48'),
(53, 2, 'user1', 'LOGIN', '', NULL, NULL, NULL, '127.0.0.1', '2026-05-11 15:45:22'),
(54, 2, 'user1', 'LOGOUT', '', NULL, NULL, NULL, '127.0.0.1', '2026-05-11 15:45:39'),
(55, 1, 'admin', 'LOGIN', '', NULL, NULL, NULL, '127.0.0.1', '2026-05-11 15:45:59'),
(56, 1, 'admin', 'LOGOUT', '', NULL, NULL, NULL, '127.0.0.1', '2026-05-11 15:46:54'),
(57, 3, 'guest', 'LOGIN', '', NULL, NULL, NULL, '127.0.0.1', '2026-05-11 15:47:09'),
(58, 3, 'guest', 'LOGOUT', '', NULL, NULL, NULL, '127.0.0.1', '2026-05-11 15:48:06'),
(59, 2, 'user1', 'LOGIN', '', NULL, NULL, NULL, '127.0.0.1', '2026-05-11 15:48:26'),
(60, 2, 'user1', 'LOGOUT', '', NULL, NULL, NULL, '127.0.0.1', '2026-05-11 15:48:49'),
(61, 1, 'admin', 'LOGIN', '', NULL, NULL, NULL, '127.0.0.1', '2026-05-11 15:49:32'),
(62, 1, 'admin', 'SOFT_DELETE', 'accounts', 25, '{\"AccountNumber\":\"ACC-10002\",\"TotalBalance\":\"12500.50\",\"status\":\"active\"}', '{\"is_deleted\":1}', '127.0.0.1', '2026-05-11 15:49:44'),
(63, 1, 'admin', 'LOGOUT', '', NULL, NULL, NULL, '127.0.0.1', '2026-05-11 15:50:43'),
(64, 2, 'user1', 'LOGIN', '', NULL, NULL, NULL, '127.0.0.1', '2026-05-11 15:50:58'),
(65, 2, 'user1', 'LOGOUT', '', NULL, NULL, NULL, '127.0.0.1', '2026-05-11 15:51:02'),
(66, 3, 'guest', 'LOGIN', '', NULL, NULL, NULL, '127.0.0.1', '2026-05-11 15:51:13');

-- --------------------------------------------------------

--
-- Table structure for table `login_attempts`
--

CREATE TABLE `login_attempts` (
  `id` int(11) NOT NULL,
  `username` varchar(100) DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `success` tinyint(1) DEFAULT 0,
  `attempted_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `login_attempts`
--

INSERT INTO `login_attempts` (`id`, `username`, `ip_address`, `success`, `attempted_at`) VALUES
(1, 'admin', '127.0.0.1', 1, '2026-05-08 11:09:31'),
(2, 'guest', '127.0.0.1', 0, '2026-05-08 11:28:41'),
(3, 'guest', '127.0.0.1', 0, '2026-05-08 11:29:05'),
(4, 'guest', '127.0.0.1', 1, '2026-05-08 11:29:18'),
(5, 'user', '127.0.0.1', 0, '2026-05-08 11:30:28'),
(6, 'user1', '127.0.0.1', 1, '2026-05-08 11:30:52'),
(7, 'admin', '127.0.0.1', 1, '2026-05-08 11:35:29'),
(8, 'admin', '127.0.0.1', 1, '2026-05-08 14:10:42'),
(9, 'admin', '127.0.0.1', 1, '2026-05-08 15:32:23'),
(10, 'admin', '127.0.0.1', 1, '2026-05-08 17:59:54'),
(11, 'admin', '127.0.0.1', 1, '2026-05-11 15:42:01'),
(12, 'user1', '127.0.0.1', 1, '2026-05-11 15:45:22'),
(13, 'admin', '127.0.0.1', 1, '2026-05-11 15:45:59'),
(14, 'guest', '127.0.0.1', 1, '2026-05-11 15:47:09'),
(15, 'user1', '127.0.0.1', 1, '2026-05-11 15:48:26'),
(16, 'admin', '127.0.0.1', 0, '2026-05-11 15:49:06'),
(17, 'admin', '127.0.0.1', 1, '2026-05-11 15:49:32'),
(18, 'user1', '127.0.0.1', 1, '2026-05-11 15:50:58'),
(19, 'guest', '127.0.0.1', 1, '2026-05-11 15:51:13');

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `token` varchar(255) NOT NULL,
  `expires_at` datetime NOT NULL,
  `used` tinyint(1) DEFAULT 0,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `transactions`
--

CREATE TABLE `transactions` (
  `id` int(11) NOT NULL,
  `account_id` int(11) NOT NULL,
  `type` enum('deposit','withdrawal','transfer') NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `transactions`
--

INSERT INTO `transactions` (`id`, `account_id`, `type`, `amount`, `description`, `created_at`) VALUES
(1, 33, 'deposit', 10.00, 'It\'s for my duty', '2026-05-08 11:11:52'),
(2, 30, 'deposit', 100.00, 'For white power', '2026-05-08 11:15:05'),
(3, 30, 'withdrawal', 100.00, 'For my needs', '2026-05-08 11:16:29'),
(4, 30, 'transfer', 10.00, 'For my test', '2026-05-08 11:21:35');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','user','guest') DEFAULT 'guest',
  `created_at` datetime DEFAULT current_timestamp(),
  `is_locked` tinyint(1) DEFAULT 0,
  `locked_until` datetime DEFAULT NULL,
  `failed_attempts` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `role`, `created_at`, `is_locked`, `locked_until`, `failed_attempts`) VALUES
(1, 'admin', '$2y$10$AHHzd7FzryJL0o3/Z52jY.uDq/OF6hT6COOUF9YUu1uCbdjJ5Ecf2', 'admin', '2026-05-06 16:05:35', 0, NULL, 0),
(2, 'user1', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user', '2026-05-06 16:05:35', 0, NULL, 0),
(3, 'guest', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'guest', '2026-05-06 16:05:35', 0, NULL, 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `accounts`
--
ALTER TABLE `accounts`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `account_holders`
--
ALTER TABLE `account_holders`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `account_id` (`account_id`);

--
-- Indexes for table `audit_trail`
--
ALTER TABLE `audit_trail`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `login_attempts`
--
ALTER TABLE `login_attempts`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `account_id` (`account_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `accounts`
--
ALTER TABLE `accounts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT for table `account_holders`
--
ALTER TABLE `account_holders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `audit_trail`
--
ALTER TABLE `audit_trail`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=67;

--
-- AUTO_INCREMENT for table `login_attempts`
--
ALTER TABLE `login_attempts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `transactions`
--
ALTER TABLE `transactions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `account_holders`
--
ALTER TABLE `account_holders`
  ADD CONSTRAINT `account_holders_ibfk_1` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `audit_trail`
--
ALTER TABLE `audit_trail`
  ADD CONSTRAINT `audit_trail_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD CONSTRAINT `password_reset_tokens_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `transactions`
--
ALTER TABLE `transactions`
  ADD CONSTRAINT `transactions_ibfk_1` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
