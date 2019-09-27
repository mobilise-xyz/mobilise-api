[![CircleCI](https://circleci.com/gh/sonjoonho/mobilise-api.svg?style=svg&circle-token=4a5b4b343e565a15ae131f2598751cdbe4552492)](https://circleci.com/gh/sonjoonho/mobilise-api)

# Mobilise [API]

This is the API that serves the [Mobilise app](https://www.mobilise.xyz). The client for this web app can be found [here](https://github.com/mobilise-xyz/mobilise-frontend).

## Getting Started

### Basics

Add `.env` file in the project directory.
You will need to add AT LEAST the following to this file:

```
DB_USERNAME=yourpostgresusername
DB_PASSWORD=yourpostgrespassword
DB_NAME=yourdbname
DB_PORT=5432 (probably)
JWT_SECRET=somerandomcharacters
ADMIN_KEY=somerandomcharacters
NODE_ENV=development
```

If wish to use a local database instance, make sure to install Postgres.

On Mac: https://postgresapp.com/downloads.html

It is also advised you download a GUI for managing the Postgres instance:

On Mac: https://eggerapps.at/postico/

Make sure you are running the local Postgres server and have a database 
that you can use. 

### Mail

Some endpoints will cause the code to send emails to users. In order for this to work, it is important
that you add the correct environment variables to the `.env` file.

#### Mail using Ethereal

For local use, it is best to use Ethereal for getting a fake email account. 
https://ethereal.email/

```
MAIL_HOST=smtp.ethereal.email
MAIL_PORT=587

WEB_URL=http://localhost:3000

NOREPLY_MAIL_SENDER_USER=youremail@ethereal.email
NOREPLY_MAIL_SENDER_PASS=youremailpassword
CONTACT_MAIL_SENDER_USER=yourotheremail@ethereal.email
CONTACT_MAIL_SENDER_PASS=yourotheremailpassword
```

### S3

We use Amazon S3 buckets for storing and retrieving files. Therefore, in order to 
retrieve said files successfully. You will need to set the following
environment variables by adding them to `.env`:

```
AWS_S3_REGION=yourawsregion (eu-west-2)
AWS_S3_BUCKET_NAME=yours3bucketname
AWS_SECRET_ACCESS_KEY=yoursecretaccesskey
AWS_ACCESS_KEY=youraccesskey
```

### Triggers

The computation trigger requires use of a key. This should be added to `.env`:

```
COMPUTATION_TRIGGER_KEY=somerandomcharacters
```

### Calendar 

In order to support the ability for shifts to be exported to calendar, you will
need to add the following to `.env`:
```
WEB_CAL_URL=webcal://localhost:8080
```
### Texting 

Some endpoints will cause the code to send texts to users. In order for this to work, it is important
that you add the correct environment variables to the `.env` file.

```
AWS_SMS_REGION=yourawsregion (eu-west-1)
```

## Running server

To start the development server:

```bash
yarn install
yarn start
```

To test:

```bash
yarn test
```

If tests fail, then make sure to run the following after:
```bash
yarn cleardb
```
This will remove test data from your database.

## Created by
- Joon-Ho Son
- Arjun Singh
- Will Burr
- Tigeriam Cross

Students of Imperial College London.
