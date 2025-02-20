# online-clothing
# Clothing Store Backend

This is the backend API for the online clothing store. The backend is built using Node.js, Express, and MongoDB, and provides the functionality for managing products, orders, and users.

## Features

- **Product Management**: Add, update, and delete products in the store.
- **Order Management**: Create, update, and manage customer orders.
- **User Authentication**: Register and log in users with JWT authentication.
- **Admin Access**: Admin users can manage products, view all orders, and update order statuses.

## Tech Stack

- **Node.js**: JavaScript runtime environment used to build the backend.
- **Express**: Web framework for Node.js to handle routes and requests.
- **MongoDB**: NoSQL database to store product, order, and user data.
- **Mongoose**: ODM (Object Data Modeling) library for MongoDB and Node.js.
- **JWT (JSON Web Token)**: For user authentication and authorization.
- **bcryptjs**: Library for password hashing.

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (or MongoDB Atlas for cloud database)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/gebibebi/online-clothing.git
   cd online-clothing

 - Install dependencies:


npm install
Set up the environment variables: Create a .env file in the root of the project and add the following variables:


MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
Run the application:

npm start
The server will be running at http://localhost:5003.

**API Endpoints**
User Routes
- POST /api/users/register: Register a new user.
- POST /api/users/login: Log in an existing user to get a JWT token.

- 
**Product Routes**
- GET /api/products: Get all products.
- POST /api/products: Add a new product (admin only).
- PUT /api/products/:id: Update a product (admin only).
- DELETE /api/products/:id: Delete a product (admin only).

  
**Order Routes**
- GET /api/orders: Get all orders (admin only).
- GET /api/orders/:id: Get a specific order by ID (user can only view their own orders).
- POST /api/orders: Create a new order.
- PUT /api/orders/:id: Update the status of an order (admin only).
- DELETE /api/orders/:id: Delete an order (admin only).
  
**Security**
- Authentication: All endpoints require authentication except for the register and login endpoints.
- Authorization: Admins have access to all routes. Regular users can only view and manage their own orders.
- 
**Future Improvements**
- Implement email notifications for order updates.
- Add more advanced search filters for products (by category, price, etc.).
- Integrate payment gateway for processing orders.
- Improve validation and error handling.

