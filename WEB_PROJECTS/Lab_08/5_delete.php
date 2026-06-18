<html>
<body>

<h2>Delete User</h2>

<form method="POST" action="">
    <label>Enter Email to Delete</label>
    <input type="email" name="email" required>

    <br><br>

    <button type="submit" name="delete">Delete</button>
</form>

<?php
require_once("connection.php");

if(isset($_POST['delete'])){

    $email = $_POST['email'];

    // Delete query
    $sql = "DELETE FROM users WHERE email='$email'";

    if(mysqli_query($conn, $sql)){

        if(mysqli_affected_rows($conn) > 0){
            echo "<h3 style='color:green;'>User deleted successfully</h3>";
        } else {
            echo "<h3 style='color:orange;'>No user found with this email</h3>";
        }

    } else {
        echo "<h3 style='color:red;'>Error: " . mysqli_error($conn) . "</h3>";
    }
}
?>

</body>
</html>