Perfect 🙌 Here’s your **polished and final README** for **Botanica** with all the fixes + screenshots section included:

---

# 🌿 Botanica – E-commerce Plant Store

![MERN Stack](https://img.shields.io/badge/MERN-Full%20Stack-green.svg)
![React](https://img.shields.io/badge/React-18.2-blue.svg)
![Node.js](https://img.shields.io/badge/Node.js-Express-brightgreen.svg)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green.svg)
![JWT](https://img.shields.io/badge/Auth-JWT-orange.svg)

**Botanica** is a full-stack e-commerce platform specializing in indoor and outdoor plants.
It offers dedicated **customer** and **admin** interfaces, a robust product management system, secure authentication, and smooth order processing.

---

## 🌐 Live Demo

[Visit Botanica](https://your-deployed-link.com) 🚀 *(replace with your deployed site URL)*

---

## ✨ Features

### 👤 Customer Features

* **User Registration & Authentication** – Secure signup/login with JWT
* **Product Browsing** – Filter plants by categories & collections
* **Shopping Cart** – Add/remove items with persistent storage
* **Wishlist** – Save favorite plants for later
* **Order Management** – Place orders & view order history
* **Product Reviews** – Rate & review purchased plants

### 👨‍💼 Admin Features

* **Dashboard Analytics** – Sales reports & revenue insights
* **Product Management** – Full CRUD operations for products
* **Inventory Management** – Track & update stock levels
* **Order Processing** – Update status & manage fulfillment
* **User Management** – Manage customer accounts
* **Category/Collection Management** – Organize products easily

---

## 🖼️ Screenshots & Preview

### 🏠 Customer View

| Home Page                                     | Product Details                                     | Shopping Cart                                 |
| --------------------------------------------- | --------------------------------------------------- | --------------------------------------------- |
| ![Home](frontend/public/screenshots/home.png) | ![Product](frontend/public/screenshots/product.png) | ![Cart](frontend/public/screenshots/cart.png) |

### 📊 Admin Dashboard

| Dashboard Overview                                      | Product Management                                    | Orders                                            |
| ------------------------------------------------------- | ----------------------------------------------------- | ------------------------------------------------- |
| ![Dashboard](frontend/public/screenshots/dashboard.png) | ![Products](frontend/public/screenshots/products.png) | ![Orders](frontend/public/screenshots/orders.png) |

---

## 🛠️ Technology Stack

### Frontend

* **React (18.2)** – Component-based UI
* **Redux Toolkit** – State management
* **React Router** – Routing
* **Tailwind CSS** – Styling
* **React Toastify** – Notifications
* **ApexCharts** – Admin analytics

### Backend

* **Node.js** – Runtime environment
* **Express.js** – Server framework
* **MongoDB + Mongoose** – Database & schema modeling
* **JWT + Bcrypt** – Authentication & password security
* **Multer** – File uploads
* **Nodemailer** – Email notifications

### Deployment

* **Vercel / Netlify** – Frontend hosting
* **Render / Heroku** – Backend hosting
* **MongoDB Atlas** – Cloud database
* **Cloudinary** – Image storage & optimization

---

## 📦 Installation

### Prerequisites

* Node.js (v14+)
* MongoDB Atlas account (or local MongoDB)
* Git

### Setup

1. **Clone repository**

   ```bash
   git clone https://github.com/your-username/botanica.git
   cd botanica
   ```

2. **Backend dependencies**

   ```bash
   npm install
   ```

3. **Frontend dependencies**

   ```bash
   cd frontend
   npm install
   ```

4. **Environment configuration**
   Create a `.env` file in the backend folder:

   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRE=30d
   COOKIE_EXPIRE=30
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your_email@gmail.com
   SMTP_PASS=your_app_password
   ```

5. **Run application**
   Start backend:

   ```bash
   npm run backend
   ```

   Start frontend:

   ```bash
   cd frontend
   npm run dev
   ```

6. **Access**

   * Frontend → `http://localhost:5173`
   * Backend API → `http://localhost:5000`

---

## 🗄️ Database Models

### User

```js
{
  name: String,
  email: String,
  password: String,
  avatar: String,
  role: "user" | "admin",
  createdAt: Date
}
```

### Product

```js
{
  name: String,
  description: String,
  price: Number,
  category: String,
  collections: [String],
  images: [String],
  stock: Number,
  featured: Boolean,
  careLevel: "easy" | "medium" | "difficult",
  lightRequirements: String,
  createdAt: Date
}
```

### Order

```js
{
  user: ObjectId,
  orderItems: [
    { name, quantity, price, image, product: ObjectId }
  ],
  totalPrice: Number,
  status: "processing" | "shipped" | "delivered",
  createdAt: Date
}
```

---

## 🔌 API Endpoints

### Auth

* `POST /api/auth/register` – Register user
* `POST /api/auth/login` – Login user
* `GET /api/auth/logout` – Logout user
* `GET /api/auth/me` – Current profile

### Products

* `GET /api/products` – All products (with filtering)
* `GET /api/products/:id` – Product details
* `POST /api/products` – Create (admin)
* `PUT /api/products/:id` – Update (admin)
* `DELETE /api/products/:id` – Delete (admin)

### Orders

* `POST /api/orders` – Create order
* `GET /api/orders` – User orders
* `GET /api/orders/:id` – Order details
* `PUT /api/orders/:id` – Update status (admin)

### Admin

* `GET /api/admin/users` – All users
* `GET /api/admin/stats` – Sales stats
* `GET /api/admin/sales` – Sales by date

---

## 🚀 Deployment

### Frontend (Vercel/Netlify)

1. Build: `npm run build`
2. Deploy with CLI or dashboard

### Backend (Render/Heroku)

1. Connect GitHub repo
2. Build command: `npm install`
3. Start command: `npm start`
4. Add environment variables

---

## 🤝 Contributing

1. Fork the repo
2. Create branch (`git checkout -b feature/YourFeature`)
3. Commit (`git commit -m "Add feature"`)
4. Push (`git push origin feature/YourFeature`)
5. Open PR

---

## 📝 License

This project is licensed under the MIT License – see [LICENSE](LICENSE.md).

---

## 🙏 Acknowledgments

* Plant illustrations → [Freepik](https://www.freepik.com)
* Icons → [React Icons](https://react-icons.github.io/react-icons/)
* UI inspiration from leading e-commerce platforms

---

## 📞 Support

For issues or inquiries, reach out at **[your-email@example.com](mailto:your-email@example.com)** or open an issue on GitHub.

---

🌱 **Botanica – Bringing nature’s beauty to your doorstep.** 🏡

---

Would you like me to also design a **fancy banner image** (with the Botanica name + a plant theme) that you can put at the very top of this README for a more professional look?
