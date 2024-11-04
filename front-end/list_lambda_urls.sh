#!/bin/bash

# Set the region
REGION="us-east-1"

# List all Lambda functions in the specified region
FUNCTIONS=$(aws lambda list-functions --region $REGION --query 'Functions[*].FunctionName' --output text)

echo "Listing Lambda function URLs in region $REGION..."

# Iterate through each function and check for a function URL
for FUNCTION in $FUNCTIONS; do
  FUNCTION_URL=$(aws lambda get-function-url-config --function-name $FUNCTION --region $REGION --query 'FunctionUrl' --output text 2>/dev/null)
  
  if [ -n "$FUNCTION_URL" ]; then
    echo "Function: $FUNCTION"
    echo "URL: $FUNCTION_URL"
    echo "--------------------------"
  fi
done