import redis
import time




with redis.Redis(host="redis", port=6379, db=1) as conn:
    data = conn.xrange("iotstream", "-", "+")
    print(data)
