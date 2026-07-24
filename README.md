# 🏗️ BidCraft: E-Commerce & Live Auction Platform

A highly scalable, distributed system designed to handle live auction concurrency and traditional e-commerce checkouts. This project serves as a comprehensive exploration of monolith-to-microservice transitions, demonstrating enterprise-grade architectural patterns.

## 🎯 Learning Objectives & Architecture Focus
This repository is built to implement and master the following system design patterns:
* **Polyglot Persistence:** Utilizing the right database for the right domain (MongoDB for dynamic catalogs, PostgreSQL for ACID transactions).
* **Microservices & API Gateway:** Centralized routing and service discovery.
* **Event-Driven Architecture:** Asynchronous messaging (Kafka) to decouple services.
* **CQRS & Event Sourcing:** Immutable audit logs of bidding history.
* **Resiliency & Observability:** SRE patterns including Circuit Breakers and distributed tracing.

## 💻 Technology Stack
* **Framework:** Java 25, Spring Boot 4.1.x (Spring Cloud 2025.1.2)
* **Data Persistence:** PostgreSQL (Relational/ACID), MongoDB (NoSQL/Document)
* **Build Tool:** Maven
* **Architecture:** Microservices, Spring Cloud Gateway, Netflix Eureka, OpenFeign
* **Planned Integrations:** WebFlux, Apache Kafka, Redis, Resilience4j

## 📂 Project Structure
Currently, the system is divided into bounded contexts and infrastructure nodes:
* `/discovery-server` - Netflix Eureka service registry acting as the system's phonebook.
* `/gateway-service` - Spring Cloud Gateway handling centralized routing and security.
* `/product-service` - Manages the highly dynamic product catalog (MongoDB).
* `/order-service` - Handles strict checkout and transactional financial records (PostgreSQL), utilizing OpenFeign for inter-service communication.

## 🚀 Roadmap & Progress Tracker
We are following a phased architecture blueprint to evolve this platform into a fully reactive, event-driven microservices ecosystem.

- [x] **Phase 1: Domain & Polyglot Persistence** (Product Service with MongoDB, Order Service with PostgreSQL)
- [x] **Phase 2: Microservices & API Gateway** (Eureka Discovery, Spring Cloud Gateway, OpenFeign Integration)
- [ ] **Phase 3: Caching & High Availability** (Redis, Read-Through Cache)
- [ ] **Phase 4: Real-Time Communication** (Spring WebFlux, WebSockets/SSE for Live Bidding)
- [ ] **Phase 5: Event-Driven Architecture** (Kafka/RabbitMQ, Transactional Outbox)
- [ ] **Phase 6: CQRS & Event Sourcing** (Command/Query Separation, Event Store)
- [ ] **Phase 7: Resiliency & Observability** (Resilience4j, Micrometer, Prometheus, Grafana, OpenTelemetry)

## 🚀 Local Deployment & Installation Instructions

### Prerequisites
* Java 25 installed
* Maven installed
* PostgreSQL running locally on port `5432`
* MongoDB local instance or Atlas Cloud URI

### Setup Steps
1. **Clone the repository:**
   ```bash
   git clone https://github.com/Bhomaramsuthar/e-commerce-live-auction.git
   cd e-commerce-live-auction
   ```

2. **Configure Databases:**
   * Create a PostgreSQL database named `bidcraft_orders`.
   * Update the `application.yml` files in both services with your specific database credentials.

3. **Run the Services (Strict Boot Order):**
   Navigate to each service directory and start the Spring Boot applications. The registry must be active before the clients boot.

   ```bash
   # 1. Start Service Registry
   cd discovery-server
   mvn spring-boot:run
   
   # 2. Start API Gateway
   cd ../gateway-service
   mvn spring-boot:run
   
   # 3. Start Product Service
   cd ../product-service
   mvn spring-boot:run
   
   # 4. Start Order Service
   cd ../order-service
   mvn spring-boot:run
   ```

## 🔭 Future Project Scopes
* Implementing distributed caching (Redis) to optimize product catalog database queries.
* Transitioning the live bidding engine to a fully reactive architecture using Spring WebFlux and WebSockets.
* Containerizing the entire infrastructure using Docker and Docker Compose.

## 📬 Contact
**Bhomaram Suthar**
* **Email:** [bhomaramsuthar1027@gmail.com](mailto:bhomaramsuthar1027@gmail.com)