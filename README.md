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

## Installing the Application

To install the application, follow the steps below:

- Clone the repository
- Build and run the containers
  - To run in development mode, use the commands `docker compose build` and `docker compose up`. In this mode, the application responds to changes made in the source code (watch mode) and a database is also created for running e2e tests. The application will be available at `http://localhost:3000`.
  - To run in production mode, you must use the provided helm chart. The chart is located in the `helm` folder. To install the chart, use the command `helm install fastfood helm`. The chart will create and run the MySQL database and application pods, as well as the load balancer and HPA. If you're using Minikube, you can access the application using the command `minikube service fastfood-monolith-service --url`. The application will be available at the URL provided by the command. Note that the helm chart uses a previously built Docker image, so the local changes will not be reflected in the production environment unless you change the image in the `values.yaml` file.

## Accessing the API Documentation

The API documentation was generated using Swagger. To access it, go to the endpoint `http://localhost:3000/api/docs` (to access in editor mode) or `http://localhost:3000/api/docs.json` (to get the JSON file in OpenAPI format).

## Running Automated Tests

To run unit tests, use the command `docker compose exec app yarn test`.

To run e2e tests, use the command `docker compose exec app yarn test:e2e`.

In both cases, **the application must be running in development mode**.

## Endpoints

### Product Management

- List/search registered products: [GET /api/v1/products](http://localhost:3000/api/docs#/Products/SearchProductsController_execute)
- View a product: [GET /api/v1/products/{id}](http://localhost:3000/api/docs#/Products/ShowProductController_execute)
- Register a product (validates code uniqueness): [POST /api/v1/products](http://localhost:3000/api/docs#/Products/CreateProductController_execute)
- Edit a product (validates code uniqueness): [PUT /api/v1/products/{id}](http://localhost:3000/api/docs#/Products/UpdateProductController_execute)
- Delete a product: [DELETE /api/v1/products/{id}](http://localhost:3000/api/docs#/Products/DeleteProductController_execute)

### Customer Registration

- Find registered customer by CPF: [GET /api/v1/customers/{cpf}](http://localhost:3000/api/docs#/Customers/FindCustomerByCpfController_execute)
- Register a customer (validates CPF uniqueness): [POST /api/v1/customers](http://localhost:3000/api/docs#/Customers/CreateCustomerController_execute)

### Order Placement

- List available products (separated by category): [GET /api/v1/orders/products](http://localhost:3000/api/docs#/Orders/ListProductsController_execute)
- Create an order (equivalent to an empty shopping cart): [POST /api/v1/orders](http://localhost:3000/api/docs#/Orders/CreateOrderController_execute)
- Add a product to the order: [POST /api/v1/orders/{id}/add-item](http://localhost:3000/api/docs#/Orders/AddOrderItemController_execute)
- Remove an item from the order: [POST /api/v1/orders/{id}/remove-item](http://localhost:3000/api/docs#/Orders/RemoveOrderItemController_execute)
- Change the selected quantity of an item: [POST api/v1/orders/{id}/change-item-quantity](http://localhost:3000/api/docs#/Orders/ChangeOrderItemQuantityController_execute)
- View order: [GET /api/v1/orders/{id}](http://localhost:3000/api/docs#/Orders/ShowOrderController_execute)

### Payment

- Perform a payment: [POST /api/v1/payments](http://localhost:3000/api/docs#/Payments/CreatePaymentController_execute)
- Update Pix payment status: [POST /api/v1/payments/{id}/refresh-status](http://localhost:3000/api/docs#/Payments/RefreshPaymentStatusController_execute)
- Process invoice event: [POST /api/v1/payments/invoice-event](http://localhost:3000/api/docs#/Payments/InvoiceEventController_execute)
- NOTE: Card payments (credit-card, debit-card, or voucher) are automatically approved when the card number is "1111222233334444". For other numbers, they are rejected (simulating a payment failure). Pix payments are always created with a pending status and subsequently updated via the refresh-status request.

### Kitchen

- List ongoing orders (grouped by paid, preparing, and ready): [GET /api/v1/orders](http://localhost:3000/api/docs#/Orders/ListOrdersController_execute)
- Update order status (allows only paid > preparing, preparing > ready, and ready > delivered): [PUT /api/v1/orders/{id}/status](http://localhost:3000/api/docs#/Orders/UpdateOrderStatusController_execute)

### Health Check

- Check application status: GET /health
- Simulate a load: GET /api/v1/load?level=numberBetween1And50 (note that this endpoint uses a fibonacci sequence to simulate a load, so it may take a while to respond depending on the "level" used)

## Additional Notes

There are sample migrations that populates the tables with some data. They'll be executed automatically with the regular migrations, creating:

- A customer with CPF 66894662053 (ID edd93592-550c-4c01-9966-f91c60b9cca3)
- A customer without optional data (ID c091b4b6-ed8f-4bef-b5da-e2981646a5cc)
- 13 sample products, split into the 4 categories (food, drink, dessert, and side)
- 6 sample orders (3 for each customer), with different items, split into 1 canceled, 1 pending, 2 paid, 1 preparing and 1 ready
- 6 sample payments (1 for each order), with the corresponding payment status (e.g. the canceled order has failed payment)

## TODOs

- Implement authentication and guard for kitchen endpoints
- Increase test coverage
- Eliminate code repetition in general DB config files vs migrations
- Move migrations to bounded contexts (??)
- Implement CI/CD
