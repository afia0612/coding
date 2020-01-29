<?php
//Using MVC layout to connect to database
require_once 'DBconnection.php';

$foodProducts = getMapData();

echo json_encode($foodProducts);

?>
