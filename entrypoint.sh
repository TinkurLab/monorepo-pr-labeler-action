#!/bin/bash

echo "starting bash..."
echo $(date)

echo "current working directory is " $PWD
cd ../../
cd /action
echo $(date)

npm install
echo $(date)

node app.js
echo $(date)