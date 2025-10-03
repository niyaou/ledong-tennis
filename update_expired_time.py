import pymysql
import datetime
# 数据库连接配置
config = {
    'host': '106.54.80.211',
    'port': 3306,  # 默认3306'
    'user': 'root',
    'password': 'desay_12345',
    'database': 'workship'
}
print('-----99991-------')
# 创建数据库连接
connection = pymysql.connect(**config)
print('-----0-------')
try:
    with connection.cursor() as cursor:
        print('-----1-------')
        # 查询course表
        # coach_id =14  # 假设你要查询的coach_id
        # court_id =5 # 假设你要查询的coach_id
        sql = "SELECT id,start_time FROM course WHERE  start_time >20240610"
        cursor.execute(sql)
        course_ids = cursor.fetchall()
        
        # 查询course_member表
        member_ids =set()
        print('-----2------')
        for course_id,_date in course_ids:
           
            
            sql = "SELECT member_id FROM course_member WHERE course_id = %s  "
            # print('-----sql------%s'%sql)
            cursor.execute(sql, (course_id,))
            members = cursor.fetchall()
            # print('----members----',(members))
            _time=_date
            _time=_time+datetime.timedelta(weeks=8)
           
            for (member_id,) in members:
                member_ids.add(member_id) 
                # update_query=f" UPDATE prepaid_card SET times_expire_time = {datetime.datetime.strftime(_time,'%Y-%m-%d') } WHERE id = {member_id}"
                update_query=f" UPDATE prepaid_card SET times_expire_time = %s WHERE id = %s"
                # print('---update_query----',update_query)
                cursor.execute(update_query,(datetime.datetime.strftime(_time,'%Y-%m-%d'),member_id))
                connection.commit()
                print('---course----',member_id,_date,_time,update_query)
                
            # break    
            
        # print('-----3------')
        # # 查询prepaid_card表
        # for member_id in member_ids:
        #     sql = "SELECT name, number FROM prepaid_card WHERE id = %s"
        #     cursor.execute(sql, (member_id,))
        #     results = cursor.fetchall()
        #     for result in results:
        #         print("Name:", result[0], "Phone:", result[1])
        # print('-----4------')        

finally:
    connection.close()