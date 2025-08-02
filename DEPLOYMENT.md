# Math4052 Quiz Application - Deployment Guide

## Prerequisites
- GitHub account
- Render account (for backend)
- Vercel account (for frontend)

## Step 1: Deploy Backend to Render

### 1.1 Push to GitHub
```bash
# Initialize git repository (if not already done)
git init
git add .
git commit -m "Initial commit"

# Create repository on GitHub and push
git remote add origin https://github.com/yourusername/math4052.git
git push -u origin main
```

### 1.2 Deploy on Render
1. Go to [render.com](https://render.com) and sign up/login
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `math4052-backend`
   - **Root Directory**: `math4052-backend`
   - **Environment**: `Node`
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

### 1.3 Set Environment Variables on Render
In the Render dashboard, add these environment variables:
```
MONGO_URI=mongodb+srv://pangtee:Dz0yYyrWlscIp2PF@math4052.eiz5yil.mongodb.net/?retryWrites=true&w=majority&appName=math4052
JWT_SECRET=supersecretkey
PORT=5000
FRONTEND_URL=https://your-frontend-url.vercel.app
```

### 1.4 Get Backend URL
After deployment, you'll get a URL like: `https://math4052-backend-xyz.onrender.com`

## Step 2: Deploy Frontend to Vercel

### 2.1 Update Frontend Environment
1. Update `math4052-frontend/.env.production`:
```
VITE_API_URL=https://your-backend-url.onrender.com
```

### 2.2 Deploy on Vercel
1. Go to [vercel.com](https://vercel.com) and sign up/login
2. Click "New Project"
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset**: Vite
   - **Root Directory**: `math4052-frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### 2.3 Set Environment Variables on Vercel
In the Vercel dashboard → Settings → Environment Variables:
```
VITE_API_URL=https://your-backend-url.onrender.com
```

### 2.4 Update Backend CORS
Update the backend's `FRONTEND_URL` environment variable on Render with your Vercel URL.

## Step 3: Alternative Deployment Options

### Backend Alternatives:
- **Railway**: Similar to Render, good performance
- **Heroku**: Classic choice, requires credit card for free tier
- **DigitalOcean App Platform**: More advanced features

### Frontend Alternatives:
- **Netlify**: Great for static sites, similar to Vercel
- **GitHub Pages**: Free, but limited features
- **Firebase Hosting**: Google's solution

## Step 4: Custom Domain (Optional)

### For Frontend (Vercel):
1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS records as instructed

### For Backend (Render):
1. Upgrade to paid plan
2. Add custom domain in settings
3. Configure DNS records

## Environment Variables Summary

### Backend (.env):
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000
FRONTEND_URL=https://your-frontend-domain.com,http://localhost:5173
PAYNOW_UEN=your_uen_or_phone
COMPANY_NAME=Math4052
```

### Frontend (.env.production):
```
VITE_API_URL=https://your-backend-domain.com
VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key
```

## Testing Deployment

1. Visit your frontend URL
2. Test user registration and login
3. Test quiz functionality
4. Test admin dashboard
5. Test password reset

## Troubleshooting

### Common Issues:
1. **CORS errors**: Check FRONTEND_URL in backend env vars
2. **Build failures**: Check node version compatibility
3. **Database connection**: Verify MongoDB URI
4. **Environment variables**: Ensure all required vars are set

### Logs:
- **Render**: Check deployment logs in dashboard
- **Vercel**: Check function logs in dashboard
- **Browser**: Check network tab for API errors

## Performance Optimization

### Frontend:
- Enable gzip compression (automatic on Vercel)
- Use CDN (automatic on Vercel)
- Optimize images

### Backend:
- Enable compression middleware
- Add Redis caching
- Optimize database queries

## Security Notes

1. Use strong JWT secrets in production
2. Enable HTTPS (automatic on both platforms)
3. Set proper CORS origins
4. Don't expose sensitive data in frontend
5. Use environment variables for all secrets

## Cost Estimation

### Free Tier Limits:
- **Render**: 750 hours/month, sleeps after 15min inactivity
- **Vercel**: 100GB bandwidth, 6000 minutes build time
- **MongoDB Atlas**: 512MB storage

### Paid Plans:
- **Render**: $7/month for always-on service
- **Vercel**: $20/month for Pro features
- **MongoDB Atlas**: $9/month for 2GB

## Monitoring

### Health Checks:
- Set up uptime monitoring (UptimeRobot, Pingdom)
- Monitor error rates
- Track performance metrics

### Analytics:
- Add Google Analytics to frontend
- Monitor user engagement
- Track quiz completion rates