from django.core.files.uploadhandler import FileUploadHandler
import jwt
from config.settings.base import env
from rest_framework.exceptions import PermissionDenied
from django.utils import timezone
from datetime import timedelta, datetime
import time
from rest_framework.response import Response
from rest_framework import status
import logging
from django.core.cache import cache
import io
from django.core.files.temp import NamedTemporaryFile
from vidgear.gears import VideoGear, WriteGear, CamGear
from deffcode import Sourcer
import json


logging.basicConfig(format="%(asctime)s %(module)s %(levelname)s %(message)s", encoding="utf8", level=logging.INFO)

logger = logging.getLogger(__file__)

SECRET_KEY = env("SECRET_KEY")


# 360p 480p 720p 1040p

def validate_jwt_token(function):
    def wrapper(self, request, *args, **kwargs):
        query_params = dict(request.query_params)
        token = query_params.get("upload_token")
        try:
            if token and isinstance(token, list) and len(token):
                deserialized = jwt.decode(token[0], SECRET_KEY, algorithms=["HS256"])
                if deserialized.get("x_trust") is not request.user.id:
                    raise PermissionDenied(detail=f"user {request.user} is not authorized to use this token", code=status.HTTP_403_FORBIDDEN)
            else:
                raise PermissionDenied(detail="You do not have the right permissions to upload a video", code=status.HTTP_403_FORBIDDEN)

        except PermissionDenied:
            raise PermissionDenied()
        else:
            return function(self, request, *args, **kwargs)
    return wrapper


def video_processing(file: str):
    stream = VideoGear(source=file, resolution=(1280,720)).start()

    # retrieve framerate from CamGear Stream and pass it as `-input_framerate` parameter
    output_params = {
        "-vcodec": "libx264",
        "-input_framerate": stream.framerate,
        "-r": 30,
        "-crf": 20,
        "-preset": "ultrafast",
        "-s": "1280x720",
        "-aspect": "16:9",
    }

    ffmpeg_command_to_save_audio = [
        "-y",
        "-i",
        file,
        "/tmp/output_audio.aac",
    ]

    writer = WriteGear(output_filename="/tmp/videostream.mp4", **output_params, logging=True, compression_mode=True)

    writer.execute_ffmpeg_cmd(ffmpeg_command_to_save_audio)

    while True:
        # read frames from stream
        frame = stream.read()
        # check for frame if Nonetype
        if frame is None:
            break

        writer.write(frame)


    stream.stop()
    writer.close()
    time.sleep(10)

    input_audio = "/tmp/output_audio.aac"
# format FFmpeg command to generate `Output_with_audio.mp4` by merging input_audio in above rendered `Output.mp4`
    ffmpeg_command = [
        "-y",
        "-i",
        "/tmp/videostream.mp4",
        "-i",
        input_audio,
        "-c:v",
        "copy",
        "-c:a",
        "copy",
        "-map",
        "0:v:0",
        "-map",
        "1:a:0",
        "-shortest",
        "/collab/media/videos/720/output_with_audio.mp4",
    ]  # `-y` parameter is to overwrite outputfile if exists

    # execute FFmpeg command
    writer.execute_ffmpeg_cmd(ffmpeg_command)


if __name__ == "__main__":
    video_processing("/collab/media/videos/default/ronaldinho_goals_that_shocked_the_world_h264_33979.mp4")
