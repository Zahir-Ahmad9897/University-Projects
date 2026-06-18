CREATE DATABASE IF NOT EXISTS smart_university;
USE smart_university;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('student','club_rep','admin') DEFAULT 'student',
    points INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE clubs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    rep_id INT,
    FOREIGN KEY (rep_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE club_members (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    club_id INT NOT NULL,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_membership (student_id, club_id),
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (club_id) REFERENCES clubs(id) ON DELETE CASCADE
);

CREATE TABLE events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    club_id INT,
    event_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    capacity INT NOT NULL DEFAULT 50,
    registered INT DEFAULT 0,
    points_reward INT DEFAULT 10,
    category ENUM('online','physical','hybrid') DEFAULT 'physical',
    meeting_link VARCHAR(255),
    location VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (club_id) REFERENCES clubs(id) ON DELETE SET NULL
);

CREATE TABLE registrations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    event_id INT NOT NULL,
    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_reg (student_id, event_id),
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

CREATE TABLE attendance (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    event_id INT NOT NULL,
    attended_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_att (student_id, event_id),
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

CREATE TABLE rewards (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    points_required INT NOT NULL,
    stock INT DEFAULT 10
);

CREATE TABLE redemptions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    reward_id INT NOT NULL,
    redeemed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES users(id),
    FOREIGN KEY (reward_id) REFERENCES rewards(id)
);

-- Sample Data
INSERT INTO users (name, email, password, role) VALUES
('Admin User', 'admin@uni.edu', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin'),
('Ali Khan', 'ali@student.edu', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student'),
('Sara Ahmed', 'sara@student.edu', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student'),
('Club Rep', 'rep@uni.edu', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'club_rep');

INSERT INTO clubs (name, description, rep_id) VALUES
('Coding Club', 'Programming and software development club', 4),
('Robotics Society', 'Build and program robots', 4),
('Literary Circle', 'Reading, writing and debates', 4);

INSERT INTO events (title, description, club_id, event_date, start_time, end_time, capacity, points_reward, category, meeting_link, location) VALUES
('Web Dev Workshop', 'Learn React and Node.js', 1, DATE_ADD(CURDATE(), INTERVAL 3 DAY), '10:00:00', '12:00:00', 30, 15, 'online', 'https://zoom.us/j/123456', NULL),
('Hackathon 2026', '24-hour coding competition', 1, DATE_ADD(CURDATE(), INTERVAL 7 DAY), '09:00:00', '17:00:00', 50, 30, 'physical', NULL, 'CS Building Hall A'),
('AI Seminar', 'Introduction to Machine Learning', 2, DATE_ADD(CURDATE(), INTERVAL 5 DAY), '14:00:00', '16:00:00', 40, 20, 'hybrid', 'https://meet.google.com/abc', 'Room 301');

INSERT INTO rewards (title, description, points_required, stock) VALUES
('Free Cafeteria Meal', 'One free meal at the university cafeteria', 20, 50),
('University Hoodie', 'Official university branded hoodie', 100, 20),
('Library Book Voucher', 'Voucher for one book from campus store', 50, 30);
