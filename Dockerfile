FROM ubuntu:18.04

# Install iRODS iCommands.
RUN apt-get update && \
    apt-get install -y wget gnupg2 lsb-release && \
    wget -qO - https://packages.irods.org/irods-signing-key.asc | apt-key add - && \
    echo "deb [arch=amd64] https://packages.irods.org/apt/ $(lsb_release -sc) main" | tee /etc/apt/sources.list.d/renci-irods.list && \
    apt-get update && \
    apt-get install -y irods-icommands && \
    apt-get install ldap-utils

# Install NodeJS.
RUN wget -qO - https://deb.nodesource.com/setup_16.x | bash - && \
    apt-get install -y nodejs

# Copy the source to the build directory.
COPY . /opt/dev/portal2
WORKDIR /opt/dev/portal2
ENV PORTAL2_DIR=/opt/dev/portal2
COPY portal2 /usr/bin

# Install the app.
RUN npx browserslist@latest --update-db && \
    npm install && \
    npm run build

# Expose the HTTP and WS listen ports.
EXPOSE 3000
EXPOSE 3001

# Set the entrypoint.
ENTRYPOINT ["portal2"]
