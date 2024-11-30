# E-Commerce API

This repository contains an E-Commerce API project built using Node.js, Express, and MongoDB. It supports user authentication, product management, cart operations, and order processing with role-based access for admin features.

## Features

- **Authentication**: Register, login, and secure routes using JWT.
- **Product Management**: Fetch products for users.
- **Cart Operations**: Add, update, and remove products from the cart.
- **Order Management**: Place orders and manage order statuses.
- **Role-based Access**: Admin-only routes for managing orders.

---

## Installation and Setup

### Prerequisites
- [Node.js](https://nodejs.org/) and npm installed
- [MongoDB](https://www.mongodb.com/) (local or cloud setup)

### Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/VishalKumar1902/EcommerceAppAPI.git
   cd EcommerceAppAPI

   2. Install Dependencies
Install all necessary dependencies using npm:

npm install
3. Configure Environment Variables
Create a .env file in the root directory and configure the following variables:

PORT=5000
MONGO_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your_jwt_secret
4. Start the MongoDB Server
Ensure your MongoDB server is running:

mongod
5. Run the Application
Start the server:

npm start
6. Access the API
The API will be accessible at: http://localhost:5000.

API Endpoints
Authentication Routes
POST /auth/register - Register a new user.
POST /auth/login - Log in an existing user.
Cart Routes
