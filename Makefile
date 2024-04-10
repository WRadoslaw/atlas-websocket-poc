install:
	@rm -rf node_modules
	@npm install

build:
	@npm run build

prepare: install build

.PHONY: build prepare
