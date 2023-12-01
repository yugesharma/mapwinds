$(document).ready(function () {

const map = L.map('map').setView([34, -72], 6);
map.createPane('label');
map.getPane('label').style.zIndex = 1000;
var tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
    }).addTo(map);
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

  function getColor(speed) {
    if (speed < 5) {
      return 'green';
    } else if (speed < 10) {
      return 'yellow';
    } else {
      return 'red';
    }
  }

  function updateWindData(selectedDate) {
    $.get('final.csv', function (data) {
      const rows = data.split('\n');
      for (let i = 1; i < rows.length - 1; i++) {
        const row = rows[i].split(',');
        const time = row[0];
        if (time.includes(selectedDate)) {
          const latitude = parseFloat(row[1]);
          const longitude = parseFloat(row[2]);
          const windSpeed = parseFloat(row[6]);
          const windDirection = parseFloat(row[7]);
          console.log(latitude)

          const arrowIcon = L.divIcon({
            className: 'wind-arrow-icon',
            iconSize: [10, 10],
            html: '<div style="transform: rotate(' + windDirection + 'deg)"><i class="fas fa-arrow-up" style="color: ' + getColor(windSpeed) + ';"></i></div>'
          });
  
          L.marker([latitude, longitude], { icon: arrowIcon }).addTo(map);
        }
      }
    });
  }
  
updateWindData('2023-11-28')

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
  var polyLine=L.polyline(route, [{className:'line', pane: 'label'}]).addTo(map);
  polyLine.bringToFront();

});

});

