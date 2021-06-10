<?php
$longopts  = array(
  "required:",     // Required value
  "optional::",    // Optional value
  "ignored",        // No value
);
$options = getopt('', $longopts);
var_dump($options);

//php phputil.php --required reqvalue --optional="optional value" --ignored doesnotmatter



