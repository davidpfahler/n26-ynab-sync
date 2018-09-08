## Deploy

1. Put necessary environment variables in `.env` file.
2. Install severless cli: `npm install -g serverless`
3. Set up AWS IAM admin user and download credentials.
4. Make sure the region in `serverless.yml` is the region you want to use in AWS.
5. Run `AWS_ACCESS_KEY_ID=MY_AWS_ADMIN_ACCESS_JEY AWS_SECRET_ACCESS_KEY=MY_AWS_ADMIN_SECRET_ACCESS_KEY serverless deploy -v`
