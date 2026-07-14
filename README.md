# Full-Stack Job Portal Web Application

Live Demo: https://mernjobportalrimon.netlify.app/

A full-stack, responsive Job Portal application constructed using the MERN stack. Candidates can register, browse available job listings, filter roles by category or title, update their professional profiles (including PDF CV uploads), and track their application logs. Recruiters can publish job announcements, edit listings, and manage candidate workflows (accept/reject) directly from their workspaces.

## Technologies Used

### Frontend

- **React.js (Vite)**
- **Zustand** (Ultra-lightweight state store)
- **Tailwind CSS** (Custom themes, gradients, and glassmorphism)
- **Lucide React** (Modern, clean icon assets)
- **Axios** (API query management)

### Backend

- **Node.js & Express.js**
- **MongoDB** (using `mongoose` ORM)
- **JWT (JsonWebToken)** (Cookie & header Bearer token authentication)
- **Bcrypt.js** (Password hashing)
- **Multer** (Profile resume local file uploader)
- **MongoMemoryServer** (Dynamic in-memory DB fallback for immediate local testing)

---

## Installation & Setup

Ensure you have [Node.js](https://nodejs.org/) (v16+) and npm installed.

### 1. Clone & Navigate

```bash
git clone <repository-link>
cd jop-portal
```

### 2. Backend Setup

1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend/` folder (or use the preconfigured default):
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_uri_optional
   JWT_SECRET=super_secret_jwt_key_12345
   NODE_ENV=development
   FRONTEND_URL=http://localhost:5173
   ```
   _Note: If `MONGO_URI` is left blank, the backend automatically spins up an in-memory MongoDB server (`mongodb-memory-server`) and pre-populates seed data (5 jobs, 1 test candidate, 1 test recruiter) for instant local validation._
4. Start the backend:
   ```bash
   npm start
   ```

### 3. Frontend Setup

1. Open a new terminal and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Access the web app in your browser at: `http://localhost:5173`

---

## Test Accounts

The local database auto-seeds the following test accounts on start:

### Candidate Account

- **Email**: `candidate@gmail.com`
- **Password**: `candidate123`

### Recruiter Account

- **Email**: `recruiter@techcorp.com`
- **Password**: `recruiter123`

---

## Verification & Key Flows

1. **Home Page**: Beautiful hero block, metrics cards, popular categories, latest jobs grid, company values, user testimonials.
2. **Auth Flow**: Secure login, registration validation, JWT tokens attached to requests.
3. **Jobs Browser**: Filter sidebar (title matching, category toggle options) and grid lists.
4. **Detail Pages**: In-depth description lists, and single-click apply buttons (prevents duplicate applications).
5. **Dashboard Workspace**: Recruiter dashboard listing jobs posted, actions to edit/delete/create, and a candidate applicant view showing CVs and approval actions.
