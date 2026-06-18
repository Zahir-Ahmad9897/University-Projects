<?php
include_once('../config/connect_db.php');

session_start();

if (isset($_SESSION['user_id']) && $_SESSION['user_type'] == 'driver') {

    $query = "
    SELECT 
        bookings.*, 
        transport.title
    FROM transport
    INNER JOIN bookings 
        ON transport.id = bookings.transport_id
    WHERE transport.ownerid = ?
    ";

    $stmt = $connect->prepare($query);

    if (!$stmt) {
        die("Prepare failed: " . $connect->error);
    }

    $stmt->bind_param("i", $_SESSION['user_id']);

    if (!$stmt->execute()) {
        die("Execute failed: " . $stmt->error);
    }

    $result = $stmt->get_result();

} else {
    header("Location: ../auth/login.php");
    exit();
}
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <title>Manage Bookings - TranMS</title>
    <meta content="width=device-width, initial-scale=1.0" name="viewport">

    <!-- Favicon -->
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
            <div class="text-center mx-auto wow fadeIn" data-wow-delay="0.1s" style="max-width: 600px;">
                <p class="fs-4 font-dancing-script text-primary mb-0">Overview</p>
                <h1 class="display-4 mb-5">All Bookings</h1>
            </div>

            <?php if($result->num_rows > 0) { ?>
            <div class="table-responsive">
                <table class="table table-bordered table-hover">
                    <thead class="table-light">
                        <tr>
                            <th>ID</th>
                            <th>Transport</th>
                            <th>Pickup Date</th>
                            <th>Pickup Location</th>
                            <th>Dropoff Location</th>
                            <th>Passengers</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php while($row = $result->fetch_assoc()) { ?>
                        <tr>
                            <td><?php echo $row['id']; ?></td>
                            <td><?php echo htmlspecialchars($row['title']); ?></td>
                            <td><?php echo htmlspecialchars($row['pickup_date']); ?></td>
                            <td><?php echo htmlspecialchars($row['pickup_location']); ?></td>
                            <td><?php echo htmlspecialchars($row['dropoff_location']); ?></td>
                            <td><?php echo htmlspecialchars($row['passengers']); ?></td>
                            <td><?php echo htmlspecialchars($row['status']); ?></td>
                            <td>
                                <div class="d-flex gap-2">
                                    <a class="btn btn-success btn-sm" href="update-booking-status.php?id=<?php echo $row['id']; ?>&status=accepted">Accept</a>
                                    <a class="btn btn-secondary btn-sm" href="update-booking-status.php?id=<?php echo $row['id']; ?>&status=declined">Decline</a>
                                </div>
                            </td>
                        </tr>
                        <?php } ?>
                    </tbody>
                </table>
            </div>
            <?php } else { ?>
                <p class="text-center">No bookings found</p>
            <?php } ?>
        </div>
    </div>

<?php include_once('../includes/footer.php'); ?>