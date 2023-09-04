from config.celery_app import app as celery_app
import time
import os
import subprocess
import os.path






@celery_app.task()
def save_comments(id: int):
    pass


@celery_app.task()
def generate_thumbnail(name):

    path = os.path.dirname(os.path.dirname(
        os.path.dirname(
            os.path.abspath(__file__)
        )
    ))

    prefix, _ = name.split(".")

    while not os.path.exists(path):
        time.sleep(4)
    file_path = os.path.join(path, "media", "videos", "default", name)
    output_path = os.path.join(path, "media", "thumbnails", f"{prefix}_%01d.png")
    command = "ffmpeg -ss 5 -i %s -frames:v 1  -vf scale=360:-1 %s" % (file_path, output_path)
    result = subprocess.run(command, shell=True, check=True)

    if result.returncode == 0:
        return os.path.join("/media", "thumbnails", f"{prefix}_1.png")
    else:
        return 2



@celery_app.task()
def transcode_720_res(name):
    path = os.path.dirname(os.path.dirname(
        os.path.dirname(
            os.path.abspath(__file__)
        )
    ))

    prefix, _ = name.split(".")
    while not os.path.exists(path):
        time.sleep(4)
    file_path = os.path.join(path, "media", "videos", "default", name)
    output_path = os.path.join(path, "media", "videos", "720", f"{prefix}.webm")
    command = "ffmpeg -i %s -c:v libvpx-vp9 -b:v 2M -an -pass 1 -f webm -y /dev/null && \
               ffmpeg -i %s -vf scale=-1:720,setdar=16/9 -c:v libvpx-vp9 -r 60 -crf 27 -pass 2 -map 0 -c:a libopus -b:a 128k -b:v 2M %s" % (file_path, file_path, output_path)
    result = subprocess.run(command, shell=True, check=True)
    if result.returncode == 0:
        return 0
    else:
        return 2

