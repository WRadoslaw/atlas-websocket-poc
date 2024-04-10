#!/usr/bin/env bash

set -e

node ./lib/websocket-server.js &

sleep 1
node ./lib/atlas.js &

sleep 1
node ./lib/processor.js &

sleep 2

pkill -f "node ./lib/websocket-server.js"
pkill -f "node ./lib/atlas.js"
pkill -f "node ./lib/processor.js"

