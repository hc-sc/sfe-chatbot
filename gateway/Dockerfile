###
# Base
###

FROM node:12 as base

# Install dependencies in temp folder (forces caching until change in package)
COPY ./package.json /tmp/package.json
RUN cd /tmp && npm install

# Create app directory and transfer dependencies
WORKDIR /home/app

RUN mv /tmp/node_modules /home/app
RUN mv /tmp/package.json /home/app/package.json

###
# Application
###

FROM base as application

WORKDIR /home/app

# Copy source
COPY ./src /home/app/src
COPY ./webpack.gateway.prod.js .
COPY ./webpack.gateway.common.js .
COPY ./webpack.server.prod.js .
COPY ./webpack.server.common.js .
COPY ./babel.config.js .

# Build app and remove source
RUN npm run build:prod
RUN rm -rf /home/app/src

###
# Run
###

FROM application as sfe-gateway

WORKDIR /home/app

RUN mkdir /home/app/build/logs
RUN chown -Rv node /home/app/build/logs

# Set and export port value
ENV PORT=3000
EXPOSE 3000

# Change from root to node
USER node

# Start server
CMD [ "npm", "run", "serve" ]
