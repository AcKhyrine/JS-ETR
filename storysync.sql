-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 29, 2023 at 05:20 AM
-- Server version: 10.4.24-MariaDB
-- PHP Version: 8.1.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `storysync`
--

-- --------------------------------------------------------

--
-- Table structure for table `books`
--

CREATE TABLE `books` (
  `id` int(11) NOT NULL,
  `title` text NOT NULL,
  `genre` varchar(200) NOT NULL,
  `publication_date` varchar(100) NOT NULL,
  `author` text NOT NULL,
  `description` text NOT NULL,
  `upload_date` text NOT NULL DEFAULT current_timestamp(),
  `user_id` int(11) NOT NULL,
  `image` text NOT NULL,
  `like` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `books`
--

INSERT INTO `books` (`id`, `title`, `genre`, `publication_date`, `author`, `description`, `upload_date`, `user_id`, `image`, `like`) VALUES
(7, 'The Enigma of Time', 'Science Fiction', '2023-03-15', 'Emily R. Harper', 'In \"The Enigma of Time,\" Emily R. Harper takes readers on a thrilling journey through the realms of quantum physics and parallel universes. As the protagonist, Dr. Amelia Clarke, a brilliant physicist, stumbles upon a mysterious device that challenges the very fabric of time, the story unfolds with mind-bending twists and turns. Harper seamlessly weaves together science and fiction, creating a captivating narrative that explores the consequences of tampering with the fundamental forces of the universe. Prepare to be taken on an intellectual and emotional rollercoaster in this thought-provoking science fiction masterpiece.', '2023-12-29 12:14:25', 6, 'photo-1703823265754.jpg', 0),
(8, 'Celestial Serenade', 'Cosmic Fantasy', '2015-10-31', 'Orion Starlight', 'Embark on a celestial odyssey in \"Celestial Serenade,\" a genre-defying masterpiece by the enigmatic author Orion Starlight. In a universe where galaxies sing, and planets dance to the tune of cosmic energies, Starlight weaves a tapestry of wonder and magic.\r\n\r\nAs the ethereal symphony of the cosmos reaches a crescendo, three unlikely heroes emerge: Luna, a moonlit sorceress with the power to manipulate starlight; Orion, a cosmic bard gifted with the ability to harmonize with planets; and Nebula, a shape-shifting stardust creature seeking its true purpose.\r\n\r\nTogether, they must unravel the celestial mysteries that threaten to plunge the universe into eternal darkness. Guided by the ancient songs of the cosmos, they embark on a spellbinding quest across nebulous realms and interstellar landscapes, encountering celestial beings and unlocking the secrets of the astral melodies that bind the universe.\r\n\r\n\"Celestial Serenade\" is a symphony for the soul, blending elements of fantasy, science fiction, and cosmic mysticism. Orion Starlight invites readers to join the cosmic dance and experience a breathtaking journey that transcends the boundaries of imagination.\r\n\r\nPrepare to be enchanted, as \"Celestial Serenade\" invites you to listen to the echoes of the universe and discover the magic woven into the fabric of space and time.', '2023-12-29 12:17:23', 7, 'photo-1703823443111.jpg', 0);

-- --------------------------------------------------------

--
-- Table structure for table `comment`
--

CREATE TABLE `comment` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `book_id` int(11) NOT NULL,
  `comment` text NOT NULL,
  `date` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `comment`
--

INSERT INTO `comment` (`id`, `user_id`, `book_id`, `comment`, `date`) VALUES
(54, 7, 7, 'An enchanting blend of whimsy and profound themes. \'Celestial Serenade\' explores the mysteries of the universe with poetic grace. I couldn\'t put it down!', '2023-12-29 12:18:16'),
(55, 7, 7, 'A unique fusion of science fiction and fantasy. \'Celestial Serenade\' is not just a book; it\'s a cosmic adventure that challenges the boundaries of the imagination. An absolute must-read!', '2023-12-29 12:18:30'),
(57, 6, 7, 'yasss, so true!', '2023-12-29 12:19:29');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `fullname` varchar(100) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  `image` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `fullname`, `username`, `email`, `password`, `image`) VALUES
(6, 'Ac Khyrine Cersenia', 'Khay', 'ackhyrine@gmail.com', '$argon2id$v=19$m=65536,t=3,p=4$eMLR+mhAzzFC5kVXI42x0w$Dfm4oIuqSqIumLchOPr9cmwcqso9dy8gMl6FAPDO1k0', 'photo-1703823180886.jpg'),
(7, 'Jeffrey Dagdag', 'Jeff', 'jeff@gmail.com', '$argon2id$v=19$m=65536,t=3,p=4$/nSPrgp7XMbXukfTcTVlKw$l2gjES7svknou3mC5Xw4Vk1aX60hgJmfZRH/qDi9HN4', 'photo-1703823325154.jpg');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `books`
--
ALTER TABLE `books`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `comment`
--
ALTER TABLE `comment`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `books`
--
ALTER TABLE `books`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `comment`
--
ALTER TABLE `comment`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=58;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
