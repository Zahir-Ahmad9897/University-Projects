<?php
// array operations with sorting and display
$cities = ["Pakistan","England","India","America","Dubai","Saudi Arabia","Mexico","Turkey","Holland","Karachi","Peshawar","Lahore"];

echo implode(", ", $cities);

sort($cities);
echo "<ul>";
foreach ($cities as $city) {
    echo "<li>$city</li>";
}
echo "</ul>";

array_push($cities, "Quetta", "Faisalabad", "Multan");

sort($cities);
echo "<ul>";
foreach ($cities as $city) {
    echo "<li>$city</li>";
}
echo "</ul>";
?>