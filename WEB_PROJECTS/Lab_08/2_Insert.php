
<html>
<body>

<form method="POST" action="">
    <label>Full Name</label>
    <input type="text" name="fullname" required>

    <br><br>

    <label>Email</label>
    <input type="email" name="email" required>

    <br><br>

    <label>Phone Number</label>
    <input type="number" name="phonenumber" required>

    <br><br>

    <label>Password</label>
    <input type="password" name="password" required>

    <br><br>

    <label>Gender</label>
    <input type="radio" name="gender" value="male" required> Male
    <input type="radio" name="gender" value="female"> Female

    <br><br>

    <label>Address</label>
    <input type="text" name="address">

    <br><br>

    <button type="submit" name="submit">Submit</button>
</form>

</body>
</html>

<?php
if(isset($_POST['submit'])){
    require_once("connection.php");

    $fullname = $_POST['fullname'];
    $email = $_POST['email'];
    $phonenumber = $_POST['phonenumber'];
    $password = $_POST['password'];
    $gender = $_POST['gender'];
    $address = $_POST['address'];

    
    $result = "INSERT INTO users (full_name, email, phone, password, gender, address) 
               VALUES ('$fullname', '$email', '$phonenumber', '$password', '$gender', '$address')";

    if(mysqli_query($conn, $result)){
        echo "<h3 style='color:green;'>Signup successfully</h3>";
    } else {
        echo "<h3 style='color:red;'>Error: " . mysqli_error($conn) . "</h3>";
    }
}
?>