#!/bin/bash

# Run 'npm run host' and allow it to execute for up to 30 seconds
output=$(timeout 30s npm run host 2>&1)

# Search for a specific error message in the output
error_message="ERROR"  # Replace this with the actual error message you're looking for
echo "$output" | grep -q "$error_message"

# Check if the grep found the error message
if [ $? -eq 0 ]; then
    echo "Error message found: $error_message"
    exit 1
else
    echo "No error message found, `npm run host` succeeded."
    exit 0
fi