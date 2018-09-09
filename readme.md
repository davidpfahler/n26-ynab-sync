## Deploy

1. Put necessary environment variables in `.env` file.
2. Install severless cli: `npm install -g serverless`
3. Set up AWS IAM admin user and download credentials.
4. Make sure the region in `serverless.yml` is the region you want to use in AWS.
5. Install dependencies: `npm install`.
6. Run `AWS_ACCESS_KEY_ID=MY_AWS_ADMIN_ACCESS_JEY AWS_SECRET_ACCESS_KEY=MY_AWS_ADMIN_SECRET_ACCESS_KEY serverless deploy -v`

## How to sync multiple accounts

There is a somewhat solid workaround to sync multiple n26 accounts with multiple budgets:

1. Copy your first account's `.env` file: `cp .env .env2`.
2. Copy `serverless.yml`: `cp serverless.yml serverless2.yml`.
3. Rename the service in `serverless.yml` to something that tells you what account this is referring to.
4. Update variables in `.env`.
5. Deploy.
