import psycopg2
import pandas as pd
from sqlalchemy import create_engine

connection= psycopg2.connect(database="mapwinds2",
                user='postgres', password='afirstdb',
                host='localhost', port='5432')

cursor=connection.cursor()

engine=create_engine(f'postgresql://postgres:afirstdb@localhost/mapwinds2')
df=pd.read_csv(r'C:\Users\acer\Documents\mapwinds back-end\mapWindsBackEnd\public\resources\final.csv')
df.to_sql('mapwinder', engine, if_exists='replace', index=True)


connection.commit()
connection.close()
