#!/bin/bash

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

echo "Starting environment setup (NO DOCKER)..."

# Check for Java
if ! command_exists java; then
    echo "Error: Java is not installed."
    exit 1
fi

echo "Building services..."

# Build OrderManagementService
echo "Building OrderManagementService..."
cd OrderMangementService
./mvnw clean package -DskipTests
if [ $? -ne 0 ]; then
    echo "Error: Failed to build OrderManagementService"
    exit 1
fi
cd ..

# Build NotificationService
echo "Building NotificationService..."
cd NotificationService
./mvnw clean package -DskipTests
if [ $? -ne 0 ]; then
    echo "Error: Failed to build NotificationService"
    exit 1
fi
cd ..

echo "Starting Backend Services..."

# Start OrderManagementService in background
echo "Starting OrderManagementService (Port 8081)..."
nohup java -jar OrderMangementService/target/OrderMangementService-0.0.1-SNAPSHOT.jar > order_service.log 2>&1 &
ORDER_PID=$!
echo "OrderManagementService started with PID $ORDER_PID"

# Start NotificationService in background
echo "Starting NotificationService (Port 8082)..."
nohup java -jar NotificationService/target/NotificationService-0.0.1-SNAPSHOT.jar > notification_service.log 2>&1 &
NOTIF_PID=$!
echo "NotificationService started with PID $NOTIF_PID"

echo "Waiting for services to initialize (10s)..."
sleep 10

echo "Starting Frontend..."
cd frontend
npm run dev
