FROM python:3.10-slim-buster

WORKDIR /api

RUN apt update \
    # dependencies for building python packages
    && apt-get install -y build-essential \
    && apt-get install ffmpeg libsm6 libxext6 -y

COPY --chown=1000:1000 ./api/requirements.txt /api/

RUN python -m pip install --upgrade pip \
    && pip install -r requirements.txt

COPY --chown=1000:1000 ./api/* /api/

USER 1000
