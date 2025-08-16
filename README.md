# Admin Portal & Mobile API 

A VueJS webapps with Node.js Express backend for managing listings with user authentication
- Tech Stack: VueJS, Tailwind CSS, Nodejs, Express, ES6 Javacript, MySQL, Sequelize ORM, Google Gemini
- Hosting: freesqldatabase, Vercel, Render


## Live PROD 
https://asessment-adv.vercel.app/
- might fail/slow first time login due to inactivity of free tier SQL server & backend instances, just be patient for backend instance to wake up
- login credentials refer end of readme
- committed .env value was only for testing, it’s long gone: expired and replaced

# Local Development Setup (Backend)
### Prerequisites

- Node.js (v18 or higher)
- MySQL database
- Google Gemini API key

### Installation

1. Navigate to the backend directory:
```bash
cd my-backend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Configure your `.env` file with your database and API credentials:
```env
DB_NAME=your_database_name
DB_USERNAME=your_db_username
DB_PASSWORD=your_db_password
DB_HOST=localhost
DB_PORT=3306

PORT=3113
JWT_SECRET=your_jwt_secret_key
GOOGLE_GEMINI_API_KEY=your_google_gemini_api_key
```

### Database Setup

1. Run database migrations and seed data:
```bash
npx sequelize-cli db:migrate
```

### Running the Application
```bash
npm run dev
```

The API will be available at `http://localhost:3113` 

# Local Development Setup (Frontend)
### Installation

1. Navigate to the frontend directory:
```bash
cd client-admin
```

2. Install dependencies:
```bash
npm install
```

3. Ensure local base URL is enabled as follow (in client_admin/source/services/api.js):
```bash
//const API_BASE_URL = `https://asessment-adv.onrender.com`
const API_BASE_URL = `http://localhost:3113`
```
4. Run the UI application
```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /a/login` - Admin login
- `POST /api/login` - Mobile API login

### Listings (Admin role type (u) only)
- `GET /listing` - Get all listings (admin only)
- `GET /listing/o/:id` - Get listing by ID (protected route)
- `POST /listing/create` - Create new listing (protected route)
- `PUT /listing/update/:id` - Update listing (protected route)
- `DELETE /listing/delete/:id` - Delete listing (protected route)
- `GET /user/listings` - Get users list p(rotected route)

### Listings (Mobile API)
- `GET /api/listing` - Get user's listings (protected route)
  - `?description=true` - Include AI-generated descriptions (optional)
  - `?lat=X&long=Y` - Calculate distances from user location (optional)

## Features

- JWT-based authentication (protected route)
- Role-based access control (admin/user)
- Google Gemini API integration for place descriptions (optional via URL query)
- Distance calculation between coordinates (optional via URL query)
- Database migrations with Sequelize
- CORS enabled for frontend integration

### Sample Credentials (After Seeding)

**Admin User:**
- Username: `admin`
- Password: `123456`

**Regular Users:**
- Username: `test_user_01` / Password: `123456`
- Username: `test_user_02` / Password: `123456`
- Username: `test_user_03` / Password: `123456`
- Username: `test_user_04` / Password: `123456`
- Username: `test_user_05` / Password: `123456`

*Note: These are default seeded credentials only. You may create on your on via register API.

## Scree
<img width="1459" height="717" alt="SCR-20250813-neyb" src="https://github.com/user-attachments/assets/17280d99-5d51-4aae-a22c-6ecd68a8ded4" /> <br>
<img width="1460" height="714" alt="SCR-20250813-nfsj" src="https://github.com/user-attachments/assets/0f9c1894-b39d-4148-9690-815489253b3e" />
<img width="1441" height="718" alt="SCR-20250813-nfqn" src="https://github.com/user-attachments/assets/4020d062-b9c2-4ab4-913a-9791d7f7dba5" />
<img width="1440" height="716" alt="SCR-20250813-nfhm" src="https://github.com/user-attachments/assets/c1f8e756-7be7-4ae3-9803-f44c67c19f82" />
<img width="1442" height="715" alt="SCR-20250813-nfec" src="https://github.com/user-attachments/assets/84249ff2-db91-4460-996a-775f3ccbac62" />


