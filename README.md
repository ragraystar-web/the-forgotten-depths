# The Forgotten Depths

> **A dark fantasy bookstore where forgotten stories rise from the depths.**

The Forgotten Depths is a web-based bookstore project developed for **Programming 3**. It features a dark fantasy-themed storefront where users can browse books, view book details, manage a shopping cart, and process simulated orders.

The project combines a React frontend with a Node.js and Express backend. COBOL integration is planned as a future development stage, with the goal of incorporating COBOL into the application's business logic.

---

## Project Overview

The project is designed to demonstrate the development of a web application using frontend and backend technologies, API communication, validation, inventory handling, and software development practices.

### Objectives

- Develop a functional online bookstore interface.
- Implement frontend and backend communication.
- Create and consume REST API endpoints.
- Implement shopping cart functionality.
- Validate orders and quantities on the server.
- Protect order calculations from client-side price manipulation.
- Manage book inventory during checkout.
- Explore COBOL integration with a modern web application.

---

## Features

### Book Catalog
- Browse available books.
- View book information, descriptions, prices, and stock.
- Display book covers and themed storefront content.

### Book Details
- View additional information about selected books.
- Access book details through the storefront interface.

### Shopping Cart
- Add books to the cart.
- Adjust item quantities.
- Review cart items and totals.
- Manage cart contents before checkout.

### Checkout Processing
- Validate cart contents.
- Verify book IDs against the backend catalog.
- Validate item quantities.
- Check available inventory.
- Calculate prices using trusted backend data.
- Reject invalid orders or orders exceeding available stock.

### Inventory Management
- Deduct inventory after successful checkout validation.
- Refresh stock information after checkout.
- Account for multiple requests of the same book within an order.

### Order Completion
- Display checkout confirmation feedback.
- Clear the cart after successful checkout.
- Prevent duplicate submission of an already completed cart.
- Allow a new order to be started.

> **Note:** Checkout is currently simulated. No actual payment processing is performed.

---

## Technology Stack

| Technology | Purpose |
|---|---|
| React | Frontend user interface |
| Vite | Frontend development server and build tool |
| Node.js | Backend runtime |
| Express.js | Backend API framework |
| JavaScript | Application programming language |
| HTML | Application structure |
| CSS | Styling and layout |
| COBOL | Planned business logic integration |
| Git | Version control |
| GitHub | Repository hosting |
| GitHub Codespaces | Cloud development environment |

---

## Project Structure

```text
the-forgotten-depths/
│
├── backend/
│   ├── cobol/
│   │   └── README.md
│   ├── books.js
│   ├── index.js
│   ├── package.json
│   ├── package-lock.json
│   └── README.md
│
├── docs/
│   └── README.md
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── books.js
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   ├── package-lock.json
│   └── README.md
│
├── .gitignore
└── README.md
