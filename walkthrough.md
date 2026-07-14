# Walkthrough - Full-Stack Job Portal

We have built a premium, responsive Full-Stack Job Portal application with fully integrated authentication, search engines, candidate profiles, and recruiter workspaces.

## Changes Implemented

### Backend Service (`backend/`)
1. **Core Setup**: Established Express application, Cookie-Parser, CORS configurations, and Multer file upload routing.
2. **Database Integration**: Dynamic database connection (`backend/config/db.js`) connects to custom Mongo servers or falls back to an in-memory server (`mongodb-memory-server`) to enable immediate, database-free execution.
3. **Data Seeding**: Seeding utility (`backend/config/seed.js`) inserts 5 structured job posts, 1 Recruiter account (`recruiter@techcorp.com` / `recruiter123`), and 1 Candidate account (`candidate@gmail.com` / `candidate123`) on startup when the database is empty.
4. **JWT Authentication**: Implemented password security via `bcryptjs`, token signs on login, token clearance on logout, and verification middleware (`backend/middleware/auth.js`).
5. **Controllers & Endpoints**:
   - `/api/v1/user`: Register, Login, Logout, Profile updates (skills, bio, name, resume PDF uploads).
   - `/api/v1/job`: Add new jobs, retrieve public jobs (with search queries), edit jobs, delete jobs, get admin jobs.
   - `/api/v1/application`: Apply for job posts (blocks duplicates), list applied jobs for candidates, list job applicants, and update status controls for recruiters.

### Frontend Application (`frontend/`)
1. **State Store**: Designed a centralized Zustand store (`frontend/src/store/useAppStore.js`) managing user logins, job profiles, lists of applicant CVs, and application statuses.
2. **Routing & Framework**: Set up `react-router-dom` in `frontend/src/App.jsx` pointing URLs to pages.
3. **Responsive Aesthetics**: Applied a dark slate theme using Tailwind CSS, glassmorphism card designs, border hover lighting, and responsive drop-down lists.
4. **Key Views**:
   - **Home**: Banner, metrics counters, category triggers, latest jobs list, values grid, testimonials card.
   - **Browse Jobs**: Title searches, category sidebar toggles, and results grids.
   - **Job Details**: Details descriptions, metrics line grid, and a single-click application button (disabled with checkmarks if already applied).
   - **Auth Pages**: Login / Registration forms with role triggers.
   - **Profile Pages**: Skills tags, CV download options, edit modal details, and an applications tracking log.
   - **Recruiter Workspace**: Table grids of active posts, edit/delete actions, candidate list logs, and status update buttons (accept/reject).
   - **About & Contact**: Narrative sections, email/phone links, and contact messaging cards.

---

## Verification Results

### Backend Health Check Response
```json
{
  "status": "OK",
  "message": "Job Portal API is running successfully."
}
```

### Seeding Outputs (Seeded Roles Returned from GET Endpoint)
1. Product Operations Manager (TechCorp - Chicago)
2. Full Stack Engineer (InnoVate Corp)
3. UI/UX Design Intern (CreativeLabs - Remote)
4. Backend Engineer (CloudSystems - NY)
5. Frontend Developer (TechCorp - Remote)

### Server Execution Status
- **Backend API**: Listening on port `5000` (Dynamic memory server active).
- **Frontend App**: Listening on port `5173` (Bundles validated and built successfully).
