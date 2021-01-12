.ONESHELL:
.DEFAULT_GOAL := help
.SHELLFLAGS = -ec

export GIT_BRANCH := $(shell git rev-parse --abbrev-ref HEAD)
export GIT_HASH := $(shell git rev-parse HEAD)

export NAMESPACE := $(shell basename $$PWD)
export ARTIFACT_ID := $(NAMESPACE).$(GIT_HASH)

# --- Formatting --------------------------------------------------------------
export RED ?= '\033[0;31m'
export GREEN ?= '\033[0;32m'
export NO_COLOR ?= '\033[0m'

.PHONY : help
help:
	@grep -hE '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'
