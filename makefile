include ./globals.mk

ENV := "dev"

changelog: ## Generates the changelog
	npm run changelog

node_modules: package.json
	npm ci

dist: node_modules
	npm run build

deploy_docs: dist ## Deploys the document site
	aws s3 sync ./docs s3://malwoden-$(ENV)/docs --delete

example-site/build:
	cd example-site
	npm ci
	npm install ..
	npm run build

deploy_examples: example-site/build ## Deploys the example site
	aws s3 sync ./example-site/build s3://malwoden-$(ENV)/examples --delete
	echo "DEPLOYED EXAMPLE SITE"

deploy: deploy_examples
deploy: deploy_docs
deploy: ## Deploys both documentation sites
	echo "Deployed Everything!"

tf_init: ## Initializes terraform
	cd ./infra/terraform
	rm -rf .terraform
	terraform init -backend-config="../envs/$(ENV).backend.config"

tf_plan: ## Plans terraform
	cd ./infra/terraform
	terraform plan -var-file="../envs/$(ENV).tfvars"

tf_apply: ## Applies terraform
	cd ./infra/terraform
	terraform apply -var-file="../envs/$(ENV).tfvars"

npm_push: dist ## Deploys the library to npm with the next tag
	npm publish --tag next

npm_release: dist ## Adds the latest tag to the current npm pkg
	VERSION=$$(node -e "console.log(require('./package.json').version);")
	npm dist-tag add malwoden@$$VERSION latest

