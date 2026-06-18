<?php 
    require_once("../config/connect_db.php");

    require '../vendor/autoload.php';
    use Ramsey\Uuid\Uuid;

    // $my_new_uuid = Uuid::uuid4()->toString();   
    // use App\Controllers\authController;

    if(isset($_POST['submit'])){
        $name = $_POST['name'];
        $email = $_POST['email'];
        $usertype = $_POST['usertype'];
        $password = $_POST['password'];
        $my_new_uuid = Uuid::uuid4()->toString();
        echo $name . " " . $email . " " . $usertype . " " . $password . " " . $my_new_uuid;

        $query = 'INSERT INTO users (id, name, email, password, user_type) VALUES (?, ?, ?, ?, ?)';  
        
        $statement = $connect->prepare($query);
        
        // Hash the password securely before saving to database
        $hashed_password = password_hash($password, PASSWORD_DEFAULT);
        
        // In MySQLi, you must use bind_param to pass variables: "sssss" means 5 Strings
        $statement->bind_param("sssss", $my_new_uuid, $name, $email, $hashed_password, $usertype);
        $statement->execute();
        
        if($statement->affected_rows > 0){
            echo "User registered successfully";
            header("Location: login.php");
        }else{
            echo "Error: " . $statement->error;
        }
    }   


?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <title>Register - TranMS</title>
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
                <div class="col-lg-6 wow fadeIn" data-wow-delay="0.1s">
                    <div class="bg-light rounded p-5">
                        <div class="text-center mb-4">
                            <h2 class="mb-3">Create an Account</h2>
                            <p class="mb-0">Join us to book or provide transport services</p>
                        </div>
                        <form action="register.php" method="post">
                            <div class="form-floating mb-3">
                                <input type="text" class="form-control" id="name" name="name" placeholder="John Doe" required>
                                <label for="name">Full Name</label>
                            </div>
                            <div class="form-floating mb-3">
                                <input type="email" class="form-control" id="email" name="email" placeholder="name@example.com" required>
                                <label for="email">Email address</label>
                            </div>
                            
                            <div class="mb-3 px-2">
                                <label class="form-label d-block text-muted mb-2">I want to register as a:</label>
                                <div class="form-check form-check-inline">
                                    <input class="form-check-input" type="radio" name="usertype" id="roleCustomer" value="customer" checked>
                                    <label class="form-check-label" for="roleCustomer">Customer</label>
                                </div>
                                <div class="form-check form-check-inline">
                                    <input class="form-check-input" type="radio" name="usertype" id="roleDriver" value="driver">
                                    <label class="form-check-label" for="roleDriver">Driver / Owner</label>
                                </div>
                            </div>

                            <div class="form-floating mb-4">
                                <input type="password" class="form-control" id="password" name="password" placeholder="Password" required>
                                <label for="password">Password</label>
                            </div>
                            <button class="btn btn-success text-white w-100 py-3" type="submit" name="submit">Register Now</button>
                            <p class="text-center mt-4 mb-0">Already have an account? <a href="login.php">Sign In</a></p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
<?php include_once('../includes/footer.php'); ?>