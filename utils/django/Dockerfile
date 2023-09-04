FROM python:3.11.4-slim

ENV PYTHONBUFFERED 1
ENV PYTHONDONTWRITEBYTECODE 1

WORKDIR /collab

RUN apt-get update \
    # dependencies for building python packages
    && apt-get install -y build-essential \
    && apt-get install -y python3-dev \
    # install command
    && apt-get install -y software-properties-common \
    # installing gdal
    && apt-get install -y gdal-bin \
    # install gdal python libraries
    && apt-get install -y libgdal-dev \
    # expose environment variables
    && export CPLUS_INCLUDE_PATH=/usr/include/gdal \
    && export C_INCLUDE_PATH=/usr/include/gdal \
    # install imagemagick for moviepy library
    && apt-get install -y imagemagick \
    # install ffmpeg
    && apt-get install -y ffmpeg \
    # install ffprobe
    # && apt-get install -y ffprobe \
    # install crontab
    && apt-get install -y cron \
    # psycopg2 dependencies
    && apt-get install -y libpq-dev \
    # Translations dependencies
    && apt-get install -y gettext \
    # versatileimage dependencies
    && apt-get install -y libmagic-dev \
    # postgres client install
    && apt-get install -f -y postgresql-client \
    # cleaning up unused files
    && apt-get purge -y --auto-remove -o APT::AutoRemove::RecommendsImportant=false \
    && rm -rf /var/lib/apt/lists/

COPY --chown=1000:1000 requirements.txt /collab/

RUN python -m pip install --upgrade pip  \
    && apt-get update \
    && apt install -y curl \
    && useradd -ms /bin/bash 1000 \
    && pip install -r requirements.txt

RUN apt install netcat-traditional

COPY --chown=1000:1000 . /collab/

ENTRYPOINT [ "./entrypoint.sh" ]

HEALTHCHECK --interval=60s --timeout=30s --start-period=5s --retries=3 \
              CMD curl http://127.0.0.1:8000/api/accounts/status/ || exit 1

USER 0
