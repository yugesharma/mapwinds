import xarray as xr
import numpy as np
import json
import concurrent.futures
import time
import dask
import dask.distributed
import dask.diagnostics
import multiprocessing
start=time.time()


client = dask.distributed.Client()
with dask.diagnostics.profile(filename="dask-profile.html"):
    print('Start')

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

    if __name__ == '__main__':

        multiprocessing.freeze_support()
        data = xr.open_dataset('era5.nc')

        u = data['u10']
        v = data['v10']
        lats = u['latitude'].values
        lons = u['longitude'].values

        chunk_size_time = 2
        chunk_size_lat = 121 
        chunk_size_lon = 481  

        features = []

        for t in range(0, u.shape[0], chunk_size_time):
            for i in range(0, u.shape[1], chunk_size_lat):
                for j in range(0, u.shape[2], chunk_size_lon):
                    u_chunk = u[t:t+chunk_size_time, i:i+chunk_size_lat, j:j+chunk_size_lon]
                    v_chunk = v[t:t+chunk_size_time, i:i+chunk_size_lat, j:j+chunk_size_lon]
                    args_list = [(t, i, j, u_chunk, v_chunk, lats, lons)
                                for t in range(u_chunk.shape[0])
                                for i in range(u_chunk.shape[1])
                                for j in range(u_chunk.shape[2])]
        features=[]
            
        with concurrent.futures.ThreadPoolExecutor() as executor:  
            features.extend(executor.map(calculate_wind_direction, args_list))

        geojson_data = {
            "type": "FeatureCollection",
            "features": features
        }

        geojson_str = json.dumps(geojson_data, indent=2, cls=CustomJSONEncoder)

        with open('output.geojson', 'w') as geojson_file:
            geojson_file.write(geojson_str)

        end=time.time()
        print(end-start)