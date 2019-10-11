FROM alfred-base

# Set working directory
WORKDIR /usr/src/alfred/

# Copy requirements manifest and makefile
COPY Makefile ./

# Copy bot
COPY ./actions ./actions/
COPY ./data/acronyms.csv ./data/acronyms.csv
COPY ./data/gedsOpenData.csv ./data/gedsOpenData.csv

# Expose ports
EXPOSE 5055

# Start server processes
CMD [ "make", "action-server" ]
