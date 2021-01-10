.ONESHELL:

ENV := "dev"

node_modules: package.json
	npm ci

dist: node_modules
	npm run build

deploy_docs: dist
	aws s3 sync ./docs s3://yendor-$(ENV)/docs --delete

example-site/public:
	cd example-site
	npm ci
	npm run build

deploy_examples: example-site/public
	aws s3 sync ./example-site/public s3://yendor-$(ENV)/examples --delete

deploy: deploy_examples
deploy: deploy_docs
deploy:
	echo "Deployed Everything!"

tf_init:
	cd ./infra/terraform
	rm -rf .terraform
	terraform init -backend-config="../envs/$(ENV).backend.config"

tf_plan:
	cd ./infra/terraform
	terraform plan -var-file="../envs/$(ENV).tfvars"

tf_apply:
	cd ./infra/terraform
	terraform apply -var-file="../envs/$(ENV).tfvars"

