# Full-Stack Job Portal

A modern, full-stack job portal built with the MERN stack, featuring separate workspaces for candidates and recruiters. Candidates can discover opportunities, manage their professional profiles, upload resumes, and track applications. Recruiters can publish job listings, review applicants, and manage application decisions through a dedicated dashboard.

**[Live Demo](https://mernjobportalrimon.netlify.app/)** · **[GitHub Repository](https://github.com/RimonDipta/job-portal-mern)** · **[Backend API Health](https://job-portal-mern-zyj9.onrender.com/api/health)**

---

## Overview

The Job Portal provides a centralized platform for connecting job seekers with recruiters through a responsive web application.

The project uses a React frontend, an Express REST API, MongoDB for persistent data storage, and JWT-based authentication. Its interface features a dark visual theme, glassmorphism-inspired components, responsive layouts, and dedicated candidate and recruiter experiences.

## Features

### Candidate

- **Authentication:** Register an account and sign in securely.
- **Job Discovery:** Browse available job listings and explore opportunities.
- **Search and Filtering:** Find relevant positions by job title and category.
- **Job Details:** View detailed job descriptions and position information.
- **Job Applications:** Apply for positions and prevent duplicate applications.
- **Application Tracking:** Monitor application history and statuses.
- **Profile Management:** Update personal information, professional summaries, and skills.
- **Resume Upload:** Upload a resume in PDF, DOC, or DOCX format.
- **Private Resume Access:** Access resumes through authenticated requests.

### Recruiter

- **Recruiter Workspace:** Access a dedicated dashboard for hiring activities.
- **Job Management:** Create, edit, and delete job listings.
- **Applicant Management:** Review candidates who have applied to published jobs.
- **Application Decisions:** Accept or reject applications.
- **Resume Review:** Access candidate resumes subject to authorization rules.
- **Recruitment Overview:** View published jobs and manage hiring workflows.

### General

- Responsive interface for desktop and mobile devices.
- Protected routes and role-aware user experiences.
- JWT authentication using Bearer tokens and HTTP cookies.
- Password hashing with bcrypt.
- Server-side validation and structured API error responses.
- Centralized API communication using Axios.
- Client-side state management with Zustand.

---

## Technology Stack

### Frontend

| Technology   | Purpose                                 |
| ------------ | --------------------------------------- |
| React        | Component-based user interface          |
| Vite         | Development server and production build |
| Tailwind CSS | Responsive styling and UI design        |
| Zustand      | Application state management            |
| React Router | Client-side routing                     |
| Axios        | HTTP requests to the backend API        |
| Lucide React | Interface icons                         |

### Backend

| Technology    | Purpose                            |
| ------------- | ---------------------------------- |
| Node.js       | JavaScript runtime                 |
| Express.js    | REST API and middleware            |
| MongoDB       | Database                           |
| Mongoose      | MongoDB object modeling            |
| JWT           | Authentication tokens              |
| bcrypt.js     | Password hashing                   |
| Multer        | Resume file uploads                |
| cookie-parser | Cookie handling                    |
| dotenv        | Environment configuration          |
| CORS          | Cross-origin request configuration |

### Deployment

| Service       | Responsibility      |
| ------------- | ------------------- |
| Netlify       | Frontend hosting    |
| Render        | Backend API hosting |
| MongoDB Atlas | Cloud database      |

---

## Application Architecture

```text
                    Candidate / Recruiter
                             |
                             v
                    React + Vite Frontend
                          Netlify
                             |
                        HTTPS / REST
                             |
                             v
                      Express.js API
                          Render
                             |
                +------------+------------+
                |                         |
                v                         v
          MongoDB Atlas             Resume Storage
          Application Data          Backend Uploads
```

The frontend communicates with the backend through a centralized Axios client. Protected API requests include the authentication token, while the backend validates permissions before allowing access to private resources.

**Note:** Resume files are stored on the backend's filesystem in the current implementation. Files stored on an ephemeral hosting filesystem may not persist across service restarts or redeployments. Production-grade persistent resume storage should use a durable storage service.

---

## Live Deployment

| Component    | URL                                                  |
| ------------ | ---------------------------------------------------- |
| Frontend     | https://mernjobportalrimon.netlify.app/              |
| Backend API  | https://job-portal-mern-zyj9.onrender.com/           |
| Health Check | https://job-portal-mern-zyj9.onrender.com/api/health |

The frontend is deployed independently from the backend. Configure the frontend API URL and backend environment variables for the appropriate deployment environment.

---

## Getting Started

### Prerequisites

Install the following before running the project locally:

- [Node.js](https://nodejs.org/) and npm
- [Git](https://git-scm.com/)
- A MongoDB database, either local MongoDB or [MongoDB Atlas](https://www.mongodb.com/atlas)

### 1. Clone the Repository

```bash
git clone https://github.com/RimonDipta/job-portal-mern.git
cd job-portal-mern
```

### 2. Configure the Backend

Navigate to the backend directory:

```bash
cd backend
npm install
```

Create a `.env` file inside `backend/`:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/job-portal
JWT_SECRET=replace_with_a_long_random_secret
FRONTEND_URL=http://localhost:5173
```

#### Environment Variables

| Variable       | Description                                                    |
| -------------- | -------------------------------------------------------------- |
| `PORT`         | Port used by the Express server                                |
| `NODE_ENV`     | Application environment, such as `development` or `production` |
| `MONGO_URI`    | MongoDB connection string                                      |
| `JWT_SECRET`   | Secret used to sign authentication tokens                      |
| `FRONTEND_URL` | Frontend origin allowed by the backend CORS configuration      |

Use your actual MongoDB connection string if you use MongoDB Atlas. Generate a strong, private JWT secret and never commit your `.env` file.

Start the backend using the script defined in `backend/package.json`:

```bash
npm start
```

The API should be available at:

```text
http://localhost:5000
```

Verify the server using:

```text
http://localhost:5000/api/health
```

### 3. Configure the Frontend

Open a second terminal from the repository root:

```bash
cd frontend
npm install
```

Create a `.env` file inside `frontend/`:

```env
VITE_API_URL=http://localhost:5000/api/v1
```

Start the development server:

```bash
npm run dev
```

Open the application:

```text
http://localhost:5173
```

### 4. Build the Frontend

To verify the production build:

```bash
npm run build
```

To preview the generated production build locally:

```bash
npm run preview
```

---

## API Overview

The backend exposes REST endpoints under `/api/v1`.

| Endpoint                      | Purpose                                        |
| ----------------------------- | ---------------------------------------------- |
| `/api/health`                 | API health check                               |
| `/api/v1/user/register`       | Register an account                            |
| `/api/v1/user/login`          | Authenticate a user                            |
| `/api/v1/user/logout`         | Log out                                        |
| `/api/v1/user/profile/update` | Update profile information and upload a resume |
| `/api/v1/job`                 | Job-related operations                         |
| `/api/v1/application`         | Application-related operations                 |

Protected endpoints require valid authentication. Access to private resumes additionally depends on the backend's resume authorization rules.

Refer to the backend route files for the complete endpoint list, HTTP methods, and request payload requirements.

---

## Authentication and Security

The project implements several security measures:

- Passwords are hashed using bcrypt before being stored.
- JWTs are used to authenticate users.
- Protected routes require authentication.
- Candidate and recruiter roles have different workflows and permissions.
- Resume requests pass through authentication and authorization middleware.
- Recruiters may access candidate resumes only when the applicable authorization rules are satisfied.
- Backend validation helps prevent malformed requests and invalid data.
- CORS is configured to allow the designated frontend origin.

**Security note:** Never publish real credentials, database connection strings, JWT secrets, or private user data in this repository.

---

## Project Structure

```text
job-portal-mern/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── uploads/
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── lib/
│   │   ├── pages/
│   │   ├── store/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md
```

_The structure above summarizes the main application directories. Individual files may differ as the project evolves._

---

## Testing and Verification

Before deploying changes, verify the following:

- [ ] Frontend dependencies install successfully.
- [ ] Backend dependencies install successfully.
- [ ] Backend connects to the configured MongoDB database.
- [ ] Health-check endpoint returns a successful response.
- [ ] Candidate registration and login work.
- [ ] Recruiter login and protected dashboard access work.
- [ ] Job creation, editing, and deletion work.
- [ ] Candidates can apply for jobs and view their application history.
- [ ] Profile updates and resume uploads work.
- [ ] Private resume access enforces authentication and authorization.
- [ ] Frontend production build completes successfully.

---

## Future Improvements

Potential improvements for future iterations include:

- Persistent cloud storage for uploaded resumes.
- Automated frontend and backend testing.
- Email notifications for application status changes.
- Pagination and more advanced job-search filters.
- Recruiter analytics and application statistics.
- Improved API documentation.
- Continuous integration and deployment checks.

---

## Author

**Rimon Dipta**

Full-Stack Web Developer

- **Portfolio:** https://rimondipta.netlify.app/
- **GitHub:** https://github.com/RimonDipta
- **Project Repository:** https://github.com/RimonDipta/job-portal-mern

---

## License

No license has been specified for this project yet.
