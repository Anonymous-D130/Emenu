# 🧾 Emenu – Digital Restaurant Ordering Platform

<p> 
    <img src="https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=java&logoColor=white" alt="java"/> 
    <img src="https://img.shields.io/badge/SpringBoot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white" alt="spring boot"/>
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="react"/> 
    <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="postgres"/>
    <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="docker"/>
    <img src="https://img.shields.io/badge/TailwindCSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="tailwindcss"/> 
    <img src="https://img.shields.io/badge/Material%20UI-007FFF?style=for-the-badge&logo=mui&logoColor=white" alt="material ui"/> 
    <img src="https://img.shields.io/badge/Ant%20Design-0170FE?style=for-the-badge&logo=antdesign&logoColor=white " alt="ant design"/> 
    <img src="https://img.shields.io/badge/WebSockets-0078D4?style=for-the-badge&logo=websocket&logoColor=white" alt="websockets"/> 
    <img src="https://img.shields.io/badge/REST%20API-02569B?style=for-the-badge&logo=api&logoColor=white" alt="rest api"/> 
    <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" alt="jwt"/> 
    <img src="https://img.shields.io/badge/CICD-005571?style=for-the-badge&logo=githubactions&logoColor=white" alt="ci-cd"/> 
    <img src="https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white" alt="git"/> 
    <img src="https://img.shields.io/badge/Lombok-4B8BBE?style=for-the-badge&logo=java&logoColor=white" alt="lombok"/> 
    <img src="https://img.shields.io/badge/Spring%20Data%20JPA-59666C?style=for-the-badge&logo=hibernate&logoColor=white" alt="jpa"/>
    <img src="https://img.shields.io/badge/Brevo%20(Sendinblue)-0078D4?style=for-the-badge&logo=sendinblue&logoColor=white" alt="brevo"/> 
    <img src="https://img.shields.io/badge/Maven-C71A36?style=for-the-badge&logo=apachemaven&logoColor=white" alt="maven"/> 
</p>

---

## 🚀 Project Overview

**Emenu** is a modern, full-stack digital restaurant ordering system designed to streamline the dining experience. It offers customers an intuitive interface to browse menus and place orders, while providing restaurant staff with efficient tools to manage orders and menus in real-time.

---

## ✨ Key Features

* ✅ **Interactive Digital Menu**
  Customers can scan the QR provided to browse, search, and order through categorized menu items with images and descriptions.
* ✅ **Real-Time Order Management**
  Orders placed by customers are instantly available to kitchen and service staff for prompt preparation and delivery, thanks to WebSocket-based live updates.
* ✅ **Ring the Bell (Call Waiter)**
  Customers can tap a Ring the Bell button in the app UI to alert restaurant staff for attention — implemented using WebSockets for instant notifications.
* ✅ **Restaurant Dashboard**
  Restaurant administrators can add, update, or remove menu items, manage categories, and monitor order statuses.
* ✅ **Responsive Design**
  Optimized for various devices, ensuring a seamless experience on tablets, smartphones, and desktops.
* ✅ **Secure Authentication**
  Role-based access control for customers, staff, and administrators to ensure data integrity and security.
* ✅ **Admin Portal**
  An admin portal providing full control to manage users, subscriptions, and overall system operations.

---

## 🛠️ Tech Stack

### Frontend

* **React.js** – Building dynamic and responsive user interfaces.
* **HTML5 & CSS3** – Structuring and styling the application.
* **TailWind** - Easy and professional tool for styling the HTML components.
* **JavaScript (ES6+)** – Implementing client-side logic.

### Backend

* **Java 21** – Core programming language for backend development.
* **Spring Boot** – Framework for building robust RESTful APIs.
* **Maven** – Dependency management and build automation.

### Database

* **PostgreSQL** – Relational database for storing user data, menu items, and orders.

### DevOps

* **Docker** – Containerization for consistent deployment across environments.

---

## 📁 Project Structure

```
Emenu/
├── Backend/               # Spring Boot backend application
├── react-app/             # React frontend application
├── .idea/                 # IDE configuration files
├── qodana.yaml            # Qodana configuration for code analysis
└── README.md              # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites

* **Java 21** or higher
* **Node.js** and **npm**
* **Postgres** database
* **Docker** (optional, for containerization)

### Backend Setup

1. Navigate to the backend directory:

   ```bash
   cd Backend
   ```

2. Build the project using Maven:

   ```bash
   mvn clean install
   ```

3. Run the Spring Boot application:

   ```bash
   mvn spring-boot:run
   ```

### Frontend Setup

1. Navigate to the React application directory:

   ```bash
   cd react-app
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm start
   ```

The application should now be running locally. Access the frontend at `http://localhost:3000` and the backend API at `http://localhost:8080`.

---

## 🧪 Running Tests

### Backend Tests

Navigate to the backend directory and execute:

```bash
mvn test
```

### Frontend Tests

Navigate to the React application directory and execute:

```bash
npm test
```

---

## 📦 Deployment

For deployment, consider using Docker to containerize both the frontend and backend applications for consistent and scalable deployments.

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.

2. Create a new branch:

   ```bash
   git checkout -b feature/YourFeature
   ```

3. Commit your changes:

   ```bash
   git commit -m "Add YourFeature"
   ```

4. Push to the branch:

   ```bash
   git push origin feature/YourFeature
   ```

5. Open a pull request detailing your changes.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 📧 Contact

For any inquiries or feedback, please reach out to [Dhruv Gupta](mailto:dhruv@example.com).

---