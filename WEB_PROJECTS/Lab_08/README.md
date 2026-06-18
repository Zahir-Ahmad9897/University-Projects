# Lab 08 - PHP & MySQL CRUD Operations

This repository contains the implementation of **Lab 08** for the Web Engineering course. The task involves creating a simple Student/User management system that performs basic **CRUD** (Create, Read, Update, Delete) operations using PHP and MySQL.

## 🚀 Features

- **Database Connection**: Managed via `Connection.php`.
- **Insert (Create)**: Add new user details (Name, Email, Phone, Password, Gender, Address) via `2_Insert.php`.
- **Retrieve (Read)**: Search and view user details by email via `4_Retrieve.php`.
- **Update**: Modify user address by email via `3_Update.php`.
- **Delete**: Remove a user record from the database by email via `5_delete.php`.

## 🛠️ Technology Stack

- **Frontend**: HTML5
- **Backend**: PHP
- **Database**: MySQL (using `mysqli` extension)

## 📋 Prerequisites

1.  **Web Server**: XAMPP, WAMP, or any PHP-supported server.
2.  **Database**: MySQL/MariaDB.

## ⚙️ Setup Instructions

### 1. Database Configuration
Create a database named `student` and a table named `users` using the following SQL script:

```sql
CREATE DATABASE student;
USE student;

CREATE TABLE users (
    id INT(11) AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    password VARCHAR(255) NOT NULL,
    gender ENUM('male', 'female') NOT NULL,
    address TEXT
);
```

### 2. Connection Settings
Ensure `Connection.php` has the correct database credentials:
```php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "student";
```

### 3. How to Run
1.  Copy the project folder to your server's root directory (e.g., `htdocs` for XAMPP).
2.  Start **Apache** and **MySQL** from your control panel.
3.  Access the files in your browser:
    -   `http://localhost/LAB_08/2_Insert.php`
    -   `http://localhost/LAB_08/4_Retrieve.php`
    -   etc.

## 📁 Project Structure

- `Connection.php`: Centralized database connection logic.
- `2_Insert.php`: Registration form and insertion logic.
- `3_Update.php`: Form to update existing records.
- `4_Retrieve.php`: Search functionality to fetch records.
- `5_delete.php`: Functionality to remove records.

---
*Created for University Lab Task - 6th Semester.*
