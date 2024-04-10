#!/usr/bin/env bash

set -e

echo "Starting Websocket server"
node ./lib/websocket-server.js


echo "Starting Atlas mock"
node ./lib/atlas.js

echo "Starting Processor mock"
node ./lib/processor.js
