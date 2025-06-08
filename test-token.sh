#!/bin/bash
echo "Testing login..."
TOKEN_RESPONSE=$(curl -s -X POST http://localhost:5105/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "user1", "password": "password1"}')

echo "Login response: $TOKEN_RESPONSE"

# Extract token using basic text processing (you can use jq for better JSON parsing)
TOKEN=$(echo $TOKEN_RESPONSE | sed 's/.*"token":"\([^"]*\)".*/\1/')

echo "Extracted token: ${TOKEN:0:20}..."
echo ""

echo "Testing debug endpoint with token..."
curl -s -X GET http://localhost:5105/api/auth/debug-token \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"

echo ""
echo ""

echo "Testing notes endpoint with token..."
curl -s -X GET http://localhost:5105/api/notes \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
