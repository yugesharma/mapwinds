import psycopg2
import pandas as pd
from sqlalchemy import create_engine, text

db_params= {
    'host': 'localhost',
    'database': 'postgres',
    'user': 'postgres',
    'password': 'afirstdb'
}

conn = psycopg2.connect(
    host=db_params['host'],
    database=db_params['database'],
    user=db_params['user'],
    password=db_params['password']
)

cur = conn.cursor()

conn.set_session(autocommit=True)

cur.execute("CREATE DATABASE mapwinds2")

conn.commit()
cur.close()
conn.close()

db_params['database'] = 'mapwinds2'
engine = create_engine(f'postgresql://{db_params["user"]}:{db_params["password"]}@{db_params["host"]}/{db_params["database"]}')

df = pd.read_csv(r"C:\Users\acer\Documents\mapwinds back-end\mapWindsBackEnd\public\resources\final.csv")
df.to_sql('mapwinder', engine, if_exists='replace', index='True')

