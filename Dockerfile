# Create base image for alfred core and actions containers
# Use latest rasa image as foundation
FROM rasa/rasa:latest-full

# Copy requirements manifest and makefile
COPY requirements.tensorflow.txt ./requirements.txt
COPY Makefile .

# Install dependencies
RUN pip3 install -r requirements.txt

# Download spacy libs (TODO: comment out/skip if not using spacy)
RUN make spacey-link

COPY entrypoint.sh /usr/local/bin/

# https://stackoverflow.com/questions/38905135/why-wont-my-docker-entrypoint-sh-execute
RUN chmod +x /usr/local/bin/entrypoint.sh
ENTRYPOINT [ "/usr/local/bin/entrypoint.sh" ]
