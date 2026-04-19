<?php
$str = "I am string to be tested";
$reversed = strrev($str);

// 2. Count words
$wordCount = str_word_count($str);

// 3. Find the position of the word "be"
// stripos() is case-insensitive; strpos() is case-sensitive
$position = stripos($str, "be");

if ($position !== false) {
    $positionMsg = "The word 'be' is found at position: " . $position;
} else {
    $positionMsg = "The word 'be' was not found in the string.";
}

// Output results
echo "Original String: $str\n";
echo "Reversed String: $reversed\n";
echo "Number of Words: $wordCount\n";
echo $positionMsg . "\n";
?>
