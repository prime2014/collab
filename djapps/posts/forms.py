from django import forms
from rest_framework.serializers import Serializer
from rest_framework import serializers
from rest_framework.validators import ValidationError
from vidgear.gears import WriteGear, VideoGear, StreamGear
import mimetypes
import logging
import secrets
from pathlib import Path
import math
import time
from django.core.files.uploadhandler import TemporaryFileUploadHandler
import skvideo.io
import skvideo.datasets



logging.basicConfig(format="%(asctime)s %(module)s %(levelname)s %(message)s", encoding="utf8", level=logging.INFO)

logger = logging.getLogger(__name__)

def write_processed_video(stream):
    random_name = secrets.token_urlsafe(16) + str(math.ceil(time.time()))
    output_params = {
          "-vcodec": "libx264",
          "-crf": 0,
          "-preset": "fast",
    }
    writer = WriteGear(output_filename=f"{random_name}.mp4", compression_mode=True, logging=True, **output_params)

    frame = stream.read()

    while frame.size:
        if not frame.size:
            break
        writer.write(frame)
        yield time.time()
    stream.stop()
    writer.close()


class VideoSerializer(Serializer):
    file = serializers.FileField(allow_empty_file=False)

    # def validate(self, attrs):
    #     video = attrs.get("file")
    #     request = self.context.get("request")
    #     ext = mimetypes.guess_type(video)[0]
    #     if ext in file_types:
    #         return True
    #     else:
    #         raise ValidationError(detail=f"Invalid file type '{ext}' cannot be parsed")

    def create(self, validated_data):

        request = self.context.get("request")
        file = validated_data
        try:
            path= request.FILES["file"].temporary_file_path()
            random_name = secrets.token_urlsafe(16) + str(math.ceil(time.time()))

            output_params = {
                "-vcodec": "libx264",
                "-acodec": "aac",
                "-crf": 28,
                "-preset": "veryfast",
                "-input_framerate": 24,
                "-bufsize": "2500k",
                "-ac": 2,
                "-b:a": "128k"
                # "-output_dimensions": (640, 480)
            }
            stream = VideoGear(source=path, logging=True, resolution=(630, 360))

            writer = WriteGear(output_filename=f"{random_name}.mp4",compression_mode=True, logging=True, **output_params)

            while True:
                frame = stream.read()

                if frame is None:
                    break
                writer.write(frame)
            stream.stop()
            writer.close()
            return path
        except IOError:
            raise IOError()


