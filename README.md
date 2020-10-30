# e-commerce-api-gebeya

A simple APIs that enlists ecommerce items and handles purchase details.

### GETTING STARTED

The instructions below will guide you in setting up a local instance of this app

### PREREQUISITES

- `NodeJs`
- `Yarn/NPM`
- `Mysql`
- `Git`

### SETUP

- First clone the repo to you machine:

```
git clone https://github.com/Emile-Nsengimana/e-commerce-api-gebeya.git
```

Open it using your favorite IDE
I recommend [vs code](https://code.visualstudio.com/download)

- Install all necessary node modules

```
yarn install
```

- Create a database

create a database named `gebeya-e-commerce`

- Please refer to `.env.example` to setup your `.env` variables

- Run migration

```
yarn migrate:db
```

- Start the app

```
yarn start
```

### API DOCUMENTATION

- Open your favorite browser and got to `localhost:5000`