import xarray as xr

data = xr.open_dataset('era5.nc')

wind_speed = data['wind_speed']  
wind_direction = data['wind_direction']  


for i in range(len(lats)):
    for j in range(len(lons)):
        feature = {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [lons[j], lats[i]]
            },
            "properties": {
                "wind_speed": wind_speed[i],  
                "wind_direction": wind_direction[i, j] 
            }
        }
        features.append(feature)

for i in range(len(lats)):
    for j in range(len(lons)):
        feature = {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [lons[j], lats[i]]
            },
            "properties": {
                "wind_speed": wind_speed[i, j],  
                "wind_direction": wind_direction[i, j] 
            }
        }
        features.append(feature)
