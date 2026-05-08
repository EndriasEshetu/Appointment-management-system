# Appointment Management System

A full-stack web application for booking, managing, and tracking appointments with email reminders.

## Live Demo

🚀 **[View Live Demo](https://endrias-appointment-management-system.onrender.com/)**

The system supports two main roles:

- **Admin / Business**
  - Manage availability schedules
  - View and manage customer appointments
  - Update appointment statuses

- **Customer**
  - Browse available appointment slots
  - Book appointments
  - View, reschedule, or cancel appointments
  - Receive reminder emails before appointments

---

## Features

### Authentication & Authorization

- User registration and login
- JWT authentication
- Password hashing with bcrypt
- Role-based access control
  - Admin
  - Customer

---

## Admin Dashboard

- Manage weekly availability slots
- Create, edit, and update available time slots
- View all upcoming appointments
- Update appointment status:
  - Pending
  - Confirmed
  - Paid
  - Cancelled

---

## Customer Dashboard

- View available appointment slots using calendar
- Book appointments
- View booked appointments
- Reschedule appointments
- Cancel appointments

---

## Email Reminder System

- Automated appointment reminders
- Trigger.dev background jobs
- Resend email integration

Reminder logic:

- Detect appointments within next 24 hours
- Send reminder email automatically
- Prevent duplicate reminders

---

## Tech Stack

### Frontend

- React (Vite)
- Tailwind CSS
- React Router DOM
- Axios
- Zustand
- TanStack Query
- FullCalendar / React Big Calendar
- Lucide React Icons

### Backend

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT Authentication
- bcrypt

### Background Jobs & Email

- Trigger.dev
- Resend

### Deployment

- Render

---

## Project Structure

```
appointment-management-system/
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── store/
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── trigger/
│   ├── utils/
│   ├── server.js
│   └── package.json
│
└── README.md
```

---

## Installation

## Clone Repository

```bash
git clone https://github.com/EndriasEshetu/Appointment-management-system.git
cd appointment-management-system
```

---

## Backend Setup

```bash
cd server
npm install
npm run dev
```

Create `.env`:

```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
CLIENT_URL=http://localhost:5173
RESEND_API_KEY=your_resend_key
TRIGGER_SECRET_KEY=your_trigger_key
```

---

## Frontend Setup

```bash
cd client
npm install
npm run dev
```

Create `.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

---

## API Endpoints

## Authentication

- `POST /api/auth/register`
- `POST /api/auth/login`

## Availability

- `GET /api/availability`
- `GET /api/availability/me`
- `POST /api/availability`
- `PUT /api/availability/:id`

## Appointments

- `POST /api/appointments`
- `GET /api/appointments/me`
- `GET /api/appointments/business`
- `PUT /api/appointments/:id/status`
- `PUT /api/appointments/:id/reschedule`
- `PUT /api/appointments/:id/cancel`

---

## Appointment Status Flow

```
Pending → Confirmed → Paid
   ↓
Cancelled
```

---

## Email Reminder Workflow

1. Customer books appointment
2. Appointment stored in database
3. Trigger.dev scheduled task runs periodically
4. Checks appointments within next 24 hours
5. Sends reminder email via Resend
6. Marks `reminderSent = true`

---

## Deployment

### Backend

Deploy backend as **Render Web Service**

Required environment variables:

- MONGO_URI
- JWT_SECRET
- CLIENT_URL
- RESEND_API_KEY
- TRIGGER_SECRET_KEY

### Frontend

Deploy frontend as **Render Static Site**

Build command:

```bash
npm run build
```

Publish directory:

```bash
dist
```

Environment:

```env
VITE_API_URL=https://your-backend-url.onrender.com/api
```

---

## Future Improvements

- Payment integration (Stripe/Chapa)
- SMS reminders
- Google Calendar sync
- Admin analytics dashboard
- Multi-business support
- Dark/light theme toggle

---

## Author

**Endrias Eshetu**

Computer Science Student & Full-Stack Developer

GitHub: https://github.com/EndriasEshetu

---

## License

This project is open source and available under the MIT License.
