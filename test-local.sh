#!/bin/bash

echo "Starting Math4052 Quiz Application Local Test..."
echo

# Check Node.js installation
echo "Checking Node.js installation..."
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed. Please install Node.js first."
    exit 1
fi
node --version

# Check npm installation
echo
echo "Checking npm installation..."
if ! command -v npm &> /dev/null; then
    echo "ERROR: npm is not installed. Please install npm first."
    exit 1
fi
npm --version

echo
echo "Checking MongoDB connection..."
echo "Please ensure MongoDB is running locally or you have a cloud MongoDB URI configured."
echo

# Install and start backend
echo "Installing backend dependencies..."
cd math4052-backend
npm install
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install backend dependencies."
    exit 1
fi

echo
echo "Starting backend server..."
npm start &
BACKEND_PID=$!

# Install and start frontend
echo
echo "Installing frontend dependencies..."
cd ../math4052-frontend
npm install
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install frontend dependencies."
    kill $BACKEND_PID
    exit 1
fi

echo
echo "Starting frontend development server..."
npm run dev &
FRONTEND_PID=$!

echo
echo "===================================="
echo "Local deployment started!"
echo "Backend: http://localhost:5000"
echo "Frontend: http://localhost:5173"
echo "===================================="
echo
echo "Press Ctrl+C to stop both servers..."

# Wait for Ctrl+C
trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait