# 🚀 E-Commerce & Live Auction Platform - Startup & Testing Guide

This guide covers everything you need to start the infrastructure, run your microservices, test APIs, and monitor Redis caching behaviors.

---

## 1. Running Docker Compose in VS Code

Your `docker-compose.yml` file contains the essential infrastructure services: **Redis, PostgreSQL, Zookeeper, and Kafka**.

**Option A: Using the VS Code Terminal**
1. Open your project in VS Code.
2. Open a new terminal (`Ctrl` + `\``).
3. Ensure you are in the root directory (`s:\IntelliJ\E-Commerce-&-Live-Auction-Platform`).
4. Run the following command to start all services in detached mode:
   ```bash
   docker-compose up -d
   ```
5. To stop the services later, run:
   ```bash
   docker-compose down
   ```

**Option B: Using the Docker Extension**
1. Install the **Docker** extension for VS Code by Microsoft.
2. Right-click the `docker-compose.yml` file in the Explorer.
3. Select **Compose Up**.

---

## 2. Running the Microservices in IntelliJ IDEA

Your project contains several Spring Boot services (e.g., `discovery-server`, `gateway-service`, `order-service`, `product-service`).

**Step-by-step Startup:**
1. **Open the Project:** Open the root folder (`E-Commerce-&-Live-Auction-Platform`) in IntelliJ IDEA.
2. **Sync Maven/Gradle:** Ensure that IntelliJ has imported all the modules correctly. If a popup appears in the bottom right saying "Load Maven/Gradle Project", click it.
3. **Run Configuration Setup:**
   - IntelliJ usually auto-detects Spring Boot applications.
   - Open the **Run/Debug Configurations** dialog or check the **Services** tool window (`Alt` + `8` or `View -> Tool Windows -> Services`).
4. **Startup Order (Important!):**
   - **First:** Start the `discovery-server` (Eureka) so other services can register.
   - **Second:** Start the `gateway-service`.
   - **Third:** Start the backend microservices (`order-service`, `product-service`, etc.) in any order.
5. **Verify:** You can check the Eureka dashboard (usually `http://localhost:8761`) to confirm all services have successfully registered.

---

## 3. API Testing using Postman

Once the infrastructure (Docker) and your microservices (IntelliJ) are running, you can test the APIs.

1. **Routing through Gateway:** Since you have a `gateway-service`, it's best practice to send all your Postman requests to the API Gateway's port (often `8080` or `8000`) rather than the individual service ports, as the Gateway handles routing.
2. **Create a Postman Collection:**
   - Open Postman and click **New -> Collection**. Name it "BidCraft APIs".
3. **Add Requests:**
   - **Products API:** Add a `GET` request to `http://localhost:<GATEWAY_PORT>/products` (or whatever route you configured).
   - **Orders API:** Add a `POST` request to `http://localhost:<GATEWAY_PORT>/orders` with a JSON body.
4. **Headers & Auth:** If your gateway handles JWT authentication, remember to add an `Authorization: Bearer <token>` header to your requests.

---

## 4. Monitoring Redis Cache & 1-Min TTL Deletion

To verify that your caching layer is working and that items are being deleted exactly after their 1-minute Time-To-Live (TTL), you can use the Redis CLI inside your running Docker container.

> [!TIP]
> The easiest way to monitor Redis in real-time is by using the `monitor` command or checking the `ttl` of specific keys.

### Step 1: Access the Redis CLI
Open a terminal (VS Code or standard command prompt) and run this command to enter the Redis container:
```bash
docker exec -it <container_name_or_id> redis-cli
```
*(If you aren't sure of the container name, run `docker ps` to find it. It will likely be something like `e-commerce--live-auction-platform-redis-1`)*.

### Step 2: Trigger a Cache Creation
Use Postman to hit an API endpoint that triggers caching (e.g., fetching a product by ID).

### Step 3: Verify the Key and TTL
Inside the `redis-cli`, run the following commands:

1. **Find your key:**
   ```redis
   keys *
   ```
   *(This lists all keys. Look for the one related to your cached object).*

2. **Check the remaining TTL:**
   ```redis
   ttl <your_key_name>
   ```
   - It will return an integer representing the seconds remaining before deletion (e.g., `58`).
   - Run it a few times to watch it count down.

3. **Verify Deletion:**
   Wait for the 1 minute to pass, then try to `get` the key or check its `ttl`:
   ```redis
   get <your_key_name>
   ```
   If the TTL has expired, Redis will automatically delete it, and this command will return `(nil)`.

### Alternative: Real-Time Event Monitoring
If you want to watch a live stream of every command hitting Redis (including SET commands to see when the cache is created), simply type:
```redis
monitor
```
*(Press `Ctrl+C` to exit the monitor mode).*
