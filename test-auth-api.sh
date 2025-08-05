#!/bin/bash

# Configuration
API_URL="http://localhost:5000/api"
TEST_EMAIL="test$(date +%s)@example.com"  # Unique email for each test run
TEST_PASSWORD="testPassword123"
ADMIN_EMAIL="admin$(date +%s)@example.com"
ADMIN_PASSWORD="adminPassword123"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "========================================="
echo "Math4052 API Authentication Testing"
echo "========================================="
echo ""

# Function to print test results
print_result() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✓ $2${NC}"
    else
        echo -e "${RED}✗ $2${NC}"
    fi
}

# Test 1: Register a new user
echo -e "${YELLOW}Test 1: Register a new user${NC}"
REGISTER_RESPONSE=$(curl -s -X POST "$API_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$TEST_EMAIL\",\"password\":\"$TEST_PASSWORD\"}" \
  -w "\nHTTP_STATUS:%{http_code}")

HTTP_STATUS=$(echo "$REGISTER_RESPONSE" | grep "HTTP_STATUS" | cut -d':' -f2)
RESPONSE_BODY=$(echo "$REGISTER_RESPONSE" | sed -n '1,/HTTP_STATUS/p' | sed '$d')

echo "Response: $RESPONSE_BODY"
if [ "$HTTP_STATUS" = "201" ]; then
    print_result 0 "User registration successful (HTTP $HTTP_STATUS)"
else
    print_result 1 "User registration failed (HTTP $HTTP_STATUS)"
fi
echo ""

# Test 2: Try to register the same user again (should fail)
echo -e "${YELLOW}Test 2: Register duplicate user (should fail)${NC}"
DUPLICATE_RESPONSE=$(curl -s -X POST "$API_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$TEST_EMAIL\",\"password\":\"$TEST_PASSWORD\"}" \
  -w "\nHTTP_STATUS:%{http_code}")

HTTP_STATUS=$(echo "$DUPLICATE_RESPONSE" | grep "HTTP_STATUS" | cut -d':' -f2)
RESPONSE_BODY=$(echo "$DUPLICATE_RESPONSE" | sed -n '1,/HTTP_STATUS/p' | sed '$d')

echo "Response: $RESPONSE_BODY"
if [ "$HTTP_STATUS" = "400" ]; then
    print_result 0 "Duplicate user registration correctly rejected (HTTP $HTTP_STATUS)"
else
    print_result 1 "Duplicate user registration check failed (HTTP $HTTP_STATUS)"
fi
echo ""

# Test 3: Login with correct credentials
echo -e "${YELLOW}Test 3: Login with correct credentials${NC}"
LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$TEST_EMAIL\",\"password\":\"$TEST_PASSWORD\"}" \
  -w "\nHTTP_STATUS:%{http_code}")

HTTP_STATUS=$(echo "$LOGIN_RESPONSE" | grep "HTTP_STATUS" | cut -d':' -f2)
RESPONSE_BODY=$(echo "$LOGIN_RESPONSE" | sed -n '1,/HTTP_STATUS/p' | sed '$d')

echo "Response: $RESPONSE_BODY"
if [ "$HTTP_STATUS" = "200" ]; then
    print_result 0 "Login successful (HTTP $HTTP_STATUS)"
    # Extract token for future requests
    TOKEN=$(echo "$RESPONSE_BODY" | grep -o '"token":"[^"]*' | cut -d'"' -f4)
    if [ ! -z "$TOKEN" ]; then
        echo "Token received: ${TOKEN:0:20}..."
    fi
else
    print_result 1 "Login failed (HTTP $HTTP_STATUS)"
fi
echo ""

# Test 4: Login with incorrect password
echo -e "${YELLOW}Test 4: Login with incorrect password${NC}"
WRONG_LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$TEST_EMAIL\",\"password\":\"wrongPassword\"}" \
  -w "\nHTTP_STATUS:%{http_code}")

HTTP_STATUS=$(echo "$WRONG_LOGIN_RESPONSE" | grep "HTTP_STATUS" | cut -d':' -f2)
RESPONSE_BODY=$(echo "$WRONG_LOGIN_RESPONSE" | sed -n '1,/HTTP_STATUS/p' | sed '$d')

echo "Response: $RESPONSE_BODY"
if [ "$HTTP_STATUS" = "401" ]; then
    print_result 0 "Incorrect password correctly rejected (HTTP $HTTP_STATUS)"
else
    print_result 1 "Incorrect password check failed (HTTP $HTTP_STATUS)"
fi
echo ""

# Test 5: Login with non-existent email
echo -e "${YELLOW}Test 5: Login with non-existent email${NC}"
NONEXISTENT_LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"nonexistent@example.com\",\"password\":\"$TEST_PASSWORD\"}" \
  -w "\nHTTP_STATUS:%{http_code}")

HTTP_STATUS=$(echo "$NONEXISTENT_LOGIN_RESPONSE" | grep "HTTP_STATUS" | cut -d':' -f2)
RESPONSE_BODY=$(echo "$NONEXISTENT_LOGIN_RESPONSE" | sed -n '1,/HTTP_STATUS/p' | sed '$d')

echo "Response: $RESPONSE_BODY"
if [ "$HTTP_STATUS" = "401" ]; then
    print_result 0 "Non-existent user correctly rejected (HTTP $HTTP_STATUS)"
else
    print_result 1 "Non-existent user check failed (HTTP $HTTP_STATUS)"
fi
echo ""

