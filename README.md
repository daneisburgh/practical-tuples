# Practical Tuples

This project is a real-time and cross-platform "to-do list" application built on serverless architecture. Users can create and share lists as well as manage access without requiring traditional account info (i.e. username and password). The frontend is built with the [Ionic Framework](https://ionicframework.com/) and can be compiled as a web, Android, and/or iOS application. The backend is built with [NestJS](https://nestjs.com/), and uses an [AWS Aurora Serverless](https://aws.amazon.com/rds/aurora/serverless/) relational database. The app can be hosted in AWS and managed by the [Serverless Framework](https://www.serverless.com/). Real-time communication between the frontend and backend is performed by persistent websocket connection that is maintained by [API Gateway](https://aws.amazon.com/api-gateway/).

[![Integration](https://github.com/daneisburgh/practical-tuples/actions/workflows/integration.yml/badge.svg)](https://github.com/daneisburgh/practical-tuples/actions/workflows/integration.yml)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

## Development

1. Install [Docker](https://www.docker.com/get-started/) and [Node.js LTS](https://nodejs.org/en/download/)
2. Install all project dependencies: `npm run install-all`
3. Start local server: `npm start`
