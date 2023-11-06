import xarray as xr
import numpy as np
import json
import netCDF4 as nc

# Load NetCDF data
filePath='output.nc'

dSet=nc.Dataset(filePath)
for dimension in dSet.dimensions.values():  
    print(dimension) 
