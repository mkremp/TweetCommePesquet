window.onload=function(){

    var map = L.map('map')



    L.tileLayer('http://korona.geog.uni-heidelberg.de/tiles/roads/x={x}&y={y}&z={z}', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
	
	map.setView([51, -0.09], 13);

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
	
	var marqueurs=L.layerGroup()
		.addTo(map);
		
	var pointList = new Array();
	//en global ça ne marche pas :'(
	//var polyline = new L.polyline(pointList, {color: 'red',weight: '3'});
	//map.addLayer(polyline);
	
	
	
	
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
			  //Bouton suivre
			  var followISS=document.getElementById("test1");
			  followISS.addEventListener('change',function(event){
				  event.preventDefault();
				  if (followISS.checked){
					  map.setView([result.lat,result.long],13)
				  }else{
					  map.setView([51, -0.09], 2)
					}
				});
              //gestion des marqueurs
              marqueurs.clearLayers();
              L.marker([result.lat, result.long], {icon:myIcon})
              .addTo(marqueurs)
              .bindPopup("ISS")
              .openPopup();
              //création de la ligne de déplacement de l'iss
              if(result.long!=180){
				var point = new L.LatLng(result.lat,result.long)
				pointList.push(point)
              }
              else{
				  polyline.clearLayers();
				  }
              var polyline = new L.polyline(pointList, {color: 'red',weight: '3'});
              map.addLayer(polyline);
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
