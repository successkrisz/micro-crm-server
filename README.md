# micro-crm-server

**API server for Micro CRM app**

## About

A basic RESTful API server developed to work as a backend for the *micro-crm-client*
which is currently under development.

## Requirements

- Either a running mongodb server or globally installed mongodb
- npm
- node.js

## Setup

Clone the project:
```
git clone https://github.com/successkrisz/micro-crm-server.git
cd /micro-crm-server
```
Run `npm install` in the root folder:
```
npm install
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

- **npm start**: starts the development server in watch mode
- **npm lint**: lints your code for syntax and style errors
- **npm test**: runs the tests located in the /test folder
- **npm build**: build a production version of the app to the /build folder
- **npm serve**: serves the production build

Happy Hacking!
