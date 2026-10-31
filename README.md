# 🌿 Panchveda — Ayurvedic & Panchakarma Management API

A secure, production-ready RESTful API engineered for authentic Ayurvedic & Panchakarma hospitals, wellness centers, and clinics. Built with **Node.js**, **Express.js v5**, and **MongoDB (Mongoose)**, Panchveda powers complete clinical operations: patient record management, procedure catalogs, multi-therapy regimen planning, automated daily session scheduling, clinical vitals logging, auto-generated billing, and financial analytics.

---

## 🛠 Tech Stack

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Runtime** | Node.js (v18+) | High-throughput JavaScript backend runtime |
| **Framework** | Express.js v5 | Modern web framework with native Promise handling |
| **Database** | MongoDB + Mongoose 9 | Object-document modeling with automated indexing & relationships |
| **Authentication** | JWT (`jsonwebtoken`) | Bearer token-based stateless authentication |
| **Security** | `bcrypt` | Salted password hashing (cost factor 10) |
| **Validation** | `express-validator` | Comprehensive schema validation and sanitize middleware |
| **Documentation** | Swagger / OpenAPI 3.0 | Interactive API testing documentation via Swagger UI |
| **Testing** | Custom Integration Suite | 18 automated end-to-end integration tests |

---

## ✨ Core Features & Highlights

- 🔐 **3-Tier Role-Based Access Control (RBAC)**:
  - `admin`: Clinic-wide oversight, staff user management, therapy catalog configuration, and financial revenue reports.
  - `doctor`: Patient registration, medical history review, therapy plan prescription, and treatment monitoring.
  - `therapist`: Treatment queue management, session administration, patient allergy/Prakriti review, and vitals recording (billing & revenue hidden).
- 🌿 **Classical Panchakarma Auto-Seed**:
  - Automatically seeds the 5 foundational *Pradhana Karmas* on database startup:
    1. **Vamana** (Therapeutic Emesis)
    2. **Virechana** (Purgation Therapy)
    3. **Basti** (Medicated Enema)
    4. **Nasya** (Nasal Administration)
    5. **Raktamokshana** (Blood Purification)
- 🧑‍⚕️ **Patient Records & History**: Complete demographic and Ayurvedic profile (Prakriti, dosha imbalances, allergies, chronic ailments) with unified timeline tracking.
- 📋 **Automated Plan & Session Generation**: Prescribing a multi-therapy course automatically generates daily `Session` documents across the specified date range.
- 🗓️ **Clinical Vitals & Lakshana Tracking**: Record Blood Pressure (BP), Pulse rate, Patient Tolerance (*Samyak / Heena / Atiyoga*), and *Pathya* (dietary compliance) upon completing each session.
- 🧾 **Auto-Generated Invoices**: Plans automatically compute itemized bills with partial payment tracking, pending balance calculation, and payment receipts.
- 📊 **Executive & Financial Analytics**: Real-time revenue aggregation (`$match` & `$group`), top prescribed therapies pipeline (`$lookup` on therapies), and patient volume metrics.
- 🧪 **Automated E2E Test Suite**: Standalone verification script (`npm test`) validating 18 end-to-end flows in under 5 seconds.

