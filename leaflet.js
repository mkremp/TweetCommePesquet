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

  var loc = {
    url: urlLoc,
    methode: "POST",
    getInfos: function(jsonObj){
      //console.log(jsonObj.geonames)
      toponymName=jsonObj.geonames.toponymName;
      country=jsonObj.geonames.countryName;
      return{toponymName:toponymName , countryName:countryName}

      }
    };

	var myIcon = L.icon({
	  iconUrl: 'navette.png',
	  iconSize: [29, 24],
	  //iconAnchor: [9, 21],
	  //popupAnchor: [0, -14]
	});

  var pointList = new Array();
  var point = new L.LatLng(0,0);
  var followISS=document.getElementById("checkboxFollow");
  var zoom = document.getElementById("zoom");
  var validation = document.getElementById("tcp");
  var urlpicture ;
  var urlLoc ;
  var picture=document.getElementById("picture");


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
    if(long<=178){
          pointlist.push(point);
    }
    else{
          pointlist.length = 0;
          polyline.clearLayers();

        }
    var polyline = new L.polyline(pointList, {color: 'red',weight: '3'});
    map.addLayer(polyline);
  };

	followISS.addEventListener('change',function(event){
    event.preventDefault();
		if (followISS.checked){
			center(map,point,zoom);
		}else{
			map.setView([0, 0], 2);

		}
	});





  validation.addEventListener('click', function(event) {
      event.preventDefault();
	  photo(long,lat,zoom);
      picture.innerHTML = '<img src='+urlpicture+' />';

  });



	function center (map,point,radio) {
		for (i=0;i<radio.length;i++){
			if (radio[i].checked){
					map.flyTo(point,radio[i].value);
				}
		//console.log(point);
		//console.log(map.getCenter());
		}
	};

	function photo(long,lat,zoom){

        for (i=0;i<zoom.length;i++){
          	if (zoom[i].checked){

				//console.log(zoom[i].value);
				urlpicture="https://api.mapbox.com/styles/v1/mapbox/satellite-v9/static/"+long+","+lat+","+zoom[i].value+'/700x250?access_token=pk.eyJ1IjoiY29oYWxsaWVyIiwiYSI6ImNpemVmODgxZTAwNzgzMnBlZzRkMXh1MjcifQ.0EiwSBDZMzgfEcam2M6nUA';

			}

        };
		return (urlpicture)
	}




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
            point = new L.LatLng(result.lat,result.long);
            //Bouton suivre
			if (followISS.checked){
				console.log(zoom[0].value);
				center(map,point,zoom);
			}

              //création de la ligne de déplacement de l'iss
              poly(result.long,point,pointList);
              //gestion des marqueurs
              mark(point);



              //affichage de la latitude et longitude
              document.getElementById("lat").innerHTML = "Latitude : "+result.lat;
              document.getElementById("long").innerHTML = "Longitude : "+result.long;

              //generation de l'url de la photo au cas où un user souhaite tweeter
              urlpicture=photo(result.long,result.lat,radio);







              //generation de l'url de recherche du lieu de la photo
              urlLoc =' http://api.geonames.org/findNearbyPlaceNameJSON?'+'lat='+result.lat+'&lng='+result.long+'&username=mkremp' ;
              console.log(urlLoc);





              //répétition de la fonction toutes les 5 secondes
              setTimeout(function() {ajaxIss ()},5000);

            }
			    });
          ajax.send("");
		  };





    };
