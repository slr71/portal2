FROM ubuntu:18.04

WORKDIR /usr/src/app

RUN apt-get update 
RUN DEBIAN_FRONTEND=noninteractive apt-get install -y \
    wget curl \
    expect \
    python3 python3-pip \
    gettext-base \
    libnss-ldap libpam-ldap ldap-utils

# Install iCommands
RUN wget -q https://files.renci.org/pub/irods/releases/4.1.12/ubuntu14/irods-icommands-4.1.12-ubuntu14-x86_64.deb
RUN apt-get -y install ./irods-icommands-4.1.12-ubuntu14-x86_64.deb
RUN rm ./irods-icommands-4.1.12-ubuntu14-x86_64.deb

# Configure iCommands
ARG IRODS_ENVIRONMENT_FILE
COPY $IRODS_ENVIRONMENT_FILE .
ENV IRODS_ENVIRONMENT_FILE /usr/src/app/$IRODS_ENVIRONMENT_FILE
ARG IRODS_PASSWORD
COPY iinit.expect .
RUN expect ./iinit.expect

# Install Python modules
COPY requirements.txt .
RUN pip3 install -r requirements.txt

# Install Portal2 scripts
COPY bisque_create_user.py .





