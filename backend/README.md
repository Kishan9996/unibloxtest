# Backend for Product and Cart Management System

This project is a Node.js application built with TypeScript, Prisma, and SQLite. It manages product and cart functionality, including the checkout flow, product listings, and user authentication. Additionally, it features an admin panel for approving discounts and viewing user details.

## Backend Setup Instructions

Follow these steps to set up and run the backend:

### Prerequisites
- **Node.js version**: >= 20

### Setup Steps

1. **Create the `.env` file**  
   Copy the contents of `example.env` to a new `.env` file:
   ```bash
   cp example.env .env
   ```

2. **Run the Setup Script**  
   Install the required dependencies and complete the initial setup:
   ```bash
   npm run setup
   ```

3. **Start the Backend in Development Mode**  
   Launch the backend in development mode using the following command:
   ```bash
   npm run start:dev
   ```

4. **Access Swagger Documentation**  
   After running the backend, you can access the Swagger API documentation at:
   ```
   http://localhost:5015/swagger-doc/