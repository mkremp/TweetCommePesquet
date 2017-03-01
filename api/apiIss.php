<?php

$rayonTerre = 6371; //en km
$altitudeIss = 400; //en km
$r = $rayonTerre + $altitudeIss;
$vitesseIss = 27600; //en km/h
$v = $vitesseIss/(3600*pow(10,-3)); //en km/ms
$t0 =       ;//en ms premiere connexion
$t =        ; // en ms
$perimetre = M_PI*2*($rayonTerre + $altitudeIss);
$d = $facteurVitesse * $v * ($t-$t0); //distance parcourue par l'iss a l'instant t depuis t0, en km
$facteurVitesse = 3 ; //pour que l'iss tourne 3 fois plus vite ???...

//calcul des angles azimuth et polar
$azimuth = ($d/$perimetre)*360;
$polar = 90;

//on en déduit les coordonnées X,Y,Z de la station
$X = $r * cos($azimuth*M_PI/180) * cos(polar*M_PI/180);
$Y = $r * sin($azimuth*M_PI/180) * cos(polar*M_PI/180);
$Z = $r * sin(polar*M_PI/180);


//on applique une rotation de 51.34° autour de l'axe Y

/*
$rotationY = array();
$matrice[0] = array('cos(theta)','0','sin(theta)');
$matrice[1] = array('0','1','0');
$matrice[2] = array('sin(theta)','0','cos(theta)');
*/

$inclinaison = 51.64*M_PI/180;

$X1 = $X * cos($inclinaison) - $Z * sin($inclinaison);
$Y1 = $Y ;
$Z1 = $X * sin($inclinaison) + $Z * cos($inclinaison);

//calcul de la longitude et latitude :
$lat1 = asin($Z1/$r);
$long1 = acos($X1/($r*cos($lat)));


//prise en compte de rotation de la terre :

$perimetreTerre = 2 * M_PI * $rayonTerre ;  //en km
$vTerre = $perimetreTerre / (86400*pow(10,-3)) ; //en km/ms
$d1 = $facteurVitesse * $vTerre * ($t - $t0) ;

$theta = ($d1 / $perimetreTerre) * 360 ;

$X2 = $X1 * cos($theta) + $Y1 * sin($theta);
$Y2 = -$X1 * sin($theta) + $Y1 * cos($theta);
$Z2 = $Z1;

// on recalcule alors la longitude et latitude

$lat2 = asin($Z2/$r);
$long2 =  acos($X2/($r*cos($lat)));

echo($lat1,$long2);


?>
