from .report_query import make_query
from .send_email import send_email


def report_pipeline(email, cars_number):
    try:
        query_data = make_query(cars_number)
    except Exception as e:
        print(e)
        print("Couldn't make the query")

    try:
        send_email(email=email, subject="FARM Cars Report", HTMLcontent=query_data)
    except Exception as e:
        print(e)
