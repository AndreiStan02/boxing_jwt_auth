# BoxLink - Boxing Management Application

A full-stack web application for boxing management with comprehensive user authentication features.

## Features

- User Authentication (Register/Login)
- JWT-based Session Management
- Email Verification
- Password Reset Functionality
- Responsive Design

## Tech Stack

### Backend
- **Framework**: Node.js/Express
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT
- **Validation**: Zod
- **Email Service**: Resend

### Frontend
- **Framework**: React with Vite
- **Styling**: TailwindCSS + DaisyUI
- **State Management**: React Query
- **Routing**: React Router
- **HTTP Client**: Axios

## Project Structure

```
├── backend/               # Node.js/Express backend
│   ├── prisma/           # Database schema and migrations
│   └── src/
│       ├── config/       # Configuration files
│       ├── constants/    # Constants and enums
│       ├── controller/   # Request handlers
│       ├── db/          # Database client
│       ├── middleware/   # Express middleware
│       ├── routes/      # API routes
│       ├── services/    # Business logic
│       └── util/        # Utility functions
├── frontend/             # React frontend
│   └── src/
│       ├── assets/      # Static assets
│       ├── components/  # React components
│       ├── config/      # Frontend configuration
│       ├── hooks/       # Custom React hooks
│       ├── lib/         # Utility libraries
│       └── pages/       # Page components
└── views/               # EJS templates
```

## Getting Started

### Prerequisites

- Node.js
- PostgreSQL
- npm

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/boxing_crud_app.git
cd boxing_crud_app
```

2. Install backend dependencies
```bash
cd backend
npm install
```

3. Install frontend dependencies
```bash
cd frontend
npm install
```

### Configuration

#### Backend (.env)
```
DATABASE_URL=your_postgresql_url
DIRECT_URL=your_postgresql_direct_url
PORT=4004
NODE_ENV=development
APP_ORIGIN=http://localhost:5173
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_jwt_refresh_secret
EMAIL_SENDER=your_email
RESEND_API_KEY=your_resend_api_key
```

#### Frontend (.env)
```
VITE_API_URL=http://localhost:4004
```

### Running the Application

1. Start the backend:
```bash
cd backend
npm run dev
```

2. Start the frontend:
```bash
cd frontend
npm run dev
```

Access the application at:
- Frontend: http://localhost:5173
- Backend: http://localhost:4004

## API Endpoints

### Auth Routes
- `POST /auth/register` - Register new user
- `POST /auth/login` - User login
- `GET /auth/logout` - User logout
- `GET /auth/refresh` - Refresh access token
- `GET /auth/email/verify/:code` - Verify email
- `POST /auth/password/forgot` - Request password reset
- `POST /auth/password/reset` - Reset password

### User Routes
- `GET /user` - Get user profile

## Development Commands

### Backend
```bash
npm run dev     # Start development server
npm run build   # Build TypeScript
npm start       # Start production server
```

### Frontend
```bash
npm run dev     # Start development server
npm run build   # Build for production
npm run preview # Preview production build
npm run lint    # Run ESLint
```

## Acknowledgments

- React documentation
- Express.js documentation
- Prisma documentation
- TailwindCSS documentation
- DaisyUI documentation
