const map = L.map('map').setView([34, -72], 6);
const drawnItems = new L.FeatureGroup();
var route=Array();

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

const oapiKey = '5431cea4928259758e577c8cd26f641d';

//API call for getting real time wind data

function fetchWindData(lat, lon) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${oapiKey}`;
    return fetch(apiUrl)
      .then(response => response.json())
      .catch(error => {
        console.error('Error fetching wind data:', error);
      });
  }

//convert co-ordinates from decimal to degrees and minutes

  function toDMS(lat,lng) {
    const toDMS=coord=>{min=~~(minA=((a=Math.abs(coord))-(deg=~~a))*60);
    return deg+"° "+min+"' "+Math.ceil((minA-min)*60)+'"';
    };
    var cord= ` ${toDMS(lat)} ${lat>=0?"N":"S"} / ${toDMS(lng)} ${lng>=0?"E":"W"}`;
    return cord;
    }

//Capture user click postion and display data obtained from API

  map.on('click', function (e) {
    const lat = e.latlng.lat;
    const lng = e.latlng.lng;
  
    fetchWindData(lat, lng).then(data => {
      const windSpeed = Math.round(1.944*data.wind.speed*100)/100;
      const windDirection = data.wind.deg;
      document.getElementById("data").innerHTML+=(`<br>location ${toDMS(lat,lng)} Wind speed ${windSpeed} Wind direction ${windDirection}`);
     });
  
    L.marker([lat, lng]).addTo(drawnItems);
    map.addLayer(drawnItems);
    route.push([lat,lng])
    console.log(route)
    var polyLine=L.polyline(route).addTo(map);
  

  });

  var infoBox=document.getElementById('info-box');

function addGeoJSONToMap() {
    fetch('output.geojson') 
        .then(function (response) {
            return response.json();
        })
        .then(function(data) {
          var geojsonLayer = L.geoJSON(data);
          console.log(data)
          for(let i=0; i<data.features.length; i++) {
            var windSpeed = data.features[i].properties.wind_speed;
            var windDirection = data.features[i].properties.wind_direction;
            var windArrowIconHtml = document.getElementById('wind-arrow-icon-container').innerHTML;
            var icon = L.divIcon({
            className: 'wind-arrow-icon', html: windArrowIconHtml.replace('{{windDirection}}', windDirection),});
            var marker = L.marker([data.features[i].geometry.coordinates[1], data.features[i].geometry.coordinates[0]], { icon: icon }).addTo(map);
        }
    


          data.on('mouseover', function(e) {
            var layer = e.layer;
            var properties = layer.feature.properties;
            var content = `Wind Speed: ${properties.wind_speed} m/s<br>
              Wind Direction: ${properties.wind_direction} degrees`;
            infoBox.innerHTML = content;
            infoBox.style.display = 'block';
          });

                data.on('mouseout', function () {
                    infoBox.innerHTML = '';
                });
            })
        .catch(function (error) {
            console.error('Error loading GeoJSON:', error);
        });
}


addGeoJSONToMap();



