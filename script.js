

  

$(document).ready(function () {

  auth0.createAuth0Client({
    domain: "dev-wkeroudvhv73deo2.us.auth0.com",
    clientId: "JkB9GW2GNJ5p7Wc8mcJXDXONybfBXPi4",
    authorizationParams: {
      redirect_uri: window.location.origin
    }
  }).then(async (auth0Client) => {

  const loginButton = document.getElementById("login");

  loginButton.addEventListener("click", (e) => {
    e.preventDefault();
    auth0Client.loginWithRedirect();
  });

  if (location.search.includes("state=") && 
  (location.search.includes("code=") || 
  location.search.includes("error="))) {
await auth0Client.handleRedirectCallback();
window.history.replaceState({}, document.title, "/");
}

const logoutButton = document.getElementById("logout");

  logoutButton.addEventListener("click", (e) => {
    e.preventDefault();
    auth0Client.logout();
  });
  
  const isAuthenticated = await auth0Client.isAuthenticated();
  const userProfile = await auth0Client.getUser();

  // Assumes an element with id "profile" in the DOM
  const profileElement = document.getElementById("profile");

  if (isAuthenticated) {
    profileElement.style.display = "block";
    profileElement.innerHTML = `Hello, ${userProfile.name}`;
    // <img src="${userProfile.picture}" />
  } 
  else {
    profileElement.style.display = "none";
  }


const map = L.map('map').setView([34, -72], 6);
map.createPane('label');
map.getPane('label').style.zIndex = 1000;
var tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
    }).addTo(map);
const drawnItems = new L.FeatureGroup();
var route=Array();
var polyLine;
var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); 
var yyyy = today.getFullYear();
today = yyyy + '-' + mm + '-' + dd;
var i=1;
var tables="";

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

  updateWindData(today);

  async function updateWindData(selectedDate) {
    const loadingIndicator = document.getElementById('loadingIndicator');
    loadingIndicator.style.display = 'block';
    map.eachLayer(function (layer) {
      if (layer instanceof L.Marker && layer.options.markerType=='wind') {
        map.removeLayer(layer);
      }
    });
    $.get('final.csv', function (data) {
      const rows = data.split('\n');
      for (let i = 1; i < rows.length - 1; i+=4) {
        const row = rows[i].split(',');
        const time = row[0];
        if (time.includes(selectedDate)) {
          const latitude = parseFloat(row[1]);
          const longitude = parseFloat(row[2]);
          const windSpeed = parseFloat(row[6]);
          const windDirection = parseFloat(row[7]);

          const arrowIcon = L.divIcon({
            className: 'wind-arrow-icon',
            iconSize: [10, 10],
            html: '<div style="transform: rotate(' + windDirection + 'deg)"><i class="fas fa-arrow-up" style="color: ' + getColor(windSpeed) + ';"></i></div>'
          });
  
          L.marker([latitude, longitude], { icon: arrowIcon, markerType: 'wind' }).addTo(map);
          loadingIndicator.style.display = 'none';
        }
      }
    });
  }
  
  var dateSlider=document.getElementById("dateslider");
  dateSlider.defaultValue = today;
  var play= document.getElementById("play");


  dateSlider.onchange= function dateS() {
    const selectedDay = new Date();
    selectedDay.setDate(selectedDay.getDate() + parseInt(dateSlider.value));
    const formattedDate = `${selectedDay.getFullYear()}-${(selectedDay.getMonth() + 1).toString().padStart(2, '0')}-${selectedDay.getDate().toString().padStart(2, '0')}`;
    updateWindData(formattedDate);
    document.getElementById("selectedDate").innerHTML = formattedDate;
  }

map.on('click', function (e) {
  const lat = e.latlng.lat;
  const lng = e.latlng.lng;

  fetchWindData(lat, lng).then(data => {
    const windSpeed = Math.round(1.944*data.wind.speed*100)/100;
    const windDirection = data.wind.deg;
    tables+="<tr>"+
    "<td class='position' >"+ toDMS(lat, lng) +"</td>"+
    "<td class='windSpeed'>"+ windSpeed +"</td>"+
    "<td class='windDirection'>"+ windDirection+"°"+"</td>"
    +"</tr>"
    document.getElementById("selected").innerHTML=tables;
   });

   if (polyLine) {
    map.removeLayer(polyLine);
  }

  L.marker([lat, lng]).addTo(drawnItems);
  map.addLayer(drawnItems);
  route.push([lat,lng])
  polyLine=L.polyline(route, {className:'line', pane: 'label'}).addTo(map);
  polyLine.bringToFront();

  });
  fetch('countries.geojson')
  .then(response => response.json())
  .then(data => {
    const geoJsonLayer = L.geoJSON(data, { pane: 'label' }).addTo(map);
    geoJsonLayer.setStyle({
      color: '#dea450',
      weight: 1,
      fillOpacity: 1,
    });
  })
  .catch(error => {
    console.error('Error loading GeoJSON data:', error);
  });

document.getElementById("selectedDate").defaultValue = today;
dateSlider.value = 0; 
selectedDate.textContent = today;

var loader = document.getElementById('loader');
loader.style.display = 'none';


play.onclick = function(){
  loader.style.display = 'inline';
  i=1;
	myLoop();
  setTimeout(function() {
    loader.style.display = 'none';
}, 7 * 2000);	};


  function myLoop() {
    setTimeout(function() {
    var endDateformat = new Date(new Date().setDate(new Date().getDate() + i));
    // Format the year, month, and day with double digits
    var year = endDateformat.getFullYear();
    var month = (endDateformat.getMonth() + 1).toString().padStart(2, '0');
    var day = endDateformat.getDate().toString().padStart(2, '0');
    var endDate = year + '-' + month + '-' + day;
    animate(endDate);
    dateSlider.value = i;
    document.getElementById("selectedDate").innerHTML = endDate;
    i++;
    if (i<7) {
      myLoop();
    }
    }, 3000)
  }


  function animate(date) {
    updateWindData(date);
  }
});

});