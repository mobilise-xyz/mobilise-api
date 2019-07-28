[![CircleCI](https://circleci.com/gh/sonjoonho/mobilise-api.svg?style=svg&circle-token=4a5b4b343e565a15ae131f2598751cdbe4552492)](https://circleci.com/gh/sonjoonho/mobilise-api)

# Mobilise [API]

This is the API that serves the [Mobilise app](www.mobilise.xyz). The client for this web app can be found [here](https://github.com/sonjoonho/mobilise-frontend).

## Getting Started

Add .env file with:

```
DB_USERNAME=
DB_PASSWORD=
DB_NAME=
DB_PORT=
JWT_SECRET=literallyanything
MAIL_HOST=
MAIL_PORT=587
NOREPLY_MAIL_SENDER_USER=no-reply@mobilise.xyz
NOREPLY_MAIL_SENDER_PASS=sRgpeupMqA8eUYhDBR
CONTACT_MAIL_SENDER_USER=contact@mobilise.xyz
CONTACT_MAIL_SENDER_PASS=1hUd92e%@*9o
NEXMO_API_KEY=
NEXMO_API_SECRET=
NODE_ENV=development
```

Set up local postgres database and populate .env values respectively.

To start the development server:

```bash
yarn install
yarn start
```

To test:

```bash
yarn test
```

## Created by
- Joon-Ho Son
- Arjun Singh
- William George Burr
- Tigeriam Cross

Students of Imperial College London.
