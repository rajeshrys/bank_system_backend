# Bank System Backend

A secure backend banking system built using Node.js, Express.js, and MongoDB.  
This project provides APIs for user authentication, account management, balance handling, and transaction processing.

---

## Features

- User Authentication (JWT Based)
- Account Creation
- Deposit Money
- Withdraw Money
- Transfer Funds
- Transaction History
- Secure Password Hashing
- RESTful APIs
- MongoDB Database Integration
- Error Handling Middleware

---

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcrypt
- dotenv

---

## Project Structure

```bash
bank_system_backend/
│
├── controllers/
├── models/
├── routes/
├── middleware/
├── config/
├── .env
├── server.js
├── package.json
```

---

## Installation

Clone the repository:

```bash
git clone https://github.com/rajeshrys/bank_system_backend.git
```

Move into the project folder:

```bash
cd bank_system_backend
```

Install dependencies:

```bash
npm install
```

---

## Environment Variables

Create a `.env` file and add:

```env
PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
```

---

## Run the Project

Start the server:

```bash
npm start
```

For development:

```bash
npm run dev
```

---

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register User |
| POST | /api/auth/login | Login User |

### Banking

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/account/deposit | Deposit Money |
| POST | /api/account/withdraw | Withdraw Money |
| POST | /api/account/transfer | Transfer Funds |
| GET | /api/account/transactions | Transaction History |

---

## Security Features

- JWT Authentication
- Password Hashing using bcrypt
- Protected Routes
- Input Validation

---

## Future Improvements

- Frontend Integration
- Email Notifications
- Admin Dashboard
- Role-Based Access
- Docker Deployment
- Redis Caching

---

## Author

Rajesh

GitHub: https://github.com/rajeshrys
