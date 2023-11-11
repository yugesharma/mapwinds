from typing import Any
import xarray as xr
import numpy as np
import json
import cdo
from math import atan2, degrees
import time
start=time.time()


class CustomJSONEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, np.float32):
            return float(obj)
        return super(CustomJSONEncoder, self).default(obj)
    
data = xr.open_dataset('era5.nc')

# Extract data variables
wind_u = data['u10']
wind_v = data['v10']
lats = wind_u['latitude'].values
lons = wind_v['longitude'].values
features=[]

for t in range(wind_u.shape[0]):
    for i in range(wind_u.shape[1]):
        for j in range(wind_u.shape[2]):

            wind_speed=round(float(wind_u[t,i,j]),4)
            wind_direction=round((degrees(atan2(-wind_u[t,i,j], -wind_v[t,i,j]))+360)%360,4)

            feature = {
                "type" : "feature",
                "geometry": {
                    "type" : "Point",
                    "coordinates":[lons[j],lats[i]]
                },
                "properties" : {
                    "wind_speed" : wind_speed,
                    "wind_direction" : wind_direction
                }
            }

            features.append(feature)

geojson_data = {
    "type": "FeatureCollection",
    "features": features
}

geojson_str = json.dumps(geojson_data, indent=2, cls=CustomJSONEncoder)

with open('outputncdf.geojson', 'w') as geojson_file:
    geojson_file.write(geojson_str)

end=time.time()
print(end-start)