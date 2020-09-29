FROM ubuntu:18.04
MAINTAINER Matt Bomhoff <mbomhoff@email.arizona.edu>

WORKDIR /usr/src/app

RUN apt-get update 
RUN DEBIAN_FRONTEND=noninteractive apt-get install -y \
    wget curl \
    expect \
    python3 python3-pip \
    ssmtp \
    gettext-base \
    libnss-ldap libpam-ldap ldap-utils

# Configure LDAP
COPY ldap.conf /etc/ldap

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

# Configure sSMTP and copy email templates
ARG EMAIL_SERVER
ARG EMAIL_USER 
ARG EMAIL_PASS
ARG EMAIL_HOSTNAME
RUN echo "mailhub=$EMAIL_SERVER\nAuthUser=$EMAIL_USER\nAuthPass=$EMAIL_PASS\nhostname=$EMAIL_HOSTNAME\nUseSTARTTLS=YES" > /etc/ssmtp/ssmtp.conf
ADD $EMAIL_TEMPLATES_PATH $WORKDIR/templates

# Install Python modules
COPY requirements.txt .
RUN pip3 install -r requirements.txt

# Install Portal2 scripts
COPY bisque_create_user.py .





