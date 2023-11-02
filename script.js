const map = L.map('map').setView([34, -72], 6);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

const oapiKey = '5431cea4928259758e577c8cd26f641d';

function fetchWindData(lat, lon) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${oapiKey}`;
    return fetch(apiUrl)
      .then(response => response.json())
      .catch(error => {
        console.error('Error fetching wind data:', error);
      });
  }

  map.on('click', function (e) {
    const lat = e.latlng.lat;
    const lng = e.latlng.lng;
  
    fetchWindData(lat, lng).then(data => {
      const windSpeed = Math.round(1.944*data.wind.speed*100)/100;
      const windDirection = data.wind.deg;
      document.getElementById("data").innerHTML=(`location ${lat} ${lng} Wind speed ${windSpeed} Wind direction ${windDirection}`);
     });
  
    L.marker([lat, lng], {pane: 'label'}).addTo(drawnItems);

  });