---

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── db.js                   # MongoDB connection & auto-seed trigger
│   │   └── swagger.js              # Swagger/OpenAPI 3.0 configuration
│   ├── controllers/
│   │   ├── auth.controller.js      # Login & setup status
│   │   ├── bill.controller.js      # Plan invoices & payment recording
│   │   ├── patient.controller.js   # CRUD & full clinical history
│   │   ├── reports.controller.js   # Revenue, top therapies & patient metrics
│   │   ├── session.controller.js   # Daily queue, plan sessions & vitals update
│   │   ├── therapy.controller.js   # CRUD for therapy procedures
│   │   ├── therapyPlan.controller.js # Multi-day plan prescription & session generator
│   │   └── user.controller.js      # Staff user creation & status toggle
│   ├── middlewares/
│   │   ├── auth.js                 # JWT verification (protect)
│   │   ├── authorize.js            # Role-based authorization guard
│   │   ├── errorHandler.js         # Centralized error handler
│   │   └── validate.js             # express-validator result handler
│   ├── models/
│   │   ├── bill.model.js           # Invoices & payment logs
│   │   ├── patient.model.js        # Demographics & medical history
│   │   ├── session.model.js        # Daily treatments & clinical notes
│   │   ├── therapy.model.js        # Procedures, categories & pricing
│   │   ├── therapyPlan.model.js    # Prescribed regimen & date range
│   │   └── user.model.js           # Staff credentials, roles & active status
│   ├── routes/
│   │   ├── auth.route.js           # /api/auth
│   │   ├── bill.route.js           # /api/bills
│   │   ├── patient.route.js        # /api/patients
│   │   ├── report.route.js         # /api/reports
│   │   ├── session.route.js        # /api/sessions
│   │   ├── therapy.route.js        # /api/therapies
│   │   ├── therapyPlan.route.js    # /api/therapy-plans
│   │   └── user.route.js           # /api/users
│   ├── utils/
│   │   ├── AppError.js             # Operational error class
│   │   ├── asyncHandler.js         # Express async wrapper
│   │   └── seedTherapies.js        # Classical Panchakarma auto-seeder
│   ├── validation/
│   │   ├── patient.validation.js   # Patient body validation rules
│   │   ├── therapy.validation.js   # Therapy body validation rules
│   │   ├── therapyPlan.validation.js # Plan array guard & validation rules
│   │   └── user.validation.js      # User registration validation rules
│   └── app.js                      # Express app setup, CORS, routes & docs
├── seed-demo-data.js               # Comprehensive demo seeder (users, patients, plans, bills)
├── test-suite.js                   # 18-step integration test runner
├── .env.example                    # Sample environment variables
├── package.json
└── server.js                       # Server entry point
```

---

## ⚙️ Getting Started

### Prerequisites
- **Node.js** v18.0.0 or higher
- **MongoDB** instance (local MongoDB server or MongoDB Atlas cluster)
- **npm** or **yarn**

### Installation

1. **Clone the repository and enter the backend directory**:
   ```bash
   git clone https://github.com/aadiityaasingh/panchkarma_backend_system.git
   cd "Panchkarma system/backend"
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the `backend/` root directory:
   ```env
   PORT=3000
   DB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/panchveda?retryWrites=true&w=majority
   JWT_SECRET=your_super_secret_jwt_key_here
   ```


5. **Start the API Server**:
   ```bash
   # Development mode with nodemon auto-restart:
   npm run dev

   # Production mode:
   npm start
   ```

   The server will start at `http://localhost:3000`.

6. **Run Automated Test Suite**:
   ```bash
   npm test
   ```
   Executes 18 automated integration tests verifying database connection, authentication, permissions, CRUD flows, session status updates, and reports.

---

## 👥 Demo Staff Credentials

| Role | Name | Email | Password | Scope |
| :--- | :--- | :--- | :--- | :--- |
| **Admin** | Dr. Aditya Sharma | `admin@panchveda.com` | `admin123` | Full clinic management, staff users, billing, reports |
| **Doctor** | Dr. Ananya Iyer | `dr.ananya@panchveda.com` | `doctor123` | Patients, medical plans, session review, therapies |
| **Doctor** | Dr. Rajesh Kulkarni | `dr.rajesh@panchveda.com` | `doctor123` | Patients, medical plans, session review, therapies |
| **Therapist**| Vikram Joshi | `vikram@panchveda.com` | `therapist123` | Clinical treatment queue, session vitals, patient history |
| **Therapist**| Sneha Patil | `sneha@panchveda.com` | `therapist123` | Clinical treatment queue, session vitals, patient history |

---

## 📡 API Reference

**Base URL**: `http://localhost:3000/api`  
**Swagger UI**: `http://localhost:3000/api-docs`

> 🔒 **Protected**: Requires header `Authorization: Bearer <JWT_TOKEN>`

### 🔐 Authentication (`/api/auth`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Public | Authenticate user and return JWT token |
| `GET` | `/api/auth/setup-status` | Public | Check if initial admin account exists (`needsSetup: true/false`) |

```json
// POST /api/auth/login Request Body
{
  "email": "admin@panchveda.com",
  "password": "admin123"
}
```

---

### 👤 Staff User Management (`/api/users`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/users` | 🔒 `admin` | List all staff accounts |
| `POST` | `/api/users` | 🔒 `admin` (or First Setup) | Create staff user (`admin`, `doctor`, `therapist`) |
| `PATCH`| `/api/users/:userId/status` | 🔒 `admin` | Toggle staff account active/inactive |

---

