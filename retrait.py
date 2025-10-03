import pymysql

# 数据库连接配置
config = {
    'host': '106.54.80.211',
    'port': 3306,  # 默认3306'
    'user': 'root',
    'password': 'desay_12345',
    'database': 'workship'
}
# 创建数据库连接
connection = pymysql.connect(**config)

# SQL 查询
sql_query = """

SELECT 
    c.*,
    DATE_FORMAT(c.charged_time, '%Y-%m-%d %H:%i:%s') as charged_time_str,
    pc.name, 
    pc.court
FROM charge c
JOIN prepaid_card pc ON c.prepaid_card_id = pc.id
WHERE c.charged_time > '2023-12-31' 
  AND c.description LIKE '%退%'

"""
#   pc.name AS prepaid_card_name,
#     pc.court AS prepaid_card_court
# RIGHT JOIN 
#     prepaid_card pc ON c.prepaid_card_id = pc.id
try:
    with connection.cursor() as cursor:
        cursor.execute(sql_query)

        # 获取所有结果
        results = cursor.fetchall()

        # 打印结果
        for row in results:
            new_row = list(row)
            new_row[3] = row[3].strftime('%Y-%m-%d %H:%M:%S')
            print(new_row)

        # 打印总行数
        print(f"\nTotal rows: {len(results)}")

finally:
    connection.close()