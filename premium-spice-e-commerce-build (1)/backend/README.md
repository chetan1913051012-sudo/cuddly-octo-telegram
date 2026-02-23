# Homelike E-commerce Backend

## Prerequisites

1. **Node.js** (v14 or higher) - https://nodejs.org
2. **MongoDB** - Choose one:
   - Local MongoDB: https://www.mongodb.com/try/download/community
   - MongoDB Atlas (Cloud - FREE): https://www.mongodb.com/cloud/atlas

## Installation

### Step 1: Install Dependencies
```bash
cd backend
npm install
```

### Step 2: Set Up MongoDB

#### Option A: MongoDB Atlas (Recommended - Free Forever)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a new cluster (Free tier)
4. Create a database user
5. Get your connection string (click "Connect" → "Connect your application")
6. Replace `MONGODB_URI` in `.env` file with your connection string

Example:
```
MONGODB_URI=mongodb+srv://myuser:mypassword@cluster0.abcde.mongodb.net/homelike?retryWrites=true&w=majority
```

#### Option B: Local MongoDB
1. Install MongoDB Community Server
2. Start MongoDB service
3. Make sure `.env` has: `MONGODB_URI=mongodb://localhost:27017/homelike`

### Step 3: Create Uploads Directory
```bash
cd backend
mkdir -p uploads
```

### Step 4: Start the Server
```bash
# Development mode (with auto-reload)
npm run dev

# OR Production mode
npm start
```

### Step 5: Verify
- Server runs at: http://localhost:5000
- Health check: http://localhost:5000/api/health
- API is ready when you see "MongoDB Connected Successfully"

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:slug` - Get product by slug
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id/cancel` - Cancel order

### Admin
- `GET /api/admin/dashboard` - Dashboard stats
- `GET /api/admin/orders` - All orders
- `PUT /api/admin/orders/:id/status` - Update order status
- `GET /api/admin/users` - All users
- `PUT /api/admin/users/:id/status` - Block/unblock user

## Connecting Frontend to Backend

To connect the React frontend to this backend:

1. Create a `src/services/api.js` file with axios configuration
2. Update the frontend stores to fetch from API instead of using localStorage

Example:
```javascript
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api'
});

// Add token to requests
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export default API;
```

## Production Deployment

### Deploy Backend (Render.com - Free)
1. Push your code to GitHub
2. Go to https://render.com
3. Create new Web Service
4. Connect your GitHub repo
5. Set:
   - Build Command: `npm install`
   - Start Command: `npm start`
6. Add Environment Variables in Render dashboard
7. Deploy!

### Deploy Frontend (Vercel/Netlify)
1. Build: `npm run build`
2. Deploy the `dist` folder

## Demo Credentials

After running the backend and seeding data:
- **Admin**: admin@homelike.com / admin123
- **User**: john@example.com / password123

## Support

For issues or questions, check the console for error messages.
