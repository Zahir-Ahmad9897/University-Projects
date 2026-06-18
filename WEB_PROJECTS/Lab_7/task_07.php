<?php
// prime numbers and their sum
function isPrime($num) {
    if ($num < 2) return false;
    for ($i = 2; $i <= sqrt($num); $i++) {
        if ($num % $i == 0) return false;
    }
    return true;
}

$sum = 0;
for ($i = 1; $i < 100; $i++) {
    if (isPrime($i)) {
        echo $i . " ";
        $sum += $i;
    }
}

echo "<br>Sum: $sum";
?>