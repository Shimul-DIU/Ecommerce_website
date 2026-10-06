# 🛒 ShimulShopping – Full Stack E-commerce Website

**ShimulShopping** is a responsive, full-stack e-commerce web application built with the MERN stack. Customers can browse and search products, manage a cart and wishlist, place orders and manage their account. A separate admin panel lets administrators manage products, customers and orders.

🌐 **Live Demo:** https://shimulshopping.web.app/
📂 **Repository:** https://github.com/Shimul-DIU/Ecommerce_website

---

## 📑 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Overview](#-api-overview)
- [Security](#-security)
- [Deployment](#-deployment)
- [Screenshots](#-screenshots)
- [Author](#-author)

---

## ✨ Features

### 👤 Customer
- Register / login with email and password, or **Google sign-in**
- Forgot and reset password via email
- Browse products by category (Men, Women, Fishing, Offers and more)
- Search and filter products
- Product reviews
- Shopping cart with quantity update and remove
- Wishlist
- Checkout and order placement, order success page
- Order history
- User dashboard: overview, orders, cart, wishlist, saved addresses, profile
- Language / currency and theme context support
- Fully responsive (mobile, tablet, desktop)

### 🛠️ Admin
- Separate admin login with its own JWT strategy and password reset
- Admin dashboard
- Product management: add, edit and manage products with image upload (Cloudinary)
- Customer list
- Order management
- Protected admin routes

---

## 🧑‍💻 Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, Vite, React Router v7, Tailwind CSS v4, Axios, Firebase (Auth + Hosting), Font Awesome, Lucide React, React Icons |
| **Backend** | Node.js, Express 5, MongoDB, Mongoose, Passport (JWT), bcrypt, Multer + Cloudinary, Nodemailer / Resend |
| **Security** | Helmet, express-rate-limit, xss-clean, CORS, HTTP-only cookies |
| **Tools & Hosting** | Git, GitHub, GitHub Actions, VS Code, Postman, Firebase Hosting (frontend), Render (backend) |

---

## 🏗️ Project Structure

```text
Ecommerce_website/
├── .github/workflows/          # Firebase Hosting CI/CD (merge + pull request)
├── client/                     # React frontend (Vite)
│   ├── public/
│   └── src/
│       ├── assets/             # fonts, images
│       ├── auth/               # Login, Register, Admin login, reset password
│       ├── components/
│       │   ├── admin/          # AdminNavbar, AdminSidebar
│       │   ├── client/         # footer, categories, user dashboard components
│       │   ├── common/         # Navbar, ProductCard, HeroBanner, Card ...
│       │   └── home/           # DealOfTheDay, NewArrivals
│       ├── context/            # Auth, Count, Language, Theme contexts
│       ├── firebase/           # Firebase config
│       ├── hooks/              # useProducts, useScroll, useGoogleSignIn
│       ├── layout/             # Userlayout, Adminlayout
│       ├── pages/
│       │   ├── admin/          # Dashboard, Orders, Customers, Setting, product/
│       │   └── client/         # Home, Products, Checkout ... userDashboard/
│       ├── routes/             # router + protected routes
│       └── utils/              # axiosInstance, tokenManager, helpers
│
├── server/                     # Node.js + Express backend
│   ├── config/                 # db, cloudinary, mail, passport JWT strategies
│   ├── controller/             # auth, user, admin, product, order, review
│   ├── middleware/             # authMiddleware, upload (Multer)
│   ├── model/                  # user, admin, products, order, review
│   ├── routes/                 # API route definitions
│   ├── app.js                  # Express app, middleware, route mounting
│   ├── server.js               # Entry point (DB connect + listen)
│   └── seedAdmin.js            # Script to create the first admin
│
├── firebase.json
├── .firebaserc
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- A MongoDB database (local or MongoDB Atlas)
- A Firebase project (Auth + Hosting)
- A Cloudinary account (product image uploads)

### 1. Clone the repository

```bash
git clone https://github.com/Shimul-DIU/Ecommerce_website.git
cd Ecommerce_website
```

### 2. Backend setup

```bash
cd server
npm install
```

Create a `.env` file in `server/` (see [Environment Variables](#-environment-variables)), then:

```bash
# (optional) create the first admin account
node seedAdmin.js

# start the server
npm start
```

The API runs at `http://localhost:5000`.

### 3. Frontend setup

Open a second terminal:

```bash
cd client
npm install
```

Create a `.env` file in `client/`, then:

```bash
npm run dev
```

The app runs at `http://localhost:5173`.

### Available scripts

| Location | Command | Description |
|---|---|---|
| `client` | `npm run dev` | Start Vite dev server |
| `client` | `npm run build` | Production build |
| `client` | `npm run preview` | Preview production build |
| `client` | `npm run lint` | Run ESLint |
| `server` | `npm start` | Start the API server |

---

## 🔑 Environment Variables

> ⚠️ Never commit real `.env` files or secrets. Use placeholders only.

### `server/.env`

```env
PORT=5000
NODE_ENV=development
DB_URL=your_mongodb_connection_string
CLIENT_URL=http://localhost:5173

# JWT
ACCESS_TOKEN_SECRET=your_access_token_secret
JWT_ACCESS_SECRET=your_access_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
ADMIN_JWT_SECRET=your_admin_jwt_secret

# Admin seeding
SECRET_KEY=initial_admin_password

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email
RESEND_API_KEY=your_resend_api_key
FORGOT_PASSWORD=your_mail_config
```

### `client/.env`

```env
VITE_API_URL=http://localhost:5000

VITE_APIKEY=your_firebase_api_key
VITE_AUTHDOMAIN=your_project.firebaseapp.com
VITE_PROJECTID=your_project_id
VITE_STORAGEBUCKET=your_project.appspot.com
VITE_MESSAGINGSENDERID=your_sender_id
VITE_APPID=your_app_id
VITE_MEASUREMENTID=your_measurement_id
```

---

## 🔗 API Overview

Base URL: `/api`

| Route prefix | Purpose |
|---|---|
| `/api/auth` | User and admin register, login, refresh token, logout, forgot / reset password, Google login |
| `/api/user` | User profile (protected) |
| `/api/admin` | Admin operations such as adding products (protected) |
| `/api/products` | List and display products |
| `/api/orders` | Create orders and fetch order details (protected) |
| `/api/reviews` | Create and fetch product reviews |

---

## 🔐 Security

- Separate JWT strategies (Passport) for users and admins
- Access + refresh token flow with cookies
- Passwords hashed with bcrypt
- Helmet, rate limiting on login, XSS sanitization
- Protected routes on both client and server
- CORS restricted to the configured client origin

---

## ☁️ Deployment

- **Frontend:** Firebase Hosting, deployed automatically through GitHub Actions on merge to `main`
- **Backend:** Render
- **Database:** MongoDB Atlas
- **Media:** Cloudinary

---

## 📸 Screenshots

Add screenshots to a `screenshots/` folder and reference them here:

```md
![Home Page](./screenshots/home.png)
![Products Page](./screenshots/products.png)
![Cart Page](./screenshots/cart.png)
![User Dashboard](./screenshots/user-dashboard.png)
![Admin Dashboard](./screenshots/admin-dashboard.png)
```

---

## 🎯 What I Learned

- Building a complete MERN application with separate user and admin roles
- Designing REST APIs with Express and Mongoose
- Implementing JWT authentication with access / refresh tokens
- Handling image uploads with Multer and Cloudinary
- Structuring a scalable React project (layouts, contexts, hooks, protected routes)
- CI/CD with GitHub Actions and deploying to Firebase Hosting and Render

---

## 👨‍💻 Author

**Md. Shimul Mia** – Aspiring Full Stack Developer

- GitHub: https://github.com/Shimul-DIU
- LinkedIn: https://www.linkedin.com/in/md-shimul-71a4b331/
- Portfolio: https://shimul-portfolio.web.app

---

## ⭐ Support

If you find this project useful, please give it a ⭐ on GitHub.
