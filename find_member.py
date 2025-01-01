import pymysql
import pandas as pd
from datetime import datetime

host = '106.54.80.211'
user = 'root'
password = 'desay_12345'
database = 'workship'
connection = pymysql.connect(host=host, port=3306, user=user, password=password, database=database)

# # Execute the query
# query = """
# SELECT *
# FROM prepaid_card
# WHERE (times_count > 0 OR annual_count > 0 OR rest_charge > 0 ) and court like '%桐梓林%'
# """

# with connection.cursor() as cursor:
#     cursor.execute(query)
#     result = cursor.fetchall()
#     columns = [i[0] for i in cursor.description]

# # Convert the result to a pandas DataFrame
# df = pd.DataFrame(result, columns=columns)

# # Select only name and number columns if they exist
# if 'name' in df.columns and 'number' in df.columns:
#     df = df[['name', 'number']]
# else:
#     print("Columns 'name' and 'number' not found. Available columns:", df.columns)

# pd.set_option('display.max_rows', None)
# pd.set_option('display.max_columns', None)
# pd.set_option('display.width', None)
# pd.set_option('display.max_colwidth', None)

# # Display the results
# print(df.to_string(index=False))

# # Close the connectionf
# connection.close()
 # Step 1: Query the course table
current_year = datetime.now().year
start_of_year = f"{current_year}-01-01"


with connection.cursor() as cursor: 
    query1 = """
    SELECT id
    FROM course
    WHERE  coach_id = 2 and start_time >= %s
    """
    # 8 李佳奇  32 唐斯月   24 杜江
    cursor.execute(query1,(start_of_year))
    course_ids = [row[0] for row in cursor.fetchall()]

    # Step 2: Get member_ids from course_member table
    query2 = f"""
    SELECT DISTINCT member_id
    FROM course_member
    WHERE course_id IN ({','.join(map(str, course_ids))})
    """
    cursor.execute(query2)
    member_ids = [row[0] for row in cursor.fetchall()]

    # Step 3: Get name and number from prepaid_card table
    query3 = f"""
    SELECT name, number
    FROM prepaid_card
    WHERE id IN ({','.join(map(str, member_ids))}) and (times_count > 0 OR annual_count > 0 OR rest_charge > 0 ) 
    """
    cursor.execute(query3)
    results = cursor.fetchall()

    # Convert results to DataFrame
    df = pd.DataFrame(results, columns=['Name', 'Number'])

    pd.set_option('display.max_rows', None)
    pd.set_option('display.max_columns', None)
    pd.set_option('display.width', None)
    pd.set_option('display.max_colwidth', None)
    # Print results without index
    print(df.to_string(index=False))
    # print(df)

