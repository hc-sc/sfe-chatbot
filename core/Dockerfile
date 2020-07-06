FROM sfe/chatbot-base:1.0.0 as models

WORKDIR /usr/src/alfred/

COPY Makefile .
COPY ./models ./models/


# -----------------------------

FROM models as core

WORKDIR /usr/src/alfred/

# Copy requirements manifest and makefile
COPY Makefile ./

# Copy bot
COPY ./core ./core/

# Expose ports
EXPOSE 5005

# Start server processes
CMD [ "make", "core-server" ]
