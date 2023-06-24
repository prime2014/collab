# To run:
# docker build -t redoc .
# docker run -it --rm -p 80:80 -e SPEC_URL='http://localhost:8000/swagger.yaml' redoc
# Ensure http://localhost:8000/swagger.yaml is served with cors. A good solution is:
# npm i -g http-server
# http-server -p 8000 --cors

FROM node:12-alpine

RUN apk update && apk add --no-cache git

# Install dependencies
WORKDIR /docs
COPY package.json package-lock.json /docs/
RUN npm ci --no-optional --ignore-scripts

# copy only required for the build files
COPY src /build/src
COPY webpack.config.ts tsconfig.json custom.d.ts  /build/
COPY config/webpack-utils.ts /build/config/
COPY typings/styled-patch.d.ts /build/typings/styled-patch.d.ts

RUN npm run bundle:standalone

FROM node:16.14.2

WORKDIR /docs

RUN apt-get update \
    # install http-server
    && npm i -g http-server

COPY --chown=1000:1000 ./docs/package.json /docs/

RUN npm install

COPY ./docs/* /docs/

EXPOSE 8080

USER 1000



