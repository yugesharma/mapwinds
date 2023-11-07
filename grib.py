import xarray as xr

data = xr.open_dataset('era5.nc')

wind_speed = data['wind_speed']  
wind_direction = data['wind_direction']  


features = []


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
                "wind_direction": wind_direction[i] 
            }
        }
        features.append(feature)


geojson_data = {
    "type": "FeatureCollection",
    "features": features
}


geojson_str = json.dumps(geojson_data, indent=2)


with open('output.geojson', 'w') as geojson_file:
    geojson_file.write(geojson_str)
