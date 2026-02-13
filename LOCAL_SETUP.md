# Local Setup Guide (No Docker)

This project has been updated to run without Docker. Follow these steps to set up your local environment.

## Prerequisites

1.  **Java 21**: Verify installation with `java -version`.
2.  **Maven**: Verify installation with `mvn -version`.
3.  **Homebrew**: Required to install Kafka easily on macOS.

---

## 1. Install and Run Kafka (Mac)

Since we removed Docker, you need to run Kafka directly on your machine.

### step 1.1: Install Kafka
Run the following command in your terminal:
```bash
brew install kafka
```

### step 1.2: Start Services
Kafka requires Zookeeper to run first. You will need **two separate terminal windows**.

**Terminal 1 (Zookeeper):**
```bash
zookeeper-server-start /usr/local/etc/kafka/zookeeper.properties
# OR on Apple Silicon (M1/M2/M3):
zookeeper-server-start /opt/homebrew/etc/kafka/zookeeper.properties
```

**Terminal 2 (Kafka):**
```bash
kafka-server-start /usr/local/etc/kafka/server.properties
# OR on Apple Silicon (M1/M2/M3):
kafka-server-start /opt/homebrew/etc/kafka/server.properties
```

*Note: Keep these windows open/running.*

---

## 2. Run the Backend Services

You will need **two more terminal windows** for the services.

### Terminal 3: Order Service
```bash
cd OrderMangementService
mvn spring-boot:run
```
*Runs on: http://localhost:8081*

### Terminal 4: Notification Service
```bash
cd NotificationService
mvn spring-boot:run
```
*Runs on: http://localhost:8082*

---

## 3. Run the Frontend

### Terminal 5: Frontend
```bash
cd frontend
npm install
npm run dev
```
*Runs on: http://localhost:5173* (usually)

---

## 4. Testing the Data Flow

You can test that orders are being created and notifications are being received without using the UI.

1.  **Send an Order** (using curl):
    Open a new terminal tab and run:
    ```bash
    curl -X POST http://localhost:8081/orders \
    -H "Content-Type: application/json" \
    -d '{
        "customerId": 123,
        "restaurantId": 456,
        "items": [
            { "menuItemId": 1, "quantity": 2, "price": 10.50 },
            { "menuItemId": 2, "quantity": 1, "price": 5.00 }
        ]
    }'
    ```

2.  **Verify Notification**:
    Check the **Notification Service Terminal** (Terminal 4). You should see a log message similar to:
    ```
    Notification Receiver: Order Placed: 1 for Customer: 123
    ```

3.  **Verify Database**:
    You can verify the order was saved in the H2 in-memory database configuration console at:
    `http://localhost:8081/h2-console`
    - JDBC URL: `jdbc:h2:mem:order_db`
    - User: `sa`
    - Password: `password`

---

## Troubleshooting
- **"Connection refused" for Kafka**: Ensure both Zookeeper and Kafka terminals are running without errors.
- **Port conflicts**: Ensure ports 8081, 8082, and 9092 are free.
