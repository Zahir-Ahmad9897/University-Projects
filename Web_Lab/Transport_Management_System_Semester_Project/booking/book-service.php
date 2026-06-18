<?php
session_start();
require '../vendor/autoload.php';
use Ramsey\Uuid\Uuid;
include_once('../config/connect_db.php');

$success_msg = '';
$error_msg = '';

if(!isset($_SESSION['user_id'])){
    header("Location: ../auth/login.php");
    exit();
}

$current_transport_id = isset($_GET['id']) ? $_GET['id'] : '';

echo $current_transport_id;
if (isset($_POST['submit'])) {
    $transport_id = $_POST['transport_id'];
    $pickup_location = $_POST['pickup_location'];
    $dropoff_location = $_POST['dropoff_location'];
    $pickup_date = $_POST['pickup_date'];
    $pickup_time = $_POST['pickup_time'];
    $passengers = $_POST['passengers'];
    $special_request = $_POST['special_request'];
    
    $user_id = isset($_SESSION['user_id']) ? $_SESSION['user_id'] : null;
    $id = Uuid::uuid4()->toString();
    
    $query = "INSERT INTO bookings (id, user_id, transport_id, pickup_location, dropoff_location, pickup_date, pickup_time, passengers, special_request) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
    $statement = $connect->prepare($query);
    $statement->bind_param("sssssssis", $id, $user_id, $transport_id, $pickup_location, $dropoff_location, $pickup_date, $pickup_time, $passengers, $special_request);
    
    if ($statement->execute()) {
        $success_msg = "Service booked successfully!";
    } else {
        $error_msg = "An error occurred while booking the service.";
    }
}

?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <title>Book Service - TranMS</title>
    <meta content="width=device-width, initial-scale=1.0" name="viewport">

    <!-- Favicon -->
    <link href="../img/favicon.ico" rel="icon">

    <!-- Google Web Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Jost&family=Yeseva+One&family=Dancing+Script&display=swap"
        rel="stylesheet">

    <!-- Icon Font Stylesheet -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.10.0/css/all.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.13.1/font/bootstrap-icons.min.css">

    <!-- Customized Bootstrap Stylesheet -->
    <link href="../css/bootstrap.min.css" rel="stylesheet">

    <!-- Template Stylesheet -->
    <link href="../css/style.css" rel="stylesheet">

    <style>
        .navbar-dark .navbar-nav .nav-link {
            color: rgba(255, 255, 255, .5);
        }
    </style>
</head>

<body>
<?php
$base_path = '../';
include_once('../includes/navbar.php');
?>

    <!-- Form Start -->
    <div class="container-fluid py-6">
        <div class="container">
            <div class="text-center mx-auto wow fadeIn" data-wow-delay="0.1s" style="max-width: 600px;">
                <p class="fs-4 font-dancing-script text-primary mb-0">Booking Details</p>
                <h1 class="display-4 mb-5">Book a Transport Service</h1>
            </div>
            <div class="row justify-content-center">
                <div class="col-lg-8">
                    <div class="bg-light rounded p-5 shadow-sm">
                        
                        <?php if($success_msg): ?>
                            <div class="alert alert-success"><?php echo $success_msg; ?></div>
                        <?php endif; ?>
                        
                        <?php if($error_msg): ?>
                            <div class="alert alert-danger"><?php echo $error_msg; ?></div>
                        <?php endif; ?>

                        <form method="POST">
                            <input type="hidden" name="transport_id" value="<?php echo htmlspecialchars($current_transport_id); ?>">
                            <div class="row g-4">

                                <!-- Pickup Location -->
                                <div class="col-md-6">
                                    <div class="form-floating">
                                        <input type="text" class="form-control bg-white" id="pickup_location" name="pickup_location"
                                            placeholder="Pickup Location" required>
                                        <label for="pickup_location">Pickup Location</label>
                                    </div>
                                </div>

                                <!-- Dropoff Location -->
                                <div class="col-md-6">
                                    <div class="form-floating">
                                        <input type="text" class="form-control bg-white" id="dropoff_location" name="dropoff_location"
                                            placeholder="Dropoff Location" required>
                                        <label for="dropoff_location">Dropoff Location</label>
                                    </div>
                                </div>

                                <!-- Pickup Date -->
                                <div class="col-md-6">
                                    <div class="form-floating">
                                        <input type="date" class="form-control bg-white" id="pickup_date" name="pickup_date"
                                            placeholder="Pickup Date" required>
                                        <label for="pickup_date">Pickup Date</label>
                                    </div>
                                </div>

                                <!-- Pickup Time -->
                                <div class="col-md-6">
                                    <div class="form-floating">
                                        <input type="time" class="form-control bg-white" id="pickup_time" name="pickup_time"
                                            placeholder="Pickup Time" required>
                                        <label for="pickup_time">Pickup Time</label>
                                    </div>
                                </div>

                                <!-- Passengers -->
                                <div class="col-12">
                                    <div class="form-floating">
                                        <input type="number" class="form-control bg-white" id="passengers" name="passengers"
                                            placeholder="Number of Passengers" min="1" required>
                                        <label for="passengers">Number of Passengers</label>
                                    </div>
                                </div>

                                <!-- Special Request -->
                                <div class="col-12">
                                    <div class="form-floating">
                                        <textarea class="form-control bg-white" id="special_request" name="special_request"
                                            placeholder="Special Request" style="height: 100px"></textarea>
                                        <label for="special_request">Special Request (Optional)</label>
                                    </div>
                                </div>

                                <!-- Submit -->
                                <div class="col-12 mt-4">
                                    <button class="btn btn-success text-white w-100 py-3 fw-bold" type="submit" name="submit">Confirm Booking</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- Form End -->

<?php include_once('../includes/footer.php'); ?>
