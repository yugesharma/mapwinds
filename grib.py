import xarray as xr
import numpy as np
import json
import time
import dask
import dask.array as da
from dask.diagnostics import Profiler, ResourceProfiler, visualize

start = time.time()

class CustomJSONEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, np.float32):
            return round(float(obj), 4)  
        return super(CustomJSONEncoder, self).default(obj)


data = xr.open_dataset('era5.nc')

u = data['u10']
v = data['v10']

lats = u['latitude'].values
lons = u['longitude'].values

def calculate_wind_data(t, i, j, u, v, lats, lons):
    wind_direction_rad = np.arctan2(-u[t, i, j], -v[t, i, j])
    wind_direction_deg = np.degrees(wind_direction_rad)
    wind_direction_deg = (wind_direction_deg + 360) % 360
    wind_speed = float(u[t, i, j])
    wind_direction = round(float(wind_direction_deg), 4)
    return {
        "type": "Feature",
        "geometry": {
            "type": "Point",
            "coordinates": [lons[j], lats[i]]
        },
        "properties": {
            "wind_speed": wind_speed,
            "wind_direction": wind_direction
        }
    }

if __name__ == '__main__':
    u_dask = da.from_array(u.data, chunks=(1, u.shape[1], u.shape[2]))
    v_dask = da.from_array(v.data, chunks=(1, v.shape[1], v.shape[2]))

    features = []

    with Profiler() as prof, ResourceProfiler() as rprof:
        for t in range(u.shape[0]):
            features_t = dask.compute(
                [
                    calculate_wind_data(t, i, j, u_dask, v_dask, lats, lons)
                    for i in range(u.shape[1])
                    for j in range(u.shape[2])
                ]
            )[0]
            features.extend(features_t)

    geojson_data = {
        "type": "FeatureCollection",
        "features": features
    }

    geojson_str = json.dumps(geojson_data, indent=2, cls=CustomJSONEncoder)

    with open('output.geojson', 'w') as geojson_file:
        geojson_file.write(geojson_str)

    end = time.time()
    print(end - start)

    visualize([prof, rprof])
