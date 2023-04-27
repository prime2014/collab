from config.celery_app import app as celery_app
from pathlib import Path
import secrets
import time
import math
from vidgear.gears import WriteGear, VideoGear
from django.core.files import File
import logging
import os
from vidgear.gears import WriteGear
from tinytag import TinyTag
import pathlib
import os.path
from multiprocessing import Process, cpu_count
from typing import List
from djapps.posts.models import Comments
from djapps.posts.serializers import CommentSerializer



logging.basicConfig(format="%(asctime)s %(module)s %(levelname)s %(message)s", encoding="utf8", level=logging.INFO)

logger = logging.getLogger(__name__)



@celery_app.task()
def send_transcoded_videos(file_path):

    logger.info(f"THE FILE IS {file_path}")


    filename = secrets.token_urlsafe(10) + "_" + str(int(time.time()))

    root_dir = os.path.dirname(os.path.dirname(os.path.dirname(pathlib.Path(__file__))))

    output_file = str(f"{filename}.webm")

    writer = WriteGear(output=output_file, logging=True)

    ffmpeg_command_to_save_video = [
        "-i",
        file_path,
        "-vcodec",
        "vp9",
        "-r",
        "30",
        output_file,
    ]

    writer.execute_ffmpeg_cmd(ffmpeg_command_to_save_video)
        # safely close writer
    writer.close()
    return output_file



@celery_app.task()
def save_comments(id: int)->Comments:
    pass
