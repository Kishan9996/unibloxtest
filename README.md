# Product and Cart Management System  

This repository contains the source code for the **Product and Cart Management System**, structured as a monorepo with separate directories for the backend and frontend applications.  

## Project Structure  

```
/backend      - Backend application (Node.js, TypeScript, Prisma, SQLite)
/frontend     - Frontend application (React, authentication, product/cart management)
/README.md    - Root-level README file
```  

## Backend  

The backend is built with Node.js and TypeScript and uses Prisma with SQLite for database management. It provides functionality for product and cart operations, user authentication, and an admin panel for managing discounts and user details.  

For detailed setup and usage instructions, see the [backend README](./backend/README.md).  

## Frontend  

The frontend is a React-based application that includes product listing, cart management, a checkout flow, user authentication, and an admin panel for approving discounts.  

For detailed setup and usage instructions, see the [frontend README](./frontend/README.md).  

## API Documentation  

The backend includes Swagger API documentation, which can be accessed at:  
```
http://localhost:5015/swagger-doc/#/
```  
**Username:** `admin`  
**Password:** `admin`  

## Application Access  

### Admin Page  

Access the admin panel at:  
```
http://localhost:5173/admin-login
```  
**Credentials:**  
- **Email:** `admin@uniblox.com`  
- **Password:** `Admin@123`  

### User Page  

Access the user login page at:  
```
http://localhost:5173/login
```  
**Credentials:**  
- **Email:** `user@uniblox.com`  
- **Password:** `User@123`  
