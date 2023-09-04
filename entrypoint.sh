#!/bin/bash

# delay django until database port is up

echo "Checking if the postgres database is ready"

PGBOUNCER="pgbouncer"
PORT=6432

check_database(){

   scan_port=`pg_isready -d ${POSTGRES_DB} -h ${POSTGRES_HOST} -p ${POSTGRES_PORT} -U ${POSTGRES_USER} 1>/dev/null`

   while [ "$?" -ne 0 ]
   do
      echo -e "\e[1;34m Waiting to connect to the database \e[0m"
      sleep 4
   done
   echo -e "\e[0;32m Database is online \e[0m"
   return
}


check_pgbouncer(){

    scan=`nc -w 180s ${PGBOUNCER} ${PORT} > /dev/null`

    while [ "$?" -ne 0 ]
    do
        echo -e "\e[0;31m Pgbouncer is not alive yet \e[0m"
        sleep 5
    done
    echo -e "\e[0;32m Pgbouncer connection established \e[0m"

    return
}

check_database
check_pgbouncer

exec "$@"
