# 🏋️ PowerFit – Gym & Fitness Accessories E-Commerce System

A full-stack MERN e-commerce application featuring a customer storefront, an administrative management dashboard, and a secure REST API with real-time stock management and order processing.

---

## 🌐 1. Live Deployment Links

- **Customer Storefront**: [https://gym-accessories-store-frontend.vercel.app/](https://gym-accessories-store-ie4ncdj7u-praveen-kalansooriyas-projects.vercel.app/) *(or your deployed frontend URL)*
- **Admin Dashboard**: [https://gym-accessories-store-admin.vercel.app/](https://gym-accessories-store-admin-hmkkwelyh.vercel.app/) *(or your deployed admin URL)*
- **Backend API**: [https://gym-accessories-store-backend.vercel.app/]([https://gym-accessories-store-backend.vercel.app/](https://gym-accessories-store-api.vercel.app/) *(or your deployed backend URL)*
- **GitHub Repository**: [https://github.com/Praveenmkl/gym-accessories-store](https://github.com/Praveenmkl/gym-accessories-store)

---

## 🛠️ 2. Tech Stack

- **Customer Frontend**: React 19, Vite, Tailwind CSS, Lucide Icons, React Icons, Axios, React Router v7
- **Admin Dashboard**: React 19, Vite, Axios, React Router v7
- **Backend API**: Node.js (ES Modules), Express 5, JSON Web Token (JWT), Bcrypt.js, CORS, Dotenv
- **Database**: MongoDB Atlas & Mongoose 9 (Serverless Connection Pooling)
- **Deployment**: Vercel (Frontend SPA, Admin SPA & Serverless Node.js API)

---

## ⚙️ 3. Setup Steps

### Prerequisites
- **Node.js**: `v18+` or later
- **MongoDB Atlas** database URI or local MongoDB instance

---

### 1. Clone & Install

```bash
git clone https://github.com/Praveenmkl/gym-accessories-store.git
cd "gym-accessories-store"
```

---

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/gym_store?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key
```

Run backend:
```bash
npm run dev
# Server running at http://localhost:5000
```

---

### 3. Customer Storefront Setup

In a new terminal:
```bash
cd frontend
npm install
```

Create a `.env` file in `frontend/`:
```env
VITE_API_URL=http://localhost:5000/api
```

Run frontend:
```bash
npm run dev
# Storefront running at http://localhost:5173
```

---

### 4. Admin Dashboard Setup

In a new terminal:
```bash
cd admin-dashboard
npm install
```

Create a `.env` file in `admin-dashboard/`:
```env
VITE_API_URL=http://localhost:5000/api
```

Run admin dashboard:
```bash
npm run dev
# Admin dashboard running at http://localhost:5174
```

---

### 5. Create Admin Account

To create or promote an admin account for the Admin Dashboard:

```bash
cd backend
npm run create-admin -- --email admin@example.com --password yourPassword123 --name "Admin"
```

---

## 🧪 4. How to Test Each Feature

### 1. User Registration & Authentication
1. Navigate to the storefront at `http://localhost:5173/register`.
2. Register a new user account with Name, Email, and Password.
3. Log in at `/login` and verify that the authentication token is stored and the Navbar reflects your logged-in state.

### 2. Admin Authentication & Role Protection
1. Run the admin creation command: `npm run create-admin -- --email admin@powerfit.com --password adminPass123 --name "Manager"`.
2. Open the Admin Dashboard at `http://localhost:5174/login`.
3. Log in with the admin credentials; verify you are redirected to the protected dashboard (`/`).
4. Attempting to access the admin portal with regular customer credentials will be rejected.

### 3. Product Catalog & Details
1. On the customer storefront (`/products`), browse the fitness equipment and accessories catalog.
2. Click any product card to open its detail page (`/product/:id`).
3. Verify product images, descriptions, price, and in-stock quantities are displayed accurately.

### 4. Cart Management
1. From the product detail page, select a quantity and click **Add to Cart**.
2. Go to the Cart page (`/cart`).
3. Adjust item quantities (`+` / `-`) or remove items; verify subtotal and grand total dynamically recalculate.

### 5. Checkout & Shipping Details Flow
1. From the Cart page, click **Proceed to Checkout** (redirects to `/checkout`).
2. If not logged in, verify you are redirected to `/login` with an automatic return to checkout upon successful login.
3. Fill in the shipping address details (Address, City, Postal Code, Phone Number) and submit the order.

### 6. Payment Processing & Order Placement
1. In the checkout flow, process the simulated payment.
2. Verify redirect to the Success page (`/success`) displaying confirmation details.
3. Verify that product stock automatically decrements in the database.

### 7. Order History & Cancellation
1. Navigate to My Orders (`/myorders`).
2. Verify your placed orders appear with their status (`Pending`, `Paid`, `Processing`, or `Delivered`), ordered items, price, and timestamp.
3. Click **Cancel Order** on an eligible pending order and confirm its status changes to `Cancelled`.

### 8. Admin Inventory & Product CRUD Management
1. Go to the Admin Dashboard (`http://localhost:5174`).
2. **Add Product**: Fill in Product Name, Price, Quantity (Stock), Image URL, and Description, then submit.
3. **Edit Product**: Click Edit on any row in the products table, update price or stock count, and save changes.
4. **Delete Product**: Click Delete to remove a discontinued item from the catalog.
5. Verify updates reflect immediately on both the Admin table and the Customer Storefront.
