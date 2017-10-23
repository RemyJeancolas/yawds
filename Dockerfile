FROM debian:jessie-slim

# Install system dependencies
RUN apt-get update && apt-get dist-upgrade -y && apt-get install -y curl sudo
RUN curl -sL https://deb.nodesource.com/setup_6.x | bash -
RUN sudo apt-get install -y nodejs

# Create user for application
RUN useradd --create-home -s /bin/bash yawds

# Setup application
RUN mkdir /code && chown -R yawds:yawds /code
WORKDIR /code
EXPOSE 8080
USER yawds

# Install application dependencies
COPY package.json /code/
RUN npm install

# Copy application code
COPY src /code/

# Build application
RUN npm run build

# Start application
CMD ["npm",  "start"]
