# Tourister Backend API

Production-ready, scalable, clean, and secure Node.js & Express backend foundation for **Tourister** — Travel SaaS Application.

---

## 🛠 Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB
- **ORM / ODM:** Mongoose
- **Authentication:** JWT (JSON Web Tokens) with dual token architecture (Access + Refresh Tokens)
- **Security & Password Hashing:** `bcrypt`
- **CORS:** Configured cross-origin resource sharing
- **Environment Management:** `dotenv`

---

## 📁 Complete Backend Folder Structure

```
backend/
│
├── src/
│   ├── config/
│   │   ├── db.js              # Database connection logic
│   │   └── env.js             # Environment variables validation & config
│   │
│   ├── controllers/
│   │   └── auth.controller.js # HTTP request/response handlers
│   │
│   ├── models/
│   │   └── user.model.js      # Mongoose User schema & model
│   │
│   ├── routes/
│   │   └── auth.routes.js     # Route definitions and middleware binding
│   │
│   ├── middleware/
│   │   ├── auth.middleware.js # JWT access token verification middleware
│   │   ├── error.middleware.js# Global error handling middleware
│   │   └── notFound.middleware.js # 404 Route Not Found middleware
│   │
│   ├── services/
│   │   ├── auth.service.js    # Authentication business logic
│   │   └── otp.service.js     # OTP generation, hashing, verification & terminal logging
│   │
│   ├── validators/
│   │   └── auth.validator.js  # Request payload validation middleware
│   │
│   ├── utils/
│   │   ├── AppError.js        # Custom operational error class
│   │   ├── generateOtp.js     # Cryptographically secure 6-digit OTP generator
│   │   ├── generateToken.js   # JWT access & refresh token signing
│   │   └── apiResponse.js     # Standardized API response formatter
│   │
│   ├── constants/
│   │   └── auth.constants.js  # User roles and OTP constants
│   │
│   ├── app.js                 # Express app initialization & middleware configuration
│   └── server.js              # Server entry point, DB connection, & server start
│
├── .env                       # Environment variables (git-ignored)
├── .env.example               # Example environment variables template
├── .gitignore                 # Git ignore rules
└── package.json               # Node.js dependencies & scripts
```

---

## 🔐 Authentication Architecture & OTP Behavior

### New User Registration Flow:
1. Client sends `POST /api/auth/register` with `name`, `email`, and `password`.
2. Input is validated & normalized (`email.toLowerCase().trim()`).
3. User record created with `isEmailVerified: false`.
4. Cryptographically secure 6-digit OTP generated, hashed using `bcrypt`, saved with a 10-minute expiration.
5. Development OTP printed to terminal.
6. Returns `requiresVerification: true`. No JWT is issued.

### OTP Verification:
1. Client sends `POST /api/auth/verify-otp` with `email` and `otp`.
2. OTP is verified against stored hash and checked for expiration.
3. Account marked `isEmailVerified: true`, OTP fields cleared.
4. User is prompted to log in. No JWT is issued during verification.

### Returning / Unverified User Login Flow:
1. Client sends `POST /api/auth/login` with `email` and `password`.
2. Password verified using `bcrypt.compare()`.
3. If `isEmailVerified === false`:
   - Access & Refresh tokens are **NOT** issued.
   - NEW OTP generated, hashed, previous OTP invalidated.
   - New OTP printed to terminal.
   - Returns `{ requiresVerification: true }`.
4. If `isEmailVerified === true`:
   - 15-minute Access Token signed.
   - 7-day Refresh Token signed & stored securely on user record.
   - User profile returned (excluding sensitive fields).

---

## 🚀 Environment Variables

Copy `.env.example` to `.env`:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/tourister
JWT_ACCESS_SECRET=tourister_access_secret_key_prod_quality_2026_sec
JWT_REFRESH_SECRET=tourister_refresh_secret_key_prod_quality_2026_sec
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
CLIENT_URL=http://localhost:8081
OTP_EXPIRES_IN_MINUTES=10
```

---

## 🏃 Running Locally

### Installation:
```bash
npm install
```

### Development Mode (with hot reloading):
```bash
npm run dev
```

### Production Mode:
```bash
npm start
```

---

## 🌐 API Endpoints

| Method | Endpoint | Description | Protected |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/auth/register` | Register new user / request OTP for unverified user | ❌ |
| `POST` | `/api/auth/verify-otp` | Verify 6-digit OTP code | ❌ |
| `POST` | `/api/auth/resend-otp` | Resend new OTP for unverified user | ❌ |
| `POST` | `/api/auth/login` | Authenticate user & get Access/Refresh tokens | ❌ |
| `POST` | `/api/auth/refresh-token` | Obtain new Access Token using Refresh Token | ❌ |
| `POST` | `/api/auth/logout` | Revoke Refresh Token & Logout | ✅ |
| `GET`  | `/api/auth/me` | Fetch authenticated user profile | ✅ |
| `GET`  | `/api/health` | Backend API liveness check | ❌ |

---

## 🛡 Security Practices

1. **Passwords:** Always hashed using `bcrypt` (10 rounds). Never stored or returned in plain text.
2. **OTP:** Hashed with `bcrypt` in MongoDB. Expires after 10 minutes. Old OTPs automatically invalidated. Printed only in dev terminal.
3. **Tokens:** Separate secrets for Access Token (15m) and Refresh Token (7d).
4. **Data Leakage:** Sensitive fields (`password`, `otp`, `otpExpiresAt`, `refreshToken`) excluded from API responses.
5. **Request Identity:** `req.user.userId` retrieved from verified JWT, never trusted from request body/params.
6. **Error Masking:** Stack traces and internal server details hidden in production mode.

---

## 🧪 Testing Instructions

Run automated verification tests or use curl/Postman:

1. Register user: `POST /api/auth/register`
2. Check terminal for printed OTP.
3. Verify OTP: `POST /api/auth/verify-otp`
4. Login: `POST /api/auth/login` -> receive `accessToken` & `refreshToken`
5. Fetch Me: `GET /api/auth/me` with header `Authorization: Bearer <accessToken>`
6. Refresh Token: `POST /api/auth/refresh-token` with `{ "refreshToken": "<refreshToken>" }`
7. Logout: `POST /api/auth/logout` with header `Authorization: Bearer <accessToken>`
