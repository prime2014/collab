FROM docker.elastic.co/kibana/kibana:7.11.0

USER 0

WORKDIR /myapp

RUN mkdir ./myvol \
    && sed -i 's/mirrorlist/#mirrorlist/g' /etc/yum.repos.d/CentOS-Linux-* \
    && sed -i 's|#baseurl=http://mirror.centos.org|baseurl=http://vault.centos.org|g' /etc/yum.repos.d/CentOS-Linux-* \
    && yum install -y nc

COPY --chown=1000:1000 ./utils/kibana/entrypoint.sh /myapp/


VOLUME [ "/myvol" ]

ENTRYPOINT [ "./entrypoint.sh" ]
