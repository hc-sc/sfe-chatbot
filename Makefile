.START: clean train core-server
.ACTION: clean train action-server
.SHELL: clean train cmdline
.DOCKER: compose-build compose-up
.DOCKER-REFRESH: compose-up
.DOCKER-CLEAN: clean train compose-build compose-up

clean:
	rm -rf ./models/*.tar.gz	
	rm -rf *.egg-info
	rm -rf docs/_build

spacy-link:
	python -m spacy download en_trf_distilbertbaseuncased_lg

build-lookup:
	python data/lookupTableGenerators.py

train:
	rasa train --data data/ --domain core/domain.yml -c core/config.yml --out models

cmdline:
	rasa shell --cors "*" -m models --endpoints core/endpoints.yml --enable-api -vv

core-server:
	rasa run -m models --enable-api --cors "*" --endpoints core/endpoints.yml --credentials core/credentials.yml -vv
	
action-server:
	rasa run actions

compose-down:
	-docker-compose down && docker-compose rm

compose-build:
	-docker-compose build

compose-up:
	-docker-compose up -d --force-recreate

gateway-dev:
	- cd gateway && yarn start

help:
	@echo "    clean"
	@echo "        Remove python artifacts and build artifacts."
	@echo "    gateway-dev"
	@echo "       Runs gateway application dev server"
	@echo "    build-lookup"
	@echo "        Build entity loopup tables"
	@echo "    train"
	@echo "        Trains a new RASA model using the project's config"
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
	