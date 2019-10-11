.START: clean train-nlu train-core core-server
.PHONY: clean train-nlu train-core cmdline
.DOCKER-COMPOSE: clean train gateway-build compose-down compose-build compose-up
.DOCKER-REFRESH: compose-down compose-build compose-up

TEST_PATH=./

clean:
	find . -name '*.pyc' -exec rm -f {} +
	find . -name '*.pyo' -exec rm -f {} +
	find . -name '*~' -exec rm -f  {} +
	rm -rf build/
	rm -rf dist/
	rm -rf *.egg-info
	rm -rf docs/_build

spacey-link:
	python -m spacy download en_trf_bertbaseuncased_lg

train-lookup:
	python data/lookupTableGenerators.py

train-nlu:
	python core/train.py train_nlu

train-dialogue:
	python core/train.py train_dialogue

train:
	python core/train.py train_all

cmdline:
	python -m rasa_core.run -d models/current/dialogue -u models/current/nlu --endpoints core/endpoints.yml

core-server:
	python -m rasa_core.run -d models/default/dialogue -u models/default/nlu -o core_out.log --cors "*" --endpoints core/endpoints.yml --credentials core/credentials.yml --enable_api
	
action-server:
	python -m rasa_core_sdk.endpoint --actions actions

docker-ssh-core:
	-docker exec -it alfred-core /bin/bash

docker-ssh-actions:
	-docker exec -it alfred-actions /bin/bash

docker-ssh-gw:
	-docker exec -it servicegateway /bin/bash

docker-logs:
	-docker logs servicegateway && docker logs alfred-core && docker logs alfred-actions

compose-down:
	-docker-compose down

compose-build:
	-docker-compose build

compose-up:
	-docker-compose up -d actions core gateway

gateway-build:
	-cd gateway && npm run build:prod

help:
	@echo "    clean"
	@echo "        Remove python artifacts and build artifacts."
	@echo "    gateway-build"
	@echo "       Builds gateway application"
	@echo "    train-lookup"
	@echo "        Build entity loopup tables"
	@echo "    train-nlu"
	@echo "        Trains a new nlu model using the projects Rasa NLU config"
	@echo "    train-dialogue"
	@echo "        Trains a new dialogue model using the story training data"
	@echo "    action-server"
	@echo "        Starts the server for custom actions."
	@echo "    cmdline"
	@echo "       This will load the assistant in your terminal for you to chat."
	@echo "    spacey-link"
	@echo "       This will link the local spacey installation and locale."
	@echo "    compose-down"
	@echo "       Stops local alfred containers"
	@echo "    compose-build"
	@echo "       Builds local alfred containers"
	@echo "    compose-up"
	@echo "       Starts local docker containers in detached mode"
	@echo "    .PHONY"
	@echo "       Runs alfred (only) CLI locally"
	@echo "    .START"
	@echo "       Runs alfred (only) REST server locally"
	@echo "    .DOCKER-COMPOSE"
	@echo "       For local docker deployment: Trains model then builds and deploys to local docker"
	@echo "    .DOCKER-REFRESH"
	@echo "       Same as .DOCKER-COMPOSE but skips training process."
