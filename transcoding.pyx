import os
import time


def generate_thumbnail(file_path, name, secret_token):
    while not os.path.exists(f"{file_path}"):
        time.sleep(4)

    os.system(f"ffmpeg -i {file_path} -ss 00:00:05 -frames:v 1 ./media/thumbnails/{name}_{secret_token}.jpg")
    return "./media/thumbnails/{name}_{secret_token}.jpg"

def transcode_video_720(file_path, name, secret_token):
    while not os.path.exists(f"{file_path}"):
        time.sleep(4)

    os.system(f"ffmpeg -i {file_path} -r 25 -crf 30 -vf scale=-iw*a:720 -c:v libvpx-vp9 -b:v 3M -preset veryfast ./media/videos/720/{name}_{secret_token}_720.webm")
    return;
