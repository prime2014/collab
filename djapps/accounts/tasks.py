from config.celery_app import app as celery_app
from django.core.mail import send_mail
from django.template.loader import render_to_string
from djapps.accounts.generate_otp import generate_otp
from django.conf import settings



# schedule, _ = CrontabSchedule.objects.get_or_create(
#     minute="46",
#     hour="19",
#     day_of_week="*",
#     day_of_month="*",
#     month_of_year="*"
# )


@celery_app.task(serializer="json")
def send_authentication_email(account:dict):
    otp_code = generate_otp()
    first_name = account.get('first_name')
    last_name = account.get('last_name')

    my_context = {"first_name": first_name, "last_name": last_name, "otp_code": otp_code}

    msg_body = render_to_string("email/email.html", context=my_context)
    try:
        send_mail(
            "Uncensored Authentication Email",
            msg_body,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[account.get("email")],
            fail_silently=True,
            html_message=msg_body
        )
    except BaseException:
        raise "There was a problem sending your account authentication mail"
