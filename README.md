# Practical Tuples

This project is a "to-do list" type application built on serverless real-time architecture. Users can create and share lists as well as manage access without requiring traditional account info (i.e. username and password). The app's frontend is built with [Angular](https://angular.io/) and the backend is built with [NestJS](https://nestjs.com/), and uses a [PostgreSQL](https://www.postgresql.org/) relational database. The app can be hosted in AWS with the frontend in [S3](https://aws.amazon.com/s3/) and the backend in [Lambda](https://aws.amazon.com/lambda/), managed by the [Serverless](https://www.serverless.com/) framework. Real-time communication between the frontend and backend is performed by persistent websocket connection that is maintained by [API Gateway](https://aws.amazon.com/api-gateway/).

[![Integration](https://github.com/daneisburgh/practical-tuples/actions/workflows/integration.yml/badge.svg)](https://github.com/daneisburgh/practical-tuples/actions/workflows/integration.yml)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

## Development

1. Install [Docker](https://www.docker.com/get-started/) and [Node.js LTS](https://nodejs.org/en/download/)
2. Install all project dependencies: `npm run install-all`
3. Start local server: `npm start`
