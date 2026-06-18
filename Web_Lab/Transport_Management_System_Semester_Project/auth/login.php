<?php

    include_once('../config/connect_db.php');

    if(isset($_POST['submit'])){
        
        if (!empty($_POST['email']) && !empty($_POST['password'])){
            $email = $_POST['email'];
            $password = $_POST['password'];
            $query = 'SELECT * FROM users WHERE email = ?';
            $statement = $connect->prepare($query);
            $statement->bind_param("s", $email);
            $statement->execute();
            $result = $statement->get_result();

            //Session management
            session_start();
        
            if($result->num_rows > 0){
                $user = $result->fetch_assoc();
                if(password_verify($password, $user['password'])){
                    //userId, username and userType store in session
                    $_SESSION['user_id'] = $user['id'];
                    $_SESSION['username'] = $user['name'];
                    $_SESSION['user_type'] = $user['user_type'];
                    if ($user['user_type'] === 'customer') {
                        header("Location: ../index.php");
                    } elseif ($user['user_type'] === 'owner') {
                        header("Location: ../booking/list-service.php");
                    } else {
                        header("Location: ../index.php"); // Default
                    }
                }
                else{
                    echo "Invalid password";
                }
            }
        }
    }

    

?>


<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <title>Login - TranMS</title>
    <meta content="width=device-width, initial-scale=1.0" name="viewport">
    <link href="../img/favicon.ico" rel="icon">

    <!-- Google Web Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Jost&family=Yeseva+One&family=Dancing+Script&display=swap" rel="stylesheet">

    <!-- Icon Font Stylesheet -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.10.0/css/all.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.13.1/font/bootstrap-icons.min.css">

    <!-- Customized Bootstrap Stylesheet -->
    <link href="../css/bootstrap.min.css" rel="stylesheet">

    <!-- Template Stylesheet -->
    <link href="../css/style.css" rel="stylesheet">
</head>

<body>
<?php
$base_path = '../';
include_once('../includes/navbar.php');
?>
    <div class="container-fluid py-6">
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-lg-5 wow fadeIn" data-wow-delay="0.1s">
                    <div class="bg-light rounded p-5">
                        <div class="text-center mb-4">
                            <h2 class="mb-3">Welcome Back</h2>
                            <p class="mb-0">Please sign in to your account</p>
                        </div>
                        <form action="login.php" method="post">
                            <div class="form-floating mb-3">
                                <input type="email" class="form-control" id="email" name="email" placeholder="name@example.com" required>
                                <label for="email">Email address</label>
                            </div>
                            <div class="form-floating mb-4">
                                <input type="password" class="form-control" id="password" name="password" placeholder="Password" required>
                                <label for="password">Password</label>
                            </div>
                            <button class="btn btn-success text-white w-100 py-3" type="submit" name="submit">Sign In</button>
                            <p class="text-center mt-4 mb-0">Don't have an account? <a href="register.php">Register here</a></p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
<?php include_once('../includes/footer.php'); ?> 