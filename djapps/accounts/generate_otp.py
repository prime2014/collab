import pyotp
import datetime
import time

data = "I5SXE4TJNVQW4ZDFOJUW4ZY="



def generate_otp()-> str:
    totp = pyotp.TOTP(data, interval=600)
    return totp.now()



def verify_otp(token)-> bool:
    totp = pyotp.TOTP(data, interval=600)
    return totp.verify(token)


if __name__ == "__main__":
    result = generate_otp()
    print(result)
    print(isinstance(result, str))
    time.sleep(60)
    print(verify_otp(result))
