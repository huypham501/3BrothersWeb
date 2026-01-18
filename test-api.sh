#!/bin/bash

echo "🧪 Testing API Routes..."
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

BASE_URL="http://localhost:3000"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "1️⃣  Testing Get In Touch API (Creator)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "${YELLOW}Valid data:${NC}"
curl -s -X POST $BASE_URL/api/get-in-touch \
  -H "Content-Type: application/json" \
  -d '{
    "email": "creator@example.com",
    "channelLink": "https://youtube.com/@example",
    "content": "I want to collaborate",
    "isCreator": 1
  }' | jq '.'

echo ""
echo "${YELLOW}Invalid email:${NC}"
curl -s -X POST $BASE_URL/api/get-in-touch \
  -H "Content-Type: application/json" \
  -d '{
    "email": "not-an-email",
    "channelLink": "https://youtube.com/@example",
    "content": "Test",
    "isCreator": 1
  }' | jq '.'

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "2️⃣  Testing Newsletter API"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "${YELLOW}Valid data:${NC}"
curl -s -X POST $BASE_URL/api/newsletter \
  -H "Content-Type: application/json" \
  -d '{
    "fullname": "John Doe",
    "email": "john@example.com",
    "occupation": "Content Creator"
  }' | jq '.'

echo ""
echo "${YELLOW}Missing occupation:${NC}"
curl -s -X POST $BASE_URL/api/newsletter \
  -H "Content-Type: application/json" \
  -d '{
    "fullname": "John Doe",
    "email": "john@example.com"
  }' | jq '.'

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "3️⃣  Testing Search API"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "${YELLOW}Valid search:${NC}"
curl -s -X POST $BASE_URL/api/search \
  -H "Content-Type: application/json" \
  -d '{
    "keyword": "3brothers network"
  }' | jq '.'

echo ""
echo "${GREEN}✅ All tests completed!${NC}"
echo ""
echo "Visit http://localhost:3000/api-test for interactive testing"
