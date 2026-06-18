
<html>
<body>
    <h2>Search User</h2>

<form method="POST" action="">
    <label>Enter Email</label>
    <input type="email" name="email" required>

    <br><br>

    <button type="submit" name="search">Search</button>
</form>

<hr>

<?php
require_once("connection.php");

if(isset($_POST['search'])){

    $email = $_POST['email'];

    // Get data from DB
    $sql = "SELECT * FROM users WHERE email='$email'";
    $result = mysqli_query($conn, $sql);

    if(mysqli_num_rows($result) > 0){

        $row = mysqli_fetch_assoc($result);

?>

<h2>User Details</h2>

<form>
    <label>Full Name</label>
    <input type="text" value="<?php echo $row['full_name']; ?>" readonly>

    <br><br>

    <label>Email</label>
    <input type="text" value="<?php echo $row['email']; ?>" readonly>

    <br><br>

    <label>Phone</label>
    <input type="text" value="<?php echo $row['phone']; ?>" readonly>

    <br><br>

    <label>Gender</label>
    <input type="text" value="<?php echo $row['gender']; ?>" readonly>

    <br><br>

    <label>Address</label>
    <input type="text" value="<?php echo $row['address']; ?>" readonly>

</form>

<?php
    } else {
        echo "<h3 style='color:red;'>No user found with this email</h3>";
    }
}
?>

</body>
</html>