<?php
// sum of digits function
function digitSum($num) {
    $sum = 0;
    while ($num > 0) {
        $sum += $num % 10;
        $num = (int)($num / 10);
    }
    return $sum;
}

echo "Sum of digits: " . digitSum(12345);
?>