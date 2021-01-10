.ONESHELL:

ENV := "dev"

node_modules: package.json
	npm ci

dist: node_modules
	npm run build

deploy_docs: dist
	aws s3 sync ./docs s3://yendor-$(ENV)/docs --delete

example-site/out:
	cd example-site
	npm ci
	npm run build

deploy_examples: example-site/out
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