### 🧑‍⚕️ Patients (`/api/patients`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/patients` | 🔒 `admin`, `doctor`, `therapist` | List patients (supports search & pagination) |
| `GET` | `/api/patients/:patientId` | 🔒 `admin`, `doctor`, `therapist` | Get patient profile details |
| `POST` | `/api/patients` | 🔒 `admin`, `doctor` | Register a new patient |
| `PUT` | `/api/patients/:patientId` | 🔒 `admin`, `doctor` | Update patient demographic & medical info |
| `DELETE`| `/api/patients/:patientId` | 🔒 `admin` | Delete patient record |
| `GET` | `/api/patients/:patientId/history`| 🔒 `admin`, `doctor`, `therapist` | Get complete clinical timeline, plans, sessions & bills |

```json
// POST /api/patients Request Body
{
  "fullName": "Meera Patel",
  "phone": "9823456789",
  "age": 42,
  "gender": "female",
  "address": "B-402 Shanti Vihar, Pune",
  "medicalHistory": "Chronic cervical spondylosis, Vata-Pitta Prakriti",
  "emergencyContact": "9823456780"
}
```

---

### 💆 Therapies Catalog (`/api/therapies`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/therapies` | 🔒 `admin`, `doctor`, `therapist` | List all therapies |
| `GET` | `/api/therapies/:therapyId` | 🔒 `admin`, `doctor`, `therapist` | Get therapy procedure details |
| `POST` | `/api/therapies` | 🔒 `admin` | Create new therapy procedure |
| `PUT` | `/api/therapies/:therapyId` | 🔒 `admin` | Update therapy procedure, cost, precautions |
| `DELETE`| `/api/therapies/:therapyId` | 🔒 `admin` | Remove therapy procedure |

Categories: `"vamana"` | `"virechana"` | `"basti"` | `"nasya"` | `"raktamokshana"`

---

### 📋 Therapy Plans (`/api/therapy-plans`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/therapy-plans` | 🔒 `admin`, `doctor`, `therapist` | List therapy plans (filter by `?status=`) |
| `GET` | `/api/therapy-plans/:planId` | 🔒 `admin`, `doctor`, `therapist` | Get plan details with populated patient & therapies |
| `POST` | `/api/therapy-plans` | 🔒 `admin`, `doctor` | Prescribe plan (auto-generates sessions & bill) |

```json
// POST /api/therapy-plans Request Body
{
  "patient": "67a9bc...",
  "startDate": "2026-11-01",
  "endDate": "2026-11-07",
  "therapies": [
    {
      "therapy": "67a9bd...",
      "durationDays": 7,
      "costPerDay": 1200
    }
  ]
}
```

---

### 🗓️ Daily Therapy Sessions (`/api/sessions`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/sessions` | 🔒 `admin`, `doctor`, `therapist` | List sessions (filter by `?date=YYYY-MM-DD` and `?status=`) |
| `GET` | `/api/sessions/plan/:planId` | 🔒 `admin`, `doctor`, `therapist` | List all scheduled sessions for a plan |
| `PATCH`| `/api/sessions/:sessionId/status` | 🔒 `admin`, `doctor`, `therapist` | Update session outcome and record clinical vitals |

```json
// PATCH /api/sessions/:sessionId/status Request Body
{
  "status": "completed",
  "notes": "[Vitals: BP: 120/80 | Pulse: 72 bpm | Tolerance: Well Tolerated (Samyak) | Pathya Advised: Yes] Patient completed full 45m Abhyanga. Warm sesame oil applied."
}
```

---

### 🧾 Invoices & Billing (`/api/bills`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/bills/plan/:planId` | 🔒 `admin`, `doctor` | Retrieve itemized invoice for a therapy plan |
| `PATCH`| `/api/bills/:billId/pay` | 🔒 `admin`, `doctor` | Record partial or full payment against bill |

```json
// PATCH /api/bills/:billId/pay Request Body
{
  "amount": 3500
}
```

---

### 📊 Clinic Analytics & Reports (`/api/reports`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/reports/revenue` | 🔒 `admin` | Financial summary: total revenue, total paid, unpaid balance |
| `GET` | `/api/reports/top-therapies` | 🔒 `admin`, `doctor` | Aggregated rankings of top prescribed therapies |
| `GET` | `/api/reports/patient-count` | 🔒 `admin`, `doctor` | Total registered patient count |

---

## 🔒 Security Best Practices Implemented

- Passwords salted and hashed with `bcrypt`.
- Input validation and sanitization using `express-validator` on all mutation routes.
- Stateless authentication using signed JSON Web Tokens (JWT).
- Role-based authorization middleware enforcing least-privilege access.
- Centralized `AppError` and `errorHandler` preventing database stack trace leaks in production.
- Proper CORS configuration restricting unverified cross-origin origins.

---

> Built with 🌿 for authentic Ayurvedic healthcare and Panchakarma management.
