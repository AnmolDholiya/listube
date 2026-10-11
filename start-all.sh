#!/usr/bin/env bash
echo "Starting Mock Flipkart Service (Port 8081)..."
(cd mock-flipkart-service && mvn spring-boot:run) &
MOCK_PID=$!

echo "Starting React Vite Frontend (Port 5173)..."
(cd frontend && npm run dev) &
FRONTEND_PID=$!

echo "Waiting 6 seconds for background services to initialize..."
sleep 6

echo "Starting Main Listing Platform (Port 8080)..."
(cd backend && mvn spring-boot:run)

kill $MOCK_PID $FRONTEND_PID
