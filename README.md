# 🛒 ShimulShopping – Full Stack E-commerce Website

**ShimulShopping** is a modern, responsive, full-stack e-commerce web application where customers can browse products, search and filter products, manage their cart and wishlist, place orders, and manage their accounts. It also includes an admin dashboard for managing products, categories, users, and orders.

---

## 🌐 Live Website

🔗 **Live Demo:** https://shimulshopping.web.app/

---

## 📂 Repository

🔗 **GitHub:** https://github.com/Shimul-DIU/Ecommerce_website

---

## ✨ Features

### 👤 Customer Features

* User registration and login
* Secure authentication
* Browse products by category
* Product search functionality
* Product filtering
* Product details
* Add products to cart
* Update cart quantity
* Remove products from cart
* Wishlist functionality
* Place orders
* View order history
* Manage user profile
* Manage saved addresses
* Responsive design for mobile, tablet, and desktop

### 🛠️ Admin Features

* Admin authentication
* Admin dashboard
* Product management
* Add, update, and delete products
* Category management
* User management
* Order management
* View order details
* Manage product inventory

---

## 🧑‍💻 Technologies Used

### Frontend

* React.js
* JavaScript (ES6+)
* React Router
* Tailwind CSS
* Axios
* Firebase
* Font Awesome
* Lucide React
* Vite

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* Passport.js
* REST API
* Multer

### Tools & Services

* Git
* GitHub
* VS Code
* Postman
* Firebase Hosting
* Render

---

## 🏗️ Project Structure

```text
Ecommerce_website/
│
├── client/                 # React frontend
│   ├── src/
│   ├── public/
│   └── ...
│
├── server/                 # Node.js & Express backend
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── ...
│
├── public/
├── .github/
├── firebase.json
├── .gitignore
└── README.md
```

---

## 🔐 Authentication

The application implements authentication and authorization for both customers and administrators.

Authentication-related features include:

* JWT-based authentication
* Protected routes
* Admin authorization
* User authorization
* Secure refresh-token handling
* Password protection
* Login and logout functionality

---

## 🛍️ Product Management

Customers can:

* Browse products
* Search products
* Filter products
* View product details
* Add products to cart
* Add products to wishlist

Administrators can:

* Add products
* Update products
* Delete products
* Manage categories
* Manage product information

---

## 🛒 Shopping Cart & Wishlist

The shopping cart allows users to:

* Add products
* Increase or decrease quantity
* Remove products
* View cart totals

Users can also save products to their wishlist and manage saved products.

---

## 📦 Order Management

Customers can:

* Place orders
* View previous orders
* View order details
* Track order status

Administrators can:

* View customer orders
* View order details
* Manage order status

---

## 📱 Responsive Design

The website is designed to work across different screen sizes:

* 📱 Mobile
* 💻 Desktop
* 📟 Tablet

The UI uses responsive layouts and Tailwind CSS utilities to provide a consistent shopping experience across devices.

---

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Shimul-DIU/Ecommerce_website.git
```

### 2. Navigate to the Project

```bash
cd Ecommerce_website
```

---

## 🚀 Frontend Setup

```bash
cd client
npm install
```

Create a `.env` file inside the `client` directory:

```env
VITE_API_URL=your_backend_api_url
```

Start the frontend development server:

```bash
npm run dev
```

---

## 🖥️ Backend Setup

Open another terminal:

```bash
cd server
npm install
```

Create a `.env` file inside the `server` directory:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
```

Start the backend server:

```bash
npm run dev
```

---

## 🔗 API

The backend provides RESTful APIs for:

* Authentication
* Users
* Products
* Categories
* Orders
* Admin operations

The frontend communicates with the backend using Axios.

---

## 🎯 Project Goals

The main goals of this project are:

* Build a complete full-stack e-commerce application
* Practice modern React development
* Implement RESTful APIs
* Work with MongoDB and Mongoose
* Implement authentication and authorization
* Build an admin management system
* Create responsive and user-friendly interfaces
* Deploy a real-world web application

---

## 📸 Project Preview

Add screenshots of the following pages here:

* Home Page
* Product Listing
* Product Details
* Shopping Cart
* Wishlist
* User Dashboard
* Admin Dashboard

Example:

```md
![Home Page](./screenshots/home.png)
![Products Page](./screenshots/products.png)
![Cart Page](./screenshots/cart.png)
![Admin Dashboard](./screenshots/admin-dashboard.png)
```

---

## 👨‍💻 Developer

### Md. Shimul Mia

**Aspiring Software Developer | Full-Stack Developer**

* GitHub: https://github.com/Shimul-DIU
* LinkedIn: https://www.linkedin.com/in/md-shimul-71a4b331/
* Portfolio: https://shimulportfolio.netlify.app/

---

## ⭐ Support

If you find this project useful, consider giving the repository a ⭐ on GitHub.
