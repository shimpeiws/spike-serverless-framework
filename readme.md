## Environment Variables

You need these environment variables

```
export CUSTOM_DOMAIN_NAME="example.com"
export CERTIFICATE_NAME="*.example.com"
export SLS_DEBUG=*
export AWS_ACCESS_KEY_ID="YOUR_AWS_ACCESS_KEY_ID"
export AWS_SECRET_ACCESS_KEY="YOUR_AWS_SECRET_ACCESS_KEY"
export PIXABAY_API_KEY="YOUR_PIXABAY_API_KEY"
export SQS_BASE_URL="https://sqs.ap-northeast-1.amazonaws.com/XXXXX"
export API_GATEWAY_URL="https://XXXXX.execute-api.ap-northeast-1.amazonaws.com/XXXXX/"

```

## Deploy

serverless deploy -v
-> Change to using codebuild

## Local Development

serverless offline

## Build

serverless webpack

## Create Domain

serverless create_domain
