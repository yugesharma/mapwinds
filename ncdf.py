import requests
import xarray as xr
import pandas as pd
import numpy as np

url=f'https://pae-paha.pacioos.hawaii.edu/thredds/ncss/ncep_global/NCEP_Global_Atmospheric_Model_best.ncd?disableLLSubset=on&disableProjSubset=on&horizStride=1&time_start=2022-11-25T12%3A00%3A00Z&time_end=2023-11-26T12%3A00%3A00Z&timeStride=1&addLatLon=true'
print(url)
response=requests.get(url)
if response.status_code==200:
    file_path='forecast2.nc'
    print("Sucessfully fetched")
    with open(file_path, 'wb') as file:
        file.write(response.content)
else:
    print('err')


ds=xr.open_dataset('forecast2.nc')
df=ds.to_dataframe()

print(df.to_csv('forecast2.csv'))

input_file = 'forecast2.csv'
df = pd.read_csv(input_file)

df['longitude']=((df['longitude'])+180)%360 - 180
df['WS'] = round(np.sqrt(df['ugrd10m'] ** 2 + df['vgrd10m'] ** 2),4)
df['WD'] = round(np.degrees(np.arctan2(df['vgrd10m'], df['ugrd10m'])),2)

mask=df['time'].str.endswith('12:00:00')
new_df=df[mask]

output_file = 'final.csv'
new_df.to_csv(output_file, index=False)

print("file ready")