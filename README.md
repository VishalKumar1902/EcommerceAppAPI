# E-commerce API

This project is a backend API for an e-commerce platform, built with Node.js, Express.js, and MongoDB. It supports user authentication, product management, carts, and order management with role-based access control.

---

## Features

- User authentication and authorization (JWT-based).
- Role-based access for admin functionality.
- CRUD operations for products.
- Cart management for authenticated users.
- Order placement and order management.
- Admin functionality for managing products and orders.

---

## Getting Started

Follow the steps below to set up and run the project locally.

---

### Prerequisites

Ensure you have the following installed:
```bash
Node.js (v14 or higher)
MongoDB
Git
```

---

### Installation Steps

#### 1. Clone the Repository
```bash
git clone https://github.com/VishalKumar1902/EcommerceAppAPI.git
cd EcommerceAppAPI
```

#### 2. Install Dependencies
```bash
npm install
```

#### 3. Configure Environment Variables
Create a `.env` file in the root directory and configure the following variables:
```bash
PORT=5000
MONGO_URI=mongodb://localhost:27017/rbacProject
JWT_SECRET=your_jwt_secret
```


#### 4. Run the Application
```bash
node app.js
```

#### 5. Access the API
```bash
http://localhost:5000
```
