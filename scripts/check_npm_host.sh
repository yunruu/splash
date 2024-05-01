#!/bin/bash

# Determine the operating system
OS="$(uname -s)"
case "$OS" in
    Linux*)     timeout_cmd="timeout";;
    Darwin*)    timeout_cmd="gtimeout";;
    *)          echo "Unsupported OS: $OS"; exit 1;;
esac

# Check if the necessary timeout command is available
if ! command -v $timeout_cmd &> /dev/null
then
    echo "$timeout_cmd could not be found, please install it first."
    exit
fi

# Run 'npm run host' and capture its output, allowing the command to execute for up to 10 seconds
output=$($timeout_cmd 10s npm run host 2>&1)

echo "Output from npm run host"
echo "$output"

# Search for a specific error message in the output
error_message="ERROR"  
echo "$output" | grep -q "$error_message"

# Check if the grep found the error message
if [ $? -eq 0 ]; then
    echo "Error message found."
    exit 1
else
    echo "No error message found, npm run host succeeded."
    exit 0
fi