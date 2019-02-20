#!/bin/bash

echo "starting bash..."
echo $(date)

echo "I was called with $# parameters"
echo "My name is $0"
echo "My first parameter is $1"
echo "My second parameter is $2"
echo "All parameters are $@"

echo "current working directory is " $PWD
cd ../../
cd /action
echo $(date)

npm install
echo $(date)

node app.js
echo $(date)