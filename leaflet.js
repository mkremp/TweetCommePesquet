window.onload=function(){

  var map = L.map('map')

  L.tileLayer('http://korona.geog.uni-heidelberg.de/tiles/roads/x={x}&y={y}&z={z}', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
  map.setView([0, 0], 2);

	var iss = {
		url: "https://api.wheretheiss.at/v1/satellites/25544",
		methode: "GET",
		getInfos: function(jsonObj){
		  lat=jsonObj.latitude;
		  long=jsonObj.longitude;
		  return {lat:lat , long:long };
		}
	};

	var myIcon = L.icon({
	  iconUrl: 'navette.png',
	  iconSize: [29, 24],
	  //iconAnchor: [9, 21],
	  //popupAnchor: [0, -14]
	});

  var pointList = new Array();

  var followISS=document.getElementById("test1");

  var marqueurs=L.layerGroup()
		.addTo(map);

  function mark(point){
    //gestion des marqueurs
    marqueurs.clearLayers();
    L.marker(point, {icon:myIcon})
    .addTo(marqueurs)
    .bindPopup("ISS")
    .openPopup();
  };

  function poly(long,point,pointlist){
    if(long<=170){
          pointlist.push(point)
    }
    else{
          polyline.clearLayers();
        }
    var polyline = new L.polyline(pointList, {color: 'red',weight: '3'});
    map.addLayer(polyline);
  };

function buttonFollow(button,map,point){
  button.addEventListener('change',function(event){
    event.preventDefault();
    if (followISS.checked){
        map.setZoom(7);
        map.panTo(point);
        console.log(point);
        console.log(map.getCenter());
    }else{
        map.setView([0, 0], 2)

    }
  });
};

	ajaxIss();



    function ajaxIss(){
      var ajax = new XMLHttpRequest();
      ajax.open(iss.methode, iss.url, true);
      // métadonnées de la requête AJAX
      ajax.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
      ajax.addEventListener('readystatechange',function(){
        // si l'état est le numéro 4 et que la ressource est trouvée
          if(ajax.readyState == 4 && ajax.status == 200) {
              // le texte de la réponse
              var str=ajax.responseText;
              var jsonObj = JSON.parse(str);
              var result = iss.getInfos(jsonObj);
              //Création d'un objet LatLng
              var point = new L.LatLng(result.lat,result.long)
              //Bouton suivre
              buttonFollow(followISS,map,point);
              //création de la ligne de déplacement de l'iss
              poly(result.long,point,pointList);
              //gestion des marqueurs
              mark(point);



              //affichage de la latitude et longitude
              document.getElementById("lat").innerHTML = "Latitude : "+result.lat;
              document.getElementById("long").innerHTML = "Longitude : "+result.long;
			  //Ceckbox

              //répétition de la fonction toutes les 5 secondes
              setTimeout(function() {ajaxIss ()},5000);

			    }
		  });
      ajax.send("");


    };

}
