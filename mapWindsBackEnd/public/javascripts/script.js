const map = L.map('map').setView([34, -72], 6);
map.createPane('label');
map.getPane('label').style.zIndex = 20;

const drawnItems = new L.FeatureGroup();
const route=Array();
let polyLine;
let today = new Date();
const dd = String(today.getDate()).padStart(2, '0');
const mm = String(today.getMonth() + 1).padStart(2, '0'); 
const yyyy = today.getFullYear();
today = yyyy + '-' + mm + '-' + dd;
let tables="";
let i=1;


fetch('../resources/ocean.geojson')
.then(response => response.json())
.then(data => {
  const geoJsonLayer = L.geoJSON(data).addTo(map);
  geoJsonLayer.setStyle({
    color: '#94b6ef',
    weight: 1,
    fillOpacity: 0.8,
  });
})
.catch(error => {
  console.error('Error loading GeoJSON data:', error);
});


updateWindData(today);

//convert co-ordinates from decimal to degrees and minutes
function toDMS(lat,lng) {
  const toDMS=coord=>{min=~~(minA=((a=Math.abs(coord))-(deg=~~a))*60);
  return deg+"° "+min+"' "+Math.ceil((minA-min)*60)+'"';
  };
  const cord= ` ${toDMS(lat)} ${lat>=0?"N":"S"} / ${toDMS(lng)} ${lng>=0?"E":"W"}`;
  return cord;
  }


// Create wind markers
async function updateWindData(selectedDate) {
  const loadingIndicator = document.getElementById('loadingIndicator');
  loadingIndicator.style.display = 'block';
  map.eachLayer(function (layer) {
    if (layer instanceof L.Marker && layer.options.markerType=='wind') {
      map.removeLayer(layer);
    }});
  
  const apiUrl=`/apiDB?date=${selectedDate}`;
  
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    
    for (let i = 1; i < data.length - 1; i++) {
      const latitude = parseFloat(data[i].latitude);
      const longitude = parseFloat(data[i].longitude);
      const windSpeed = parseFloat(data[i].WS);
      const windDirection = parseFloat(data[i].WD);
      const arrowIcon = L.divIcon({
        className: 'wind-arrow-icon',
        iconSize: [10, 10],
        html: '<div style="transform: rotate(' + windDirection + 'deg)"><i class="fas fa-arrow-up" style="color: ' + getColor(windSpeed) + ';"></i></div>'
      });

      L.marker([latitude, longitude], { icon: arrowIcon, markerType: 'wind' }).addTo(map);
      loadingIndicator.style.display = 'none';
    
  } 

  } catch (error) {
    console.error('Error fetching DB data:', error);
    throw new Error('Unable to fetch DB data');
  }

}

function getColor(speed) {
  if (speed < 5) {
    return 'green';
  } else if (speed < 10) {
    return 'yellow';
  } else {
    return 'red';
  }
}

//Save route
const savePrompt= document.getElementById("savePrompt");
var routeNameModal = document.getElementById("routeNameModal");
var span = document.getElementsByClassName("close")[0];
const save= document.getElementById("save");


savePrompt.onclick = function() {
  modal.style.display = "block";
}

save.onclick = async function(){
  const routeName=document.getElementById("routeName").value;
  const response = await fetch("/route/save", {
    method : "POST",
    body : JSON.stringify({route:route, routeName:routeName}),
    credentials : "include",
    headers: { "Content-Type" : "application/json"}
  });
  routeNameModal.style.display = "none";
};

//Show saved routes
const showRoutes= document.getElementById("showRoutes");
var showRoutesModal = document.getElementById("showRoutesModal");



showRoutes.onclick = async function() {
  showRoutesModal.style.display = "block";
  const response = await fetch('/route/show');
    const data = await response.json();
    console.log(data.rows);
    let routes="";
    for(let i=0; i<data.rows.length; i++){
      routes=routes+data.rows[i].routename+"<br>";
    }
    document.getElementById("listRoutes").innerHTML = routes;
    console.log(routes)
    
}




// Date slider
const dateSlider=document.getElementById("dateslider");
dateSlider.defaultValue = today;
const play= document.getElementById("play");

dateSlider.onchange= () => {
  const selectedDay = new Date();
  selectedDay.setDate(selectedDay.getDate() + parseInt(dateSlider.value));
  const formattedDate = `${selectedDay.getFullYear()}-${(selectedDay.getMonth() + 1).toString().padStart(2, '0')}-${selectedDay.getDate().toString().padStart(2, '0')}`;
  updateWindData(formattedDate);
  changeDate(formattedDate);
}

async function changeDate(date) {
  const apiUrl=`/changedate?date=${date}`;
  try {
    const response = await fetch(apiUrl);
    const data = await response.text();
    document.getElementById("selectedDate").innerHTML = data;
    return data;

  } catch (error) {
    console.error('Error fetching wind data:', error);
    throw new Error('Unable to fetch wind data');
  }
}

// Capture user click postion and display data obtained from API
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
  route.push([lat,lng]);
  polyLine=L.polyline(route, {className:'line', pane: 'label'}).addTo(map);
  polyLine.bringToFront();
  });

  // fetch openWeather API data
async function fetchWindData(lat, lng) {
  const apiUrl=`/openweather?lat=${lat}&lon=${lng}`;
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data;

  } catch (error) {
    console.error('Error fetching wind data:', error);
    throw new Error('Unable to fetch wind data');
  }
}


fetch('../resources/countries.geojson')
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
const loader = document.getElementById('loader');
loader.style.display = 'none';


play.onclick = function(){
  loader.style.display = 'inline';
  i=1;
	animateWind();
  setTimeout(function() {
    loader.style.display = 'none';
}, 7 * 2000);	};


function animateWind() {
  setTimeout(function() {
  const endDateformat = new Date(new Date().setDate(new Date().getDate() + i));
  // Format the year, month, and day with double digits
  const year = endDateformat.getFullYear();
  const month = (endDateformat.getMonth() + 1).toString().padStart(2, '0');
  const day = endDateformat.getDate().toString().padStart(2, '0');
  const endDate = year + '-' + month + '-' + day;
  updateWindData(endDate);
  dateSlider.value = i;
  document.getElementById("selectedDate").innerHTML = endDate;
  i++;
  if (i<7) {
    animateWind();
    }
  }, 2000)

}