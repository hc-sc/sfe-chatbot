# Create base image for alfred core and actions containers
# Use python 3.7 image as foundation
FROM python:3.7

# Install dependencies
RUN pip3 install rasa fuzzywuzzy pandas python-benedict requests

# Download spacy libs (TODO: comment out/skip if not using spacy)
# RUN make spacy-link

COPY entrypoint.sh /usr/local/bin/

# https://stackoverflow.com/questions/38905135/why-wont-my-docker-entrypoint-sh-execute
RUN chmod +x /usr/local/bin/entrypoint.sh
ENTRYPOINT [ "/usr/local/bin/entrypoint.sh" ]
