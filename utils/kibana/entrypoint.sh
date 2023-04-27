#!/bin/sh


ELASTICSEARCH="elasticsearch"
PORT=9200

check_connectivity(){

    scan=`nc -w 180s ${ELASTICSEARCH} ${PORT} > /dev/null`

    while [ "$?" -ne 0 ]
    do
        echo "ElasticSearch still sleeping"
        sleep 5
    done
    echo "ElasticSearch connection is available"

    return
}

check_connectivity

exec /usr/share/kibana/bin/kibana --allow-root
