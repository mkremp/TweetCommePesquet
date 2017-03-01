<?php

$url1="http://api.geonames.org/extendedFindNearby?lat=42.01&lng=2.05&username=mkremp";
$url_base="http://api.geonames.org/extendedFindNearby?";

function get_data($url) {
    $ch = curl_init();
    $timeout = 5;
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, $timeout);
    $data = curl_exec($ch);
    curl_close($ch);
	return $data;
}

function convert($xml_string)  {
    $xml = simplexml_load_string($xml_string);
    $json = json_encode($xml);
    return($json);
}

function createUrl($url_base) {
    $lat=$_GET["lat"];
    $lng=$_GET["lng"];
    $usr=$_GET["username"];
    $url=$url_base."lat=".$lat."&lng=".$lng."&username=".$usr;
    return ($url);

}

$url=createUrl($url_base);
$xml_string = get_data($url);
$json1=convert($xml_string);

echo ($json1);
?>
