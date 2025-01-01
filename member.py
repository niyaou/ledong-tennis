import pymysql
import pandas as pd

host = '106.54.80.211'
user = 'root'
password = 'desay_12345'
database = 'workship'
connection = pymysql.connect(host=host, port=3306,user=user, password=password, database=database)


query_courses = "SELECT id, court_id FROM course"
query_members_courses = "SELECT course_id, member_id FROM course_member"

courses = pd.read_sql_query(query_courses, connection)
members_courses = pd.read_sql_query(query_members_courses, connection)
print('courses',courses)
print('members_courses',members_courses)


# courses = pd.DataFrame({
#     'id': [1, 2, 3],  # 课程ID
#     'court_id': [101, 101, 102]  # 场地ID
# })

# # 假设这是你的会员选课表DataFrame
# members_courses = pd.DataFrame({
#     'course_id': [1, 1, 2, 3, 3],  # 课程ID
#     'member_id': [201, 202, 201, 203, 204]  # 会员ID
# })

# 合并两个DataFrame，基于courses的id和members_courses的course_id
merged = pd.merge(courses, members_courses, left_on='id', right_on='course_id')

# 去重，确保每个会员在每个课程中只计数一次
unique_members = merged.drop_duplicates(subset=['court_id', 'member_id'])

# 按court_id分组，并计算每组的不重复member_id数量
result = unique_members.groupby('court_id')['member_id'].nunique().reset_index(name='unique_member_count')

print(result)