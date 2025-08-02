# Math4052 Quiz Application

A full-stack web application for mathematics quizzes with user authentication, progress tracking, and payment integration.

## Project Structure

- `math4052-backend/` - Node.js/Express backend API
- `math4052-frontend/` - React frontend with Vite

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

## Local Development Setup

### Backend Setup

1. Navigate to backend directory:
   ```bash
   cd math4052-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Update `.env` with your configurations:
   - `MONGO_URI` - MongoDB connection string
   - `JWT_SECRET` - Secret key for JWT tokens
   - `PORT` - Server port (default: 5000)
   - `FRONTEND_URL` - Frontend URL for CORS

5. Seed the database (optional):
   ```bash
   node seed.js
   ```

6. Start the backend server:
   ```bash
   npm start
   ```

### Frontend Setup

1. Navigate to frontend directory:
   ```bash
   cd math4052-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Update `.env` with your configurations:
   - `VITE_API_URL` - Backend API URL (default: http://localhost:5000)

5. Start the development server:
   ```bash
   npm run dev
   ```

## Building for Production

### Frontend Build
```bash
cd math4052-frontend
npm run build
```
This creates a `dist` folder with optimized production files.

### Backend Production
The backend is already production-ready. Just ensure environment variables are properly set.

## Deployment Options

### 1. Deploy to Vercel (Frontend)

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Deploy frontend:
   ```bash
   cd math4052-frontend
   vercel
   ```

3. Set environment variables in Vercel dashboard.

### 2. Deploy to Render (Backend)

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set the following:
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Add environment variables

### 3. Deploy to Heroku (Full Stack)

1. Create `Procfile` in backend:
   ```
   web: node server.js
   ```

2. Deploy:
   ```bash
   heroku create your-app-name
   heroku config:set MONGO_URI=your_mongo_uri
   heroku config:set JWT_SECRET=your_secret
   git push heroku main
   ```

### 4. Deploy with Docker

Create `Dockerfile` for backend:
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["node", "server.js"]
```

## Environment Variables

### Backend
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - JWT secret key
- `PORT` - Server port
- `FRONTEND_URL` - Frontend URL for CORS
- `STRIPE_SECRET_KEY` - Stripe secret key (optional)

### Frontend
- `VITE_API_URL` - Backend API URL
- `VITE_STRIPE_PUBLIC_KEY` - Stripe public key (optional)

## Features

- User authentication (login/register)
- Quiz functionality with LaTeX math rendering
- Progress tracking
- Payment integration (Stripe)
- Admin dashboard
- Leaderboard
- Responsive design

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT authentication
- bcrypt for password hashing
- CORS enabled
- Rate limiting

### Frontend
- React 18
- Vite
- React Router v6
- Tailwind CSS
- Axios for API calls
- KaTeX for math rendering
- Framer Motion for animations

## API Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/questions` - Get all questions
- `GET /api/questions/:id` - Get single question
- `POST /api/progress` - Save user progress
- `GET /api/progress/:userId` - Get user progress
- `POST /api/payment` - Process payment
- `GET /api/users/leaderboard` - Get leaderboard

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Rate limiting
- CORS configuration
- Environment variable protection

## Troubleshooting

1. **MongoDB Connection Error**: Ensure MongoDB is running and connection string is correct
2. **CORS Error**: Check that `FRONTEND_URL` in backend .env matches your frontend URL
3. **Build Errors**: Clear node_modules and reinstall dependencies
4. **Port Already in Use**: Change PORT in .env file

## License

MIT