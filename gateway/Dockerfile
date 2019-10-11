# Use node 12 base
FROM node:12

# Set working directory
WORKDIR /usr/src/server

# Copy build
COPY ./package.json ./
COPY ./build ./build/

RUN npm install

# Expose port
EXPOSE 3000

# Start server
CMD [ "npm", "run", "serve" ]

# TODO: Fix pre-build
# Set node version
# FROM node:12

# # Set working directory
# WORKDIR /usr/src/server

# # Copy application manifest
# COPY package.json ./
# COPY package-lock.json ./

# # Install dependencies
# RUN npm install

# # Copy source
# COPY . .

# # Expose port
# EXPOSE 3000

# # Start server
# CMD [ "npm", "run", "prod" ]
