include ./globals.mk

ENV := "dev"

node_modules: package.json
	npm ci

dist: node_modules
	npm run build

deploy_docs: dist ## Deploys the document site
	aws s3 sync ./docs s3://yendor-$(ENV)/docs --delete

example-site/out:
	cd example-site
	npm ci
	npm run build

deploy_examples: example-site/out ## Deploys the example site
	aws s3 sync ./example-site/out s3://yendor-$(ENV)/examples --delete
	FILES=$$(aws s3 ls s3://yendor-$(ENV)/examples --recursive | grep -i .html | cut -c 32-)
	for file in $$FILES;
	do
		no_ext=$$(echo $$file | sed 's/.html//g')
		aws s3 cp s3://yendor-$(ENV)/$$file s3://yendor-$(ENV)/$$no_ext
	done
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

npm_push_next: dist ## Deploys the library to npm with the next tag
	npm publish --tag next

npm_push: dist ## Deploys the library to npm
	npm publish

