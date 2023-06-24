from fastapi import FastAPI, Request, Response, Header
from typing import List, Dict
from pathlib import Path
from fastapi.middleware.cors import CORSMiddleware
import logging
import io, json
import sys
from fastapi.responses import StreamingResponse, Response, FileResponse
import cv2 as cv
import os
import io
from moviepy.editor import *
import base64
from fastapi.middleware.gzip import GZipMiddleware
import gzip
import json
import mmap
import asyncio





logging.basicConfig(format="%(asctime)s %(module)s %(levelname)s: %(message)s", encoding="utf-8", level=logging.INFO)

logger = logging.getLogger(__file__)


app = FastAPI()

app.add_middleware(GZipMiddleware, minimum_size=1000)


CHUNK_SIZE = 1024*1024
video_path = "./my_r10_skills.webm"


origins = [
    "http://localhost:3000",
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["X-Size"]
)


async def read_video(video_path, end, start):
    try:
        if os.path.exists(video_path):
            pass
        else:
            raise FileNotFoundError()
    except FileNotFoundError:
        message = json.dumps({"detail": "File not found!"})
        raise message
    else:
        with open(video_path, mode="rb") as video:
            with mmap.mmap(video.fileno(), length=(end - start), access=mmap.ACCESS_READ) as m_obj:
                yield m_obj.read(end-start)




@app.get("/")
def root():
    return {"Hello": "world"}


@app.get("/app/video", response_class=FileResponse)
async def play_video(video:str, range: str = Header(None)):
    start, end = range.replace("bytes=", "").split(",")
    start: int = int(start)

    end = int(end) if end else (start + CHUNK_SIZE)
    filesize = str(os.stat(video_path).st_size)


    headers = {
        'Content-Range': f'bytes {str(start)}-{str(end)}/{filesize}',
        'Accept-Ranges': 'bytes',
        'X-Size': f'{filesize}'
    }

    return StreamingResponse(read_video(f"./{video}", end, start), headers=headers, status_code=206, media_type="video/webm")
