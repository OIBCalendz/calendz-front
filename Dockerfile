# Node latest LTS 12.18.2 with alpine
# (a lightweight distribution)
FROM node:18.13.0-alpine
LABEL maintainer="Calendz. <https://calendz.app/>"

# creates a directory for the app
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Update NPM
RUN npm install -g npm@9.5.1

# install the app
COPY package*.json ./
RUN npm install

# Fix npm rights
RUN chown -R 1000:1000 "/root/.npm"

# bundle all source code
COPY . .
