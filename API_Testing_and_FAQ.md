# Complete API Testing & Application Guide

## 1. Why are you getting a 500 Internal Server Error? (The Feign Client Confusion)

**Feign Client has nothing to do with JWT.** Feign is simply a library that allows one microservice (like `order-service`) to easily make HTTP calls to another (like `product-service`) without you having to write boilerplate REST templates.

The 500 Internal Server Error you were seeing is because of the "dirty data" you mentioned. When you placed an order with a `productId` that did not exist in the database, here's what happened:
1. `order-service` received your order.
2. `order-service` used the Feign Client to ask `product-service`: "Hey, does this product ID exist?"
3. `product-service` couldn't find the product, so it threw a `RuntimeException("Product not found")` and returned a 500 Error.
4. Feign received the 500 Error, panicked, and propagated it back to the Gateway.

**The JWT 401 Unauthorized Error:**
The Gateway has an `AuthenticationFilter`. This filter demands that *every* request going through the Gateway (port 8080) must have an `Authorization` header starting with `Bearer `. If it doesn't, it returns a 401 Unauthorized, not a 500 Error.

---

## 2. Testing Your APIs Through the Gateway (Port 8080)

To test the application properly, all 4 services must be running:
1. `discovery-server` (Port 8761)
2. `gateway-service` (Port 8080)
3. `product-service` (Port 8081)
4. `order-service` (Port 8082)

When sending requests via Postman, Insomnia, or cURL, you must **ALWAYS include this header** because of the Gateway's current `AuthenticationFilter` logic:
`Authorization: Bearer my-dummy-token`

---

## 3. The Clean Data Insertion Guide

Follow these exact steps in order to avoid the 500 error. 

### Step A: Create a Product
Send a `POST` request to `http://localhost:8080/api/product`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer dummy-token
```

**Body (JSON):**
```json
{
  "name": "Sony PlayStation 5",
  "description": "Next-gen gaming console",
  "price": 499.99
}
```
*Note down the `id` returned in the response (e.g., `"64a7c8b1e4b0..."). You will need this for Step C!*

### Step B: Get All Products (Verification)
Send a `GET` request to `http://localhost:8080/api/product`

**Headers:**
```
Authorization: Bearer dummy-token
```

### Step C: Place an Order (Using the clean Product ID)
Send a `POST` request to `http://localhost:8080/api/order`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer dummy-token
```

**Body (JSON):** (Replace `"YOUR_PRODUCT_ID_HERE"` with the ID from Step A)
```json
{
  "orderLineItemsList": [
    {
      "productId": "YOUR_PRODUCT_ID_HERE",
      "productName": "Sony PlayStation 5",
      "price": 499.99,
      "quantity": 1
    }
  ]
}
```

### Step D: Get Order By ID (The new endpoint!)
Send a `GET` request to `http://localhost:8080/api/order/1` (Assuming it's your first order, the ID is 1).

**Headers:**
```
Authorization: Bearer dummy-token
```

---

## 4. How to Make This a Production-Level System

Currently, the system is a great proof-of-concept, but to go to production, you need the following:

> [!WARNING]
> Do not deploy the current configuration to production without addressing these critical security flaws.

1. **Implement Real JWT Validation:**
   - In `gateway-service/src/main/java/com/bidcraft/gateway_service/filter/AuthenticationFilter.java`, the JWT validation is just a dummy check (`authHeader.startsWith("Bearer ")`). You must implement a real JWT decoding logic using a library like `io.jsonwebtoken:jjwt` and verify the token signature using a secret key.
   
2. **Centralized Configuration:**
   - Instead of having `application.yml` files scattered, use **Spring Cloud Config Server**. This allows you to manage all configurations in a central Git repository.

3. **Secret Management:**
   - **Never hardcode passwords** like `password: 12345` for PostgreSQL. Use environment variables (e.g., `${POSTGRES_PASSWORD}`) or a secrets manager like HashiCorp Vault.

4. **Service Resilience & Circuit Breakers:**
   - What happens if `product-service` is down when someone places an order? Feign will throw an error and crash the order process. You should implement a **Circuit Breaker** (using Resilience4J) in `order-service` to handle these failures gracefully (e.g., providing a fallback mechanism or clear error message).

5. **Centralized Logging & Distributed Tracing:**
   - In microservices, tracing a request across Gateway -> Order -> Product is a nightmare without tools. Implement **Micrometer + Zipkin** for distributed tracing, and use the ELK stack (Elasticsearch, Logstash, Kibana) or Loki for centralized logs.

6. **Containerization:**
   - Create a `Dockerfile` for each microservice and a `docker-compose.yml` file to spin up the entire ecosystem (including MongoDB, PostgreSQL, and Eureka) with a single command.

7. **Proper Database Migrations:**
   - In `order-service`, you are using `ddl-auto: update`. In production, this should be `validate`, and you should use a migration tool like **Flyway** or **Liquibase** to handle database schema changes securely.

---

## 5. Endpoints Reference Table

| Service | Method | Endpoint | Description |
|---------|--------|----------|-------------|
| **Product** | `POST` | `/api/product` | Create a new product |
| **Product** | `GET` | `/api/product` | Get all products |
| **Product** | `GET` | `/api/product/{id}` | Get product by ID |
| **Product** | `PUT` | `/api/product/{id}` | Fully replace a product (all fields required) |
| **Product** | `PATCH` | `/api/product/{id}` | Partially update a product (only updated fields required) |
| **Product** | `DELETE` | `/api/product/{id}` | Delete a product |
| **Order** | `POST` | `/api/order` | Place a new order |
| **Order** | `GET` | `/api/order` | Get all orders |
| **Order** | `GET` | `/api/order/{id}` | Get order by ID |
| **Order** | `PUT` | `/api/order/{id}` | Fully replace an order |
| **Order** | `PATCH` | `/api/order/{id}` | Partially update an order |
| **Order** | `DELETE` | `/api/order/{id}` | Delete an order |
