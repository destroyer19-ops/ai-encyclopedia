# S3 Browser Uploads

Payment receipts and admin-uploaded course media use presigned `PUT` URLs. The browser uploads directly to S3, so two production settings must line up:

1. `S3_REGION` must match the bucket's actual AWS region. If it does not, S3 returns `301 Moved Permanently`, and browser uploads fail before CORS headers are available.
2. The bucket must allow CORS `PUT` requests from the deployed frontend origin.

Apply the CORS config:

```sh
aws s3api put-bucket-cors \
  --bucket aiencyclovia-assets \
  --cors-configuration file://config/s3-cors.json
```

Check the bucket region:

```sh
aws s3api get-bucket-location --bucket aiencyclovia-assets
```

Set the backend environment to that region, for example:

```sh
S3_REGION=us-east-1
S3_PUBLIC_BASE_URL=https://aiencyclovia-assets.s3.us-east-1.amazonaws.com
```
