# micro-crm-server

**API server for Micro CRM app**

## About

A basic RESTful API server developed to work as a backend for the [micro-crm-client](https://github.com/successkrisz/micro-crm-client)
which is currently under development.

## Requirements

- Either a running mongodb server or globally installed mongodb
- npm
- node.js

## Features

- Authentication with Json Web Tokens
- User management
- Client management

## Setup

Clone the project:
```
git clone https://github.com/successkrisz/micro-crm-server.git
cd /micro-crm-server
```
Run `yarn install` in the root folder (You can also use `npm install`):
```
yarn install
```
If you have a running mongoDB server add its parameters to the configuration file at config/default.json.
For testing purposes you can launch a local mongodb service with the *npm run db* command:
```
npm run db
```
After getting the database sorted you're ready to go:
```
npm start
```

## Usage

| **`npm run <script>`** | **Description** |
|------------------------|-----------------|
|`start`|Serves your development server at `localhost:3000` in watch mode.|
|`build`|Transcompiles your code to es5 to the `/build` folder.|
|`serve`|Serves the previously built server in production mode from the `/build` folder.|
|`test`|Runs unit tests using Mocha.|
|`test:watch`|Runs unit tests using Mocha in watch mode.|
|`lint`|Lint all `.js` files.|
|`lint:watch`|Lint all `.js` files in watch mode.|
|`lint:fix`|Lint and fix all `.js` files. [Read more on this](http://eslint.org/docs/user-guide/command-line-interface.html#fix).|
|`db`|Starts up a mongoDB server on `localhost:27017`|

## API Endpoints

Unprotected:

- /POST /api/login : Authenticate user, if successful return a JWT

Protected:

 *Requires Bearer JWT to be present in the Authorization header*

- /GET /api/users : Retrieve all users from the database
- /\* /api/user : Create/Edit/Retrieve/Delete user from database
- /\* /api/client : Create/Edit/Retrieve/Delete client from database

Happy Hacking!
