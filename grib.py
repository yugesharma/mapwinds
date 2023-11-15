import xarray as xr
import numpy as np
import json
from math import atan2, degrees
import concurrent.futures
import dask.array as da
import time
start=time.time()


class CustomJSONEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, np.float32):
            return round(float(obj),4)
        return super(CustomJSONEncoder, self).default(obj)
    
def calculate_wind_direction(args):
    t, i, j, u, v = args
    wind_direction_rad = np.arctan2(-u[t, i, j], -v[t, i, j])
    wind_direction_deg = np.degrees(wind_direction_rad)
    wind_direction_deg = (wind_direction_deg + 360) % 360
    wind_speed_formatted = round(float(u[t, i, j]), 4)
    wind_direction_formatted = round(float(wind_direction_deg), 4)
    return {
        "type": "Feature",
        "geometry": {
            "type": "Point",
            "coordinates": [lons[j], lats[i]]
        },

        "properties": {
            "wind_speed": wind_speed_formatted,
            "wind_direction": wind_direction_formatted
        }
    }

data = xr.open_dataset('era5.nc')
u = data['u10'].chunk(chunks={'time': 1, 'latitude': -1, 'longitude': -1})
v = data['v10'].chunk(chunks={'time': 1, 'latitude': -1, 'longitude': -1})
lats = u['latitude'].values
lons = u['longitude'].values

u_da = da.from_array(u, chunks=u.shape)
v_da = da.from_array(v, chunks=v.shape)

# Extract data variables
wind_u = data['u10']
wind_v = data['v10']
lats = wind_u['latitude'].values
lons = wind_v['longitude'].values
u_da = da.from_array(wind_u, chunks=wind_u.shape)
v_da = da.from_array(wind_v, chunks=wind_v.shape)
features=[]

args_list = [(t, i, j, wind_u, wind_v) for t in range(wind_u.shape[0])
                                    for i in range(wind_v.shape[1])
                                    for j in range(wind_u.shape[2])]
    
with concurrent.futures.ThreadPoolExecutor() as executor:  
    features = list(executor.map(calculate_wind_direction, args_list))

geojson_data = {
    "type": "FeatureCollection",
    "features": features
}

geojson_str = json.dumps(geojson_data, indent=2, cls=CustomJSONEncoder)

with open('output.geojson', 'w') as geojson_file:
    geojson_file.write(geojson_str)

end=time.time()
print(end-start)