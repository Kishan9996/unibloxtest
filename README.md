# Product and Cart Management System

This repository contains the code for both the **backend** and **frontend** of the Product and Cart Management System. It is structured as a monorepo with separate directories for the frontend and backend applications.

## Project Structure

```
/backend      - Backend code (Node.js, TypeScript, Prisma, SQLite)
/frontend     - Frontend code (React, authentication, product/cart management)
/README.md    - This file (Root-level README)
```

## Backend

The backend is a Node.js application that uses TypeScript, Prisma, and SQLite. It handles product and cart management, user authentication, and an admin panel for managing discounts and user details.

For setup and usage instructions, please refer to the [backend README](./backend/README.md).

## Frontend

The frontend is a React-based application that provides product listing, cart management, and a checkout flow, as well as user authentication and an admin panel for approving discounts.

For setup and usage instructions, please refer to the [frontend README](./frontend/README.md).

## Swagger Documentation

The backend includes Swagger API documentation, accessible at:
```
http://localhost:5015/swagger-doc/#/
```