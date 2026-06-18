<?php
 
function addIntegers($num1, $num2) {
    // Validate that both parameters are integers
    if (!is_int($num1) || !is_int($num2)) {
        throw new InvalidArgumentException("Both parameters must be integers.");
    }
    return $num1 + $num2;
}

 
    // Example integer variables
    $a = 15;
    $b = 25;

    // Call the function and store the result
    $sum = addIntegers($a, $b);
 
?>
