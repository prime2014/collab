#!/bin/bash

# delay django until database port is up

echo "Checking if the postgres database is ready"

check_database(){

   scan_port=`pg_isready -d ${POSTGRES_DB} -h ${POSTGRES_HOST} -p ${POSTGRES_PORT} -U ${POSTGRES_USER} 1>/dev/null`

   while [ "$?" -ne 0 ]
   do
      echo "Waiting to connect to the database"
      sleep 4
   done
   echo "Database is online"
   return
}

check_database

exec "$@"
