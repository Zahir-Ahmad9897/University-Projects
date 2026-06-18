<?php
// Integer variable
$integerVar = 42;

// Float variable
$floatVar = 3.1416;

// String variables
$string1 = "Hello";
$string2 = "World";

// Constant variable (cannot be changed once defined)
define("MY_CONSTANT", "This is a constant value");

// Concatenate two strings with a space in between
$concatenatedString = $string1 . " " . $string2;

// Display all variables using echo
echo "Integer Value: " . $integerVar . "<br>";
echo "Float Value: " . $floatVar . "<br>";
echo "Constant Value: " . MY_CONSTANT . "<br>";
echo "Concatenated String: " . $concatenatedString . "<br>";
?>