# Test 6: Register an admin user
echo -e "${YELLOW}Test 6: Register an admin user${NC}"
ADMIN_REGISTER_RESPONSE=$(curl -s -X POST "$API_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$ADMIN_EMAIL\",\"password\":\"$ADMIN_PASSWORD\",\"role\":\"admin\"}" \
  -w "\nHTTP_STATUS:%{http_code}")

HTTP_STATUS=$(echo "$ADMIN_REGISTER_RESPONSE" | grep "HTTP_STATUS" | cut -d':' -f2)
RESPONSE_BODY=$(echo "$ADMIN_REGISTER_RESPONSE" | sed -n '1,/HTTP_STATUS/p' | sed '$d')

echo "Response: $RESPONSE_BODY"
if [ "$HTTP_STATUS" = "201" ]; then
    print_result 0 "Admin registration successful (HTTP $HTTP_STATUS)"
else
    print_result 1 "Admin registration failed (HTTP $HTTP_STATUS)"
fi
echo ""

# Test 7: Login as admin and check role
echo -e "${YELLOW}Test 7: Login as admin and verify role${NC}"
ADMIN_LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$ADMIN_EMAIL\",\"password\":\"$ADMIN_PASSWORD\"}" \
  -w "\nHTTP_STATUS:%{http_code}")

HTTP_STATUS=$(echo "$ADMIN_LOGIN_RESPONSE" | grep "HTTP_STATUS" | cut -d':' -f2)
RESPONSE_BODY=$(echo "$ADMIN_LOGIN_RESPONSE" | sed -n '1,/HTTP_STATUS/p' | sed '$d')

echo "Response: $RESPONSE_BODY"
if [ "$HTTP_STATUS" = "200" ]; then
    ROLE=$(echo "$RESPONSE_BODY" | grep -o '"role":"[^"]*' | cut -d'"' -f4)
    if [ "$ROLE" = "admin" ]; then
        print_result 0 "Admin login successful with correct role (HTTP $HTTP_STATUS)"
    else
        print_result 1 "Admin login successful but role incorrect: $ROLE"
    fi
else
    print_result 1 "Admin login failed (HTTP $HTTP_STATUS)"
fi
echo ""

# Test 8: Forgot password
echo -e "${YELLOW}Test 8: Request password reset${NC}"
FORGOT_PASSWORD_RESPONSE=$(curl -s -X POST "$API_URL/auth/forgot-password" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$TEST_EMAIL\"}" \
  -w "\nHTTP_STATUS:%{http_code}")

HTTP_STATUS=$(echo "$FORGOT_PASSWORD_RESPONSE" | grep "HTTP_STATUS" | cut -d':' -f2)
RESPONSE_BODY=$(echo "$FORGOT_PASSWORD_RESPONSE" | sed -n '1,/HTTP_STATUS/p' | sed '$d')

echo "Response: $RESPONSE_BODY"
if [ "$HTTP_STATUS" = "200" ]; then
    print_result 0 "Password reset request successful (HTTP $HTTP_STATUS)"
    # Extract reset token if available (dev mode)
    RESET_TOKEN=$(echo "$RESPONSE_BODY" | grep -o '"token":"[^"]*' | cut -d'"' -f4)
    if [ ! -z "$RESET_TOKEN" ]; then
        echo "Reset token (dev mode): $RESET_TOKEN"
    fi
else
    print_result 1 "Password reset request failed (HTTP $HTTP_STATUS)"
fi
echo ""

# Test 9: Reset password with token (if we got one)
if [ ! -z "$RESET_TOKEN" ]; then
    echo -e "${YELLOW}Test 9: Reset password with token${NC}"
    NEW_PASSWORD="newPassword123"
    RESET_PASSWORD_RESPONSE=$(curl -s -X POST "$API_URL/auth/reset-password/$RESET_TOKEN" \
      -H "Content-Type: application/json" \
      -d "{\"password\":\"$NEW_PASSWORD\"}" \
      -w "\nHTTP_STATUS:%{http_code}")
    
    HTTP_STATUS=$(echo "$RESET_PASSWORD_RESPONSE" | grep "HTTP_STATUS" | cut -d':' -f2)
    RESPONSE_BODY=$(echo "$RESET_PASSWORD_RESPONSE" | sed -n '1,/HTTP_STATUS/p' | sed '$d')
    
    echo "Response: $RESPONSE_BODY"
    if [ "$HTTP_STATUS" = "200" ]; then
        print_result 0 "Password reset successful (HTTP $HTTP_STATUS)"
        
        # Test login with new password
        echo -e "${YELLOW}Test 9b: Login with new password${NC}"
        NEW_LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/auth/login" \
          -H "Content-Type: application/json" \
          -d "{\"email\":\"$TEST_EMAIL\",\"password\":\"$NEW_PASSWORD\"}" \
          -w "\nHTTP_STATUS:%{http_code}")
        
        HTTP_STATUS=$(echo "$NEW_LOGIN_RESPONSE" | grep "HTTP_STATUS" | cut -d':' -f2)
        RESPONSE_BODY=$(echo "$NEW_LOGIN_RESPONSE" | sed -n '1,/HTTP_STATUS/p' | sed '$d')
        
        echo "Response: $RESPONSE_BODY"
        if [ "$HTTP_STATUS" = "200" ]; then
            print_result 0 "Login with new password successful (HTTP $HTTP_STATUS)"
        else
            print_result 1 "Login with new password failed (HTTP $HTTP_STATUS)"
        fi
    else
        print_result 1 "Password reset failed (HTTP $HTTP_STATUS)"
    fi
    echo ""
fi

echo "========================================="
echo "Testing completed!"
echo "========================================="