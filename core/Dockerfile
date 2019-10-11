FROM alfred-base

# Set working directory
WORKDIR /usr/src/alfred/

# Copy requirements manifest and makefile
COPY Makefile ./

# Copy bot
COPY ./core ./core/
COPY ./models ./models/

# Expose ports
EXPOSE 5005

# Start server processes
CMD [ "make", "core-server" ]
