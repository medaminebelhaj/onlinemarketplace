# Online Marketplace

## 📌 About the Project

The **Online Marketplace** is a full-stack eCommerce platform that enables users to browse, purchase, and manage products. The application is built using **Spring Boot** for the backend and **React** for the frontend, with **MySQL** as the database and **Redis** for caching the shopping cart data.

---

## 🚀 Features

- 🛍️ **User Authentication** (Login & Registration)  
- 📦 **Product Management** (Add, Edit, Delete, View Products)  
- 🛒 **Shopping Cart** (Stored using Redis for performance optimization)  
- 💳 **Order Management** (Checkout, Order History)  
- 🔒 **Admin Dashboard** (Manage Users, Orders, and Inventory)  
- 📊 **REST API with Spring Boot**  

---

## 🛠️ Tech Stack

### **Backend (Spring Boot)**

- Spring Boot (Java)  
- Spring Security (JWT Authentication)  
- Spring Data JPA (MySQL Database)  
- Redis (Shopping Cart Caching)  
- RESTful APIs  

### **Frontend (React)**

- React.js  
- React Router (Navigation)  
- Redux (State Management)  
- Tailwind CSS (Styling)  

### **Database**

- MySQL (Relational Database)  
- Redis (Cache for shopping cart data)  



---

## 🚀 Getting Started

### **Prerequisites**  

Make sure you have the following installed:

- Java 17+  
- Node.js & npm  
- MySQL  
- Redis  
- Git  

### **Setup Instructions**  

#### **1️⃣ Clone the Repository**

```sh
git clone https://github.com/medaminebelhaj/onlinemarketplace.git
cd onlinemarketplace
```

#### **2️⃣ Backend Setup**

```sh
cd src
mvn clean install
mvn spring-boot:run
```

#### **3️⃣ Frontend Setup**

```sh
cd ../client
npm install
npm start
```

---

## 📚 API Endpoints (Example)

### **Authentication**

| Method | Endpoint           | Description          |
|--------|-------------------|----------------------|
| POST   | `/api/auth/register` | Register a new user |
| POST   | `/api/auth/login` | User login          |

### **Products**

| Method | Endpoint         | Description                   |
|--------|-----------------|-------------------------------|
| GET    | `/api/products` | Get all products             |
| POST   | `/api/products` | Add a new product (Admin only) |

---

## 🛡️ Security & Authentication

- **JWT Authentication** for secure access.  
- **Role-based access** (User/Admin privileges).  

---

## 📜 License

This project is licensed under the **MIT License**.

---

## 🤝 Contributing

Contributions are welcome! Feel free to open a PR or an issue.

---

## 📞 Contact

- **Author:** Mohamed Amine Belhaj  
- **GitHub:** [medaminebelhaj](https://github.com/medaminebelhaj)  
- **Email:** aminebelhaj2003@example.com  

🚀 **Happy Coding!**
