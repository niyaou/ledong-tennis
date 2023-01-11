#!/usr/bin/env python3
import pandas as pd

import pymysql
conn =pymysql.connect(host="www..cn",port=3306,user="1",passwd="1",db="workship" )
cursor=conn.cursor()
sql = "INSERT INTO  prepaid_card (name, number,court,rest_charge,times_count,annual_count,annual_expire_time) VALUES (%s,%s,%s,%s,%s,%s,%s)"
#读取工作簿和工作簿中的工作表
writer_1=pd.read_excel('C:\\Users\\niyaou\\Desktop\\客户.xlsx',sheet_name='Sheet1')
data_frame= writer_1.values
for con in data_frame:
    print(con)
    val=(con[0],con[1],con[2],con[3],con[4],con[5],con[6])
    cursor.execute(sql, val)

conn.commit()

cursor.close()
conn.close()