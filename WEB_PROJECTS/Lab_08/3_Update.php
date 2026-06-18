<!DOCTYPE html>
<html>
<head>
    <title>Update Address</title>
</head>
<body>

<h2>Update Address</h2>

<form method="POST" action="">
    <label>Email (to find user)</label>
    <input type="email" name="email" required>

    <br><br>

    <label>New Address</label>
    <input type="text" name="address" required>

    <br><br>

    <button type="submit" name="submit">Update Address</button>
</form>

<?php
if(isset($_POST['submit'])){
    require_once("connection.php");

    $email = $_POST['email'];
    $address = $_POST['address'];

    
    $sql = "UPDATE users SET address='$address' WHERE email='$email'";

    if(mysqli_query($conn, $sql)){
        if(mysqli_affected_rows($conn) > 0){
            echo "<h3 style='color:green;'>Address updated successfully</h3>";
        } else {
            echo "<h3 style='color:orange;'>Email not found or no change</h3>";
        }
    } else {
        echo "<h3 style='color:red;'>Error: " . mysqli_error($conn) . "</h3>";
    }
}
?>

</body>
</html>