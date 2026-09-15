# 🏋️ PowerFit – Gym & Fitness Accessories E-Commerce System

A full-stack MERN e-commerce application featuring a customer storefront, an administrative management dashboard, and a secure REST API with real-time inventory management and order processing.

---

## 🌐 1. Live Deployment Links

- **Customer Storefront**: [https://gym-accessories-store-ie4ncdj7u-praveen-kalansooriyas-projects.vercel.app/](https://gym-accessories-store-ie4ncdj7u-praveen-kalansooriyas-projects.vercel.app/)
- **Admin Dashboard**: [https://gym-accessories-store-admin-hmkkwelyh.vercel.app/](https://gym-accessories-store-admin-hmkkwelyh.vercel.app/)
- **Backend API**: [https://gym-accessories-store-api.vercel.app/](https://gym-accessories-store-api.vercel.app/)
- **GitHub Repository**: [https://github.com/Praveenmkl/gym-accessories-store](https://github.com/Praveenmkl/gym-accessories-store)

---

## 🔑 2. Default Admin Credentials

- **Email**: `admin@gmail.com`
- **Password**: `Admin@123`
- **Portal**: [Admin Dashboard Login](https://gym-accessories-store-admin-hmkkwelyh.vercel.app/login)

---

## 🛠️ 3. Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS, Lucide Icons, React Icons, Axios, React Router v7
- **Admin Dashboard**: React 19, Vite, Axios, React Router v7
- **Backend**: Node.js, Express 5, JWT, Bcrypt.js, CORS, Dotenv
- **Database**: MongoDB Atlas & Mongoose 9
- **Deployment**: Vercel (Frontend, Admin & Serverless Backend API)

---

## ⚙️ 4. Setup Steps

### Prerequisites
- Node.js: `v18+`
- MongoDB Atlas database URI

### 1. Clone & Install
```bash
git clone https://github.com/Praveenmkl/gym-accessories-store.git
cd gym-accessories-store
```

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

### 3. Frontend Setup
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
# Running at http://localhost:5173
```

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
# Running at http://localhost:5174
```

### 5. Create / Reset Admin Account
```bash
cd backend
npm run create-admin -- --email admin@gmail.com --password Admin@123 --name "Admin"
```

---

## 🧪 5. How to Test Each Feature

### 1. Authentication & Roles (Customer vs. Admin)
- Go to `/register` on the frontend and create a new customer account.
- Log in at `/login` as customer: verify access to cart, checkout, and order history.
- Go to `http://localhost:5174/login` on admin dashboard: log in with the admin credentials (`admin@gmail.com` / `Admin@123`).
- Verify customer accounts cannot access the admin dashboard.

### 2. Product Catalog & Details
- Go to `/products` on the customer storefront.
- Browse items and click a product to open `/product/:id`.
- Verify price, stock quantity, and description display correctly.

### 3. Shopping Cart
- Click **Add to Cart** from product details.
- Go to `/cart`: increase/decrease quantities, remove items, and verify total price updates dynamically.

### 4. Checkout & Order Placement
- From `/cart`, click **Proceed to Checkout**.
- Enter shipping details (Address, City, Postal Code, Phone).
- Complete payment: verify redirect to `/success` and stock quantity decreases in database.

### 5. Order History & Tracking
- Go to `/myorders` as a logged-in user.
- Verify placed orders show item list, total amount, date, and current status (`Pending`/`Paid`).
- Click **Cancel Order** to test order cancellation.

### 6. Admin Product & Inventory Management (CRUD)
- Open Admin Dashboard (`http://localhost:5174`).
- **Add Product**: Fill name, price, quantity (stock), image URL, description and save.
- **Edit Product**: Click Edit to modify price or stock; verify changes reflect on customer storefront.
- **Delete Product**: Delete a product and verify removal from catalog.
