# INTRODUCTION
============================


## TABLE OF CONTENTS
---------------------------
- [OVERVIEW](#overview)
- [REQUIREMENTS](#requirements)
- [PROJECT STRUCTURE](#project-structure)
- [INSTALLATION](#installation)
- [STARTING THE PROJECT](#starting-the-project)
- [TERMINATING THE PROJECT](#terminating-the-project)

### OVERVIEW
This project is a minimalist __video sharing platform__ with powerful capabilities:
    * User upload of pre-recorded videos
    * A live-streaming platform with video on demand capabilites
    * A podcast platform
    * Recommender system for video recommendation
    * video sharing
The services offered are similar to [youtube](https://youtube.com) streaming capabilites.


### REQUIREMENTS
The requirements to run the project on a local machine are:
    - **DOCKER**-The application is fully containerized with customized *docker* images and docker-compose local yaml file
                 with configurations of conainers and images. You can download and install docker on your local host at
                 [docker](https://www.docker.com/products/docker-desktop/)

    - **GIT**- This is solely for cloning the project and for anyone to extend the capabilites of the application.

Some of the services offered on the docker-compose are
    - *Redis Stack*
    - *Elasticsearch*
    - *django*
    - *celery*
    - *postgres*
    - *pgbouncer*
    - *React*
    - *fastapi*


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
To install the project
    1 First clone the repository
    2. Navigate to the project directory and run the  following command
        ```docker-compose -f local.yml up --build```

The previous command will build the project and install various packages defined in the dockerfiles


### STARTING THE PROJECT
To start the project run the following code
```
    docker-compose -f local.yml up
```

### TERMINATING THE PROJECT
To terminate the project press `CTRL + C`
