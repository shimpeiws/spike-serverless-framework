## Environment Variables

You need these environment variables

```
export CUSTOM_DOMAIN_NAME=""
export CERTIFICATE_NAME=""
export AWS_ACCESS_KEY_ID=""
export AWS_SECRET_ACCESS_KEY=""
export PIXABAY_API_KEY=""
export SQS_BASE_URL=""
export API_GATEWAY_URL=""
```

## Deploy

`sls deploy -v`

## Local Development

```
sls dynamodb install
sls offline start
```

## Create Domain

`sls create_domain`
