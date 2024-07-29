# FIAP Tech Challenge - Fastfood Kiosk API

## Description

This project was developed as part of the evaluation process for the postgraduate course in Software Architecture at FIAP. The goal is to create an application that simulates a system used in a fast food environment, from the kiosk to order delivery. To achieve this goal, the idea is to build a monolithic application with a hexagonal architecture, applying DDD concepts. The application includes the following features:

- Product management
- Customer registration (identified or not)
- Order placement
- Payment (simulated)
- Order status tracking

## Technologies Used

The application was developed using the NestJS framework. The reason for choosing this framework/stack was to provide a greater challenge, as at the time of implementation, this stack is not my primary development stack.

MySQL was also used as the database for data persistence.

## Installing the application

Check the [installation guide](docs/install.md) for more details.

## Accessing the API Documentation

The API documentation was generated using Swagger. To access it, go to the endpoint `http://localhost:3000/api/docs` (to access in editor mode) or `http://localhost:3000/api/docs.json` (to get the JSON file in OpenAPI format).

## Running Automated Tests

Check the [testing guide](docs/testing.md) for more details.

## Usage

Check the [usage guide](docs/usage.md) for more details.

## TODOs

- Implement authentication and guard for kitchen endpoints
- Increase test coverage
- Eliminate code repetition in general DB config files vs migrations
- Move migrations to bounded contexts (??)
- Implement CI/CD
