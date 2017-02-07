<?php
session_start();

if (isset($_SESSION["place"])){ // Change selon les navigateurs
  $place=$_SESSION["place"];
}
elseif(isset($_GET["place"])){
  $place=$_GET["place"];
}
else{
  $place="";
}
if (!isset($_GET["place"])){
  $_GET["place"]="";
}
echo "<option value = ".$place." selected>".$place.'</option>';

?>
