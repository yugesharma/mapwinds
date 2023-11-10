import xarray as xr
import numpy as np
import json
import jsons

class CustomJSONEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, np.float32):
            return round(float(obj),4)
        return super(CustomJSONEncoder, self).default(obj)

data = xr.open_dataset('era5.nc')

u = data['u']  
v = data['v']  

lats = u['latitude'].values
lons = u['longitude'].values

features = []

for t in range(u.shape[0]):
    for i in range(u.shape[1]):
        for j in range(u.shape[2]):
            wind_direction_rad = np.arctan2(-u[t, i, j], -v[t, i, j])

            wind_direction_deg = np.degrees(wind_direction_rad)

            wind_direction_deg = (wind_direction_deg + 360) % 360

            feature = {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [lons[j], lats[i]]
                },
                "properties": {
                    "wind_speed": round(float(u[t, i, j]),4),
                    "wind_direction": round(wind_direction_deg,4)
                }
            }
            
            features.append(feature)

geojson_data = {
    "type": "FeatureCollection",
    "features": features
}

geojson_str = json.dumps(geojson_data, indent=2, cls=CustomJSONEncoder)

with open('output.geojson', 'w') as geojson_file:
    geojson_file.write(geojson_str)
