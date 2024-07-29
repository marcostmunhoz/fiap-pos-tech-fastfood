# Testing

To run the automated tests, you must be running the application in development mode. The recommended way to do this is by using the provided Docker Compose configuration.

Once running the containers, you can run the tests using the following commands:

```bash
docker-compose exec app yarn test # Unit tests
docker-compose exec app yarn test:e2e # End-to-end tests
```
