from rest_framework.throttling import BaseThrottle
from tinytag import TinyTag


class VideoLengthThrottle(BaseThrottle):
    def allow_request(self, request, view):
        video_file = TinyTag.get(request.FILES.get('file').temporary_file_path())
        return video_file.duration < 900
