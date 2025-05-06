import mysql.connector
import csv

host = '106.54.80.211'
user = 'root'
password = 'desay_12345'
database = 'workship'


def fetch_courses(member_id):
    # Connect to the MySQL database
    conn = mysql.connector.connect(
        host=host,
        user=user,
        password=password,
        database=database
    )
    cursor = conn.cursor()

    # SQL query to fetch courses for the given member_id, including coach and court names
    query = """
    SELECT c.description, c.course_time, c.start_time, c.end_time, c.duration,
           co.name AS coach_name, ct.name AS court_name,c.course_type
    FROM course c
    JOIN course_member cm ON c.id = cm.course_id
    JOIN coach co ON c.coach_id = co.coach_id
    JOIN court ct ON c.court_id = ct.id
    WHERE cm.member_id = %s
    """
    
    cursor.execute(query, (member_id,))
    courses = cursor.fetchall()

    # Close the database connection
    cursor.close()
    conn.close()

    return courses

def save_courses_to_file(courses, filename='courses_output.csv'):
    # Save the courses to a CSV file
    with open(filename, mode='w', newline='') as file:
        writer = csv.writer(file)
        writer.writerow(['Description', 'Course Time', 'Start Time', 'End Time', 'Duration', 'Coach Name', 'Court Name','课程类型'])  # Updated Header
        writer.writerows(courses)

if __name__ == "__main__":
    member_id = 918
    courses = fetch_courses(member_id)
    save_courses_to_file(courses)
    print(f"Fetched {len(courses)} courses for member_id {member_id} and saved to 'courses_output.csv'.")
