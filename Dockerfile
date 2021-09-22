FROM node:14-bullseye

# Copy the source to the build directory.
COPY . /opt/dev/portal2
WORKDIR /opt/dev/portal2
ENV PORTAL2_DIR=/opt/dev/portal2
COPY portal2 /usr/bin

# Install the app.
RUN npm install

# Expose the HTTP and WS listen ports.
EXPOSE 3000
EXPOSE 3001

# Set the entrypoint.
ENTRYPOINT ["portal2"]
