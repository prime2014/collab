FROM node:16.14.2

WORKDIR /frontend

RUN apt-get update \
    # install dependencies for cypress
    && apt-get install -y libgtk2.0-0 libgtk-3-0 libgbm-dev libnotify-dev libgconf-2-4 libnss3 libxss1 libasound2 libxtst6 xauth xvfb

COPY ./frontend/package.json /frontend/

RUN npm install -g npm@9.1.1 \
    && npm install

COPY --chown=1000:1000 ./frontend/ /frontend/
