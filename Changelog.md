# Payment Orchestrator System

A production-style multi-gateway payment orchestration platform built using Node.js, TypeScript, Express, MongoDB, Redis, BullMQ, Swagger, and Docker.

## Overview

This project provides a centralized payment orchestration layer that routes transactions through multiple payment gateways while ensuring reliability, fault tolerance, and observability.

The system supports:

- Multi-gateway payment processing
- Intelligent routing
- Circuit breaker pattern
- Automatic failover
- Retry queue processing
- Webhook handling
- Reconciliation jobs
- Health monitoring
- API authentication
- Swagger API documentation
- Docker deployment

---

# Architecture

```text
Client
   |
   v
API Layer
   |
   v
Payment Controller
   |
   v
Routing Engine
   |
   +----> Stripe Gateway
   |
   +----> Razorpay Gateway
   |
   +----> PayU Gateway
   |
   +----> UPI Gateway

Supporting Components
---------------------
• Circuit Breaker
• Retry Queue (BullMQ)
• Gateway Health Monitoring
• Webhook Processor
• Reconciliation Engine

Storage
--------
• MongoDB
• Redis
```

---

# Features

## Payment Processing

- Create payments
- Multi-gateway support
- Gateway routing
- Idempotency handling

## Supported Gateways

- Stripe
- Razorpay
- PayU
- UPI

## Transaction State Machine

```text
CREATED
   ↓
ROUTING
   ↓
PROCESSING
   ↓
SUCCESS

OR

FAILED
   ↓
RETRYING
   ↓
SUCCESS
```

## Circuit Breaker

Supports:

- CLOSED
- OPEN
- HALF_OPEN

Protects the platform from repeatedly sending traffic to unhealthy gateways.

## Retry Queue

Implemented using:

- BullMQ
- Redis

Automatically retries failed transactions.

## Failover

If one gateway becomes unavailable:

```text
Razorpay
    ↓
Stripe
    ↓
PayU
```

The system automatically switches to another healthy gateway.

## Webhooks

- Stripe webhook support
- Webhook event storage
- Duplicate event prevention

## Reconciliation

Periodic reconciliation jobs verify:

- Transaction integrity
- Gateway status consistency
- Internal record accuracy

## Health Monitoring

Tracks:

- Success rate
- Failure count
- Latency
- Health score

---

# Tech Stack

| Component | Technology |
|------------|------------|
| Backend | Node.js |
| Language | TypeScript |
| Framework | Express.js |
| Database | MongoDB |
| Queue | BullMQ |
| Cache | Redis |
| Documentation | Swagger |
| Containerization | Docker |

---

# Project Structure

```text
src/
│
├── api/
├── config/
├── controllers/
├── middleware/
├── repositories/
│   └── models/
├── services/
│   ├── gateways/
│   ├── routing/
│   ├── circuit-breaker/
│   ├── retries/
│   └── state-machine/
├── workers/
├── jobs/
├── queues/
├── utils/
└── server.ts
```

---

# API Endpoints

## Payments

### Create Payment

```http
POST /payments
```

Request:

```json
{
  "merchantId": "merchant_101",
  "amount": 5000,
  "currency": "INR",
  "idempotencyKey": "payment_001"
}
```

---

## Webhooks

### Stripe Webhook

```http
POST /webhooks/stripe
```

---

## Health

```http
GET /health
```

---

## Metrics

```http
GET /metrics
```

---

## Swagger

```http
GET /api-docs
```

---

# Local Setup

## Clone Repository

```bash
git clone <repository-url>
cd payment-orchestrator
```

## Install Dependencies

```bash
npm install
```

## Configure Environment

Create a `.env` file:

```env
PORT=5000

MONGO_URI=mongodb://localhost:27017/payment_orchestrator

REDIS_HOST=127.0.0.1
REDIS_PORT=6379

API_KEY=your_api_key
```

## Run Application

```bash
npm run dev
```

---

# Docker Setup

## Build Containers

```bash
docker compose build
```

## Start Services

```bash
docker compose up -d
```

## View Running Containers

```bash
docker ps
```

## Stop Services

```bash
docker compose down
```

---

# Testing

Verify:

### Health Endpoint

```text
http://localhost:5000/health
```

### Swagger UI

```text
http://localhost:5000/api-docs
```

### Payment API

```http
POST /payments
```

---

# Reliability Features

## Circuit Breaker

Prevents requests from being routed to failing gateways.

## Automatic Failover

Routes transactions to backup gateways.

## Retry Processing

Uses BullMQ workers to retry failed payments.

## Reconciliation

Detects inconsistencies between internal records and gateway responses.

## Audit Logging

Tracks all state transitions and payment events.

---

# Deliverables Completed

- Transaction State Machine
- Multi-Gateway Routing
- Stripe Integration
- Razorpay Integration
- PayU Integration
- UPI Integration
- Audit Logging
- Idempotency
- Health Monitoring
- Circuit Breaker
- Retry Queue
- Webhooks
- Reconciliation Engine
- Swagger Documentation
- Docker Deployment

---

# Future Enhancements

- Payment settlement tracking
- Advanced analytics dashboard
- ML-based gateway selection
- Notification service
- PostgreSQL support

---

# Author

**Mitanshu Thakkar**

Project Code: **493556A**

Payment Orchestrator System – Multi-Gateway Failover Platform