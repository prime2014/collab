# INTRODUCTION


## TABLE OF CONTENTS

- [OVERVIEW](#overview)
- [REQUIREMENTS](#requirements)
- [PROJECT STRUCTURE](#project-structure)
- [INSTALLATION](#installation)
- [STARTING THE PROJECT](#starting-the-project)
- [RUNNING TESTS](#running-tests)
- [TERMINATING THE PROJECT](#terminating-the-project)

### OVERVIEW
This project is a minimalist __video sharing platform__ with powerful capabilities:\
    * User upload of pre-recorded videos
    * A live-streaming platform with video on demand capabilities
    * A podcast platform
    * Recommender system for video recommendation
    * video sharing
The services offered are similar to [youtube](https://youtube.com) streaming capabilities.


### REQUIREMENTS
The requirements to run the project on a local machine are\
    - __DOCKER__:The application is fully containerized with customized *docker* images and docker-compose local yaml file
                 with configurations of containers and images. You can download and install docker on your local host at
                 [docker](https://www.docker.com/products/docker-desktop/)\
    - __GIT__:This is solely for cloning the project and for anyone to extend the capabilities of the application.\

Some of the services offered on the docker-compose are\
    - Redis Stack
    - Elasticsearch
    - django
    - celery
    - postgres
    - pgbouncer
    - React
    - fastapi


### PROJECT STRUCTURE
The setup below represents the project structure
```
├── README.md
├── api ----------------------------------> fastapi directory
│   ├── __pycache__
│   ├── main.py
│   ├── media
│   ├── my_r10_skills.webm
│   └── requirements.txt
├── config -------------------------------> django main project directory
│   ├── __init__.py
│   ├── __pycache__
│   ├── asgi.py
│   ├── celery_app.py
│   ├── settings
│   ├── urls.py
│   └── wsgi.py
├── djapps -------------------------------> django apps
│   ├── accounts
│   ├── notifications
│   ├── posts
│   └── templates
├── entrypoint.sh
├── env
│   └── env.example
├── frontend ------------------------------> React project directory
│   ├── README.md
│   ├── node_modules
│   ├── package-lock.json
│   ├── package.json
│   ├── public
│   └── src
├── insights ------------------------------> directory for redisinsight
│   ├── bulk_operation
│   ├── dropbox
│   ├── profiler_logs
│   ├── queries.log
│   ├── redisinsight.db
│   ├── redisinsight.log
│   └── rsnaps
├── local.yml
├── manage.py
├── media ----------------------------------> directory for media files
│   ├── profile
│   ├── thumbnails
│   └── videos
├── requirements.txt
├── rod
│   └── dump.rdb
├── static
├── tensors
│   └── main.py
└── utils -----------------------------------> directory for various custom docker images
    ├── django
    ├── fastapi
    ├── kibana
    ├── proxy
    └── react
```

### INSTALLATION
To install the project\
    1 First clone the repository
    2. Navigate to the project directory and run the  following command
        ```
        docker-compose -f local.yml up --build
        ```

The previous command will build the project and install various packages defined in the dockerfiles


### STARTING THE PROJECT
You need to create an .env file in the root directory of the project and the run the folllowing command to copy the contents of the file at env/env.example to the .env file
```
    # navigate to the project directory
    cd ./collab

    # copy the contents of the env.example file to .env file
    cp ./env/env.example .env

    # create a .env in ./frontend/
    # then copy the following variables to it
    REACT_APP_API_URL=http://127.0.0.1:8000/api
    REACT_APP_STREAMING_API=http://127.0.0.1:8081
```

To start the project run the following code
```
    # navigate to the project directory
    cd ./collab

    # use docker compose to start the project
    docker-compose -f local.yml up

    # load the react url on the browser
    http://localhost:3000

```

### RUNNING TESTS
To run the django tests, run the following commands
```
    # navigate to the root of the project
    cd ./collab

    # use docker to run pytest
    docker-compose -f local.yml run --rm django pytest
```
To run react tests
```
    # navigate to the root of the project
    cd ./collab

    # use docker to run jest
    docker-compose -f local.yml run --rm react npm run jest
```

### TERMINATING THE PROJECT
To terminate the project press `CTRL + C`\
or you can open a new terminal and run the following command
```
    # navigate to the project directory
    cd ./collab

    # run docker stop to terminate the project gracefully
    docker stop $(docker ps -q) # if on windows run this command on windows powershell
```
