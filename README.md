# 🏋️ PowerFit – Gym & Fitness Accessories E-Commerce System

A full-stack MERN e-commerce application featuring a customer storefront, an administrative management dashboard, and a secure REST API with real-time inventory management and order processing.

---

## 🌐 1. Live Deployment Links

* **Customer Storefront**: https://gym-accessories-store-50h9b25eo-praveen-kalansooriyas-projects.vercel.app/
* **Admin Dashboard**: https://gym-accessories-store-50h9b25eo-praveen-kalansooriyas-projects.vercel.app/admin/login
* **Backend API**: https://gym-accessories-store-api.vercel.app/
* **GitHub Repository**: https://github.com/Praveenmkl/gym-accessories-store

---

## 🔑 2. Default Admin Credentials

* **Email**: `admin@gmail.com`
* **Password**: `Admin@123`
* **Portal**: [Admin Dashboard Login](https://gym-accessories-store-50h9b25eo-praveen-kalansooriyas-projects.vercel.app/admin/login)

---

## 🛠️ 3. Tech Stack

* **Frontend**: React 19, Vite, Tailwind CSS, Lucide Icons, React Icons, Axios, React Router v7
* **Admin Dashboard**: React 19, Vite, Axios, React Router v7
* **Backend**: Node.js, Express 5, JWT, Bcrypt.js, CORS, Dotenv
* **Database**: MongoDB Atlas & Mongoose 9
* **Deployment**: Vercel (Frontend & Serverless Backend API)

---

## ⚙️ 4. Setup Steps

### Prerequisites

* Node.js `v18+`
* MongoDB Atlas database URI

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
```

Server runs at:

```text
http://localhost:5000
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
```

Frontend runs at:

```text
http://localhost:5173
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
```

Admin dashboard runs at:

```text
http://localhost:5174/admin/login
```

### 5. Create / Reset Admin Account

```bash
cd backend
npm run create-admin -- --email admin@gmail.com --password Admin@123 --name "Admin"
```

---

## 🧪 5. How to Test Each Feature

### 1. Authentication & Roles

* Go to `/register` on the customer storefront and create a new customer account.
* Log in at `/login` as a customer.
* Verify access to cart, checkout, and order history.
* Open `/admin/login` to access the admin portal.
* Log in using the default admin credentials.
* Verify customer accounts cannot access admin-only features.

### 2. Product Catalog & Details

* Go to `/products` on the customer storefront.
* Browse available products.
* Click a product to open `/product/:id`.
* Verify price, stock quantity, images, and description.

### 3. Shopping Cart

* Click **Add to Cart** from a product page.
* Go to `/cart`.
* Increase or decrease product quantities.
* Remove products from the cart.
* Verify the total price updates correctly.

### 4. Checkout & Order Placement

* From `/cart`, click **Proceed to Checkout**.
* Enter shipping details:

  * Address
  * City
  * Postal Code
  * Phone
* Complete the payment process.
* Verify successful redirection to `/success`.
* Verify stock quantity is updated in the database.

### 5. Order History & Tracking

* Go to `/myorders` as a logged-in customer.
* Verify placed orders display:

  * Items
  * Total amount
  * Order date
  * Current status
* Test the **Cancel Order** functionality.

### 6. Admin Product & Inventory Management

Open the admin portal:

`/admin/login`

After logging in:

* **Add Product** — Create a product with name, price, stock, image URL, and description.
* **Edit Product** — Update product information, price, or stock.
* **Delete Product** — Remove a product from the catalog.
* Verify changes are reflected on the customer storefront.

---

## 📌 Project Structure

```text
gym-accessories-store/
│
├── frontend/          # Customer storefront
├── admin-dashboard/   # Admin dashboard
├── backend/           # REST API & server
└── README.md
```

---

## 👨‍💻 Author

**Praveen Kalansooriya**

* GitHub: [Praveenmkl](https://github.com/Praveenmkl)
* Portfolio: [Portfolio](https://portfolio26-flax.vercel.app/)
* LinkedIn: [Praveen Kalansooriya](https://www.linkedin.com/in/praveen-kalansooriya-219198303/)

