FROM ubuntu:latest
#FROM amazonlinux:latest

# for the Heimdall UI, only needed for the management server
EXPOSE 8087

# common ports for databases
EXPOSE 5432

RUN apt-get -y update && apt-get install -y curl && apt-get install systemd -y
#RUN yum -y install curl
RUN bash -c 'bash <(curl https://s3.amazonaws.com/s3.heimdalldata.com/hdinstall.sh) server'

CMD ["/opt/heimdall/heimdall-entrypoint.sh"]

USER 0
