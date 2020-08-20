FROM sfe/chatbot-base:1.0.0

# Set working directory
WORKDIR /usr/src/alfred/

# Copy requirements manifest and makefile
COPY Makefile ./

# Copy bot
# RUN mkdir /usr/src/alfred/data
# COPY ./data/acronyms.csv /usr/src/alfred/data/
# COPY ./data/gedsOpenData.csv ./data/
# COPY ./actions /usr/src/alfred/actions

# Expose ports
EXPOSE 5055

# Start server processes
CMD [ "make", "action-server" ]
