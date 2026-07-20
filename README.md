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
* **Framework:** Java 25, Spring Boot 3.x
* **Data Persistence:** PostgreSQL (Relational/ACID), MongoDB (NoSQL/Document)
* **Build Tool:** Maven
* **Architecture:** Microservices
* **Planned Integrations:** Spring Cloud Gateway, WebFlux, Apache Kafka, Redis, Resilience4j

## 📂 Project Structure
Currently, the system is divided into bounded contexts:
* `/product-service` - Manages the highly dynamic product catalog (MongoDB).
* `/order-service` - Handles strict checkout and transactional financial records (PostgreSQL).

## 🚀 Local Deployment & Installation Instructions

### Prerequisites
* Java 25 installed
* Maven installed
* PostgreSQL running locally on port 5432
* MongoDB local instance or Atlas Cloud URI

### Setup Steps
1. **Clone the repository:**
   ```bash
   git clone https://github.com/Bhomaramsuthar/e-commerce-live-auction.git
   cd e-commerce-live-auction