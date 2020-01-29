<?php
$servername = "kunet.kingston.ac.uk";
$username = "k1419859";
$password = "db7860";
$dbname = "db_k1419859";
$conn;

//Connecting to kunet database using PDO so that it gets the database name from the account and displays all the tables from that database
try {
    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo $e->getMessage();
}

//This function creates the query where it displays the town names and product information by aliasing the latitude and longitude of each town 
// as well as the Town ID, and joining it with the product ID
function getMapData() {
    global $conn;
    $FoodProduct = 'SELECT FoodProducts.ProductID, ProductName, Towns.TownName 
	AS PlaceOfOrigin, ProductDescription, Towns.T_Latitude 
	AS P_Latitude, Towns.T_Longitude AS P_Longitude, 
	Image FROM (FoodProducts LEFT JOIN Images ON FoodProducts.ProductID = Images.ProductID) LEFT JOIN Towns ON FoodProducts.TownID_fk = Towns.TownID';
    $FoodProducts = $conn->prepare($FoodProduct);
    $FoodProducts->execute();
//fetches all the objects from the Food Products and Towns tables and displays it on the map 
    return $FoodProducts->fetchAll(PDO::FETCH_OBJ);
}
?> 
