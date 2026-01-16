# Production Deployment Guide

## 🚀 Quick Start Checklist

### Before Deployment

- [ ] Install new dependencies: `cd backend && npm install`
- [ ] Set up MongoDB Atlas (or production MongoDB)
- [ ] Generate strong JWT_SECRET: `openssl rand -base64 32`
- [ ] Configure environment variables
- [ ] Create admin user (don't use default)
- [ ] Test locally with production env vars

---

## 📋 Step-by-Step Deployment

### 1. Install Security Dependencies

```bash
cd backend
npm install
```

This installs:
- `helmet` - Security headers
- `express-rate-limit` - Rate limiting
- `express-mongo-sanitize` - NoSQL injection protection
- `express-validator` - Input validation (ready to use)
- `winston` - Logging (ready to use)

### 2. Set Up MongoDB Atlas (Recommended)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create database user
4. Whitelist your server IP (or `0.0.0.0/0` for all IPs - less secure)
5. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/nettech_placement`

### 3. Configure Environment Variables

**Backend (`backend/.env`):**
```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/nettech_placement?retryWrites=true&w=majority
JWT_SECRET=<paste-generated-secret-here>
PORT=5000
CLIENT_ORIGIN=https://yourdomain.com
```

**Frontend (`client/.env.production`):**
```env
VITE_API_BASE_URL=https://api.yourdomain.com/api
```

### 4. Create Admin User

**DO NOT use the default admin/admin123 in production!**

```bash
cd backend
npm run create-admin NetTechAdmin NetTechAdmin@201
```

Example:
```bash
npm run create-admin admin MySecurePassword123!
```

### 5. Seed Database (Optional)

```bash
npm run seed
```

This populates:
- Student records
- Job domains
- Content (FAQs, process steps, etc.)
- Form schemas
- Sample leads

### 6. Test Locally First

```bash
# Terminal 1: Backend
cd backend
NODE_ENV=production npm start

# Terminal 2: Frontend
cd client
npm run build
npm run preview  # Test production build
```

Verify:
- ✅ Health check: `http://localhost:5000/api/health`
- ✅ Admin login works
- ✅ Forms submit correctly
- ✅ No console errors

---

## 🌐 Deploy Backend

### Option A: VPS/Server (DigitalOcean, AWS EC2, etc.)

1. **Install Node.js 18+**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

2. **Clone Repository**
   ```bash
   git clone <your-repo-url>
   cd nettech-india-placement
   ```

3. **Install Dependencies**
   ```bash
   npm install
   cd backend && npm install
   ```

4. **Set Environment Variables**
   ```bash
   cd backend
   nano .env  # Paste your production env vars
   ```

5. **Create Admin User**
   ```bash
   npm run create-admin <username> <password>
   ```

6. **Start with PM2**
   ```bash
   npm install -g pm2
   pm2 start src/server.js --name "nettech-api"
   pm2 save
   pm2 startup  # Auto-start on reboot
   ```

7. **Set Up Nginx Reverse Proxy**
   ```nginx
   server {
       listen 80;
       server_name api.yourdomain.com;

       location / {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

8. **Set Up SSL with Let's Encrypt**
   ```bash
   sudo apt-get install certbot python3-certbot-nginx
   sudo certbot --nginx -d api.yourdomain.com
   ```

### Option B: Platform-as-a-Service (Heroku, Railway, Render)

**Heroku:**
```bash
heroku create nettech-api
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=<your-mongodb-uri>
heroku config:set JWT_SECRET=<your-secret>
heroku config:set CLIENT_ORIGIN=https://yourdomain.com
git push heroku main
heroku run npm run create-admin <username> <password>
```

**Railway/Render:**
- Connect GitHub repo
- Set environment variables in dashboard
- Deploy automatically
- Run admin creation via console/CLI

---

## 🎨 Deploy Frontend

### Option A: Static Hosting (Vercel, Netlify, Cloudflare Pages)

**Vercel:**
```bash
npm install -g vercel
cd client
vercel --prod
```

Set environment variable in Vercel dashboard:
- `VITE_API_BASE_URL` = `https://api.yourdomain.com/api`

**Netlify:**
1. Connect GitHub repo
2. Build command: `npm run build:client`
3. Publish directory: `client/dist`
4. Add environment variable: `VITE_API_BASE_URL`

**Cloudflare Pages:**
1. Connect repo
2. Build command: `npm run build:client`
3. Output directory: `client/dist`
4. Add environment variable

### Option B: CDN + S3 (AWS)

```bash
cd client
npm run build:client
aws s3 sync dist/ s3://your-bucket-name --delete
aws cloudfront create-invalidation --distribution-id <id> --paths "/*"
```

---

## ✅ Post-Deployment Verification

### 1. Test API Endpoints

```bash
# Health check
curl https://api.yourdomain.com/api/health

# Public endpoints (should work)
curl https://api.yourdomain.com/api/records/nt_students

# Admin endpoints (should require auth)
curl https://api.yourdomain.com/api/admin/leads/student
# Should return 401 Unauthorized
```

### 2. Test Frontend

- [ ] Homepage loads
- [ ] All pages navigate correctly
- [ ] Forms submit successfully
- [ ] Admin login works
- [ ] API calls succeed (check Network tab)

### 3. Security Checks

```bash
# Check security headers
curl -I https://api.yourdomain.com/api/health

# Should see:
# X-Content-Type-Options: nosniff
# X-Frame-Options: DENY
# X-XSS-Protection: 1; mode=block
# etc.
```

### 4. Monitor Logs

```bash
# PM2 logs
pm2 logs nettech-api

# Or check your hosting platform's logs
```

---

## 🔒 Security Checklist

- [x] ✅ JWT_SECRET is strong and unique
- [x] ✅ No hardcoded secrets in code
- [x] ✅ Rate limiting enabled
- [x] ✅ Security headers (helmet) enabled
- [x] ✅ NoSQL injection protection enabled
- [x] ✅ CORS configured correctly (not wildcard)
- [x] ✅ HTTPS enabled (SSL certificate)
- [x] ✅ Default admin not created in production
- [x] ✅ Error messages don't leak sensitive info
- [x] ✅ Database connection uses production URI

---

## 🐛 Troubleshooting

### Backend won't start
- Check MongoDB connection string
- Verify JWT_SECRET is set
- Check logs: `pm2 logs` or hosting platform logs

### CORS errors
- Verify `CLIENT_ORIGIN` matches your frontend domain exactly
- Check for trailing slashes
- Ensure HTTPS matches (http vs https)

### Admin login fails
- Verify admin user exists: Check MongoDB
- Check JWT_SECRET matches between creation and login
- Check token expiration (24 hours)

### Forms not submitting
- Check `VITE_API_BASE_URL` in frontend
- Verify backend is accessible
- Check browser console for errors
- Verify CORS is configured

---

## 📊 Monitoring Recommendations

1. **Uptime Monitoring**: UptimeRobot, Pingdom
2. **Error Tracking**: Sentry, Rollbar
3. **Log Aggregation**: Logtail, Papertrail
4. **Performance**: New Relic, DataDog

---

## 🔄 Updates & Maintenance

### Update Dependencies
```bash
cd backend
npm update
npm audit fix
```

### Backup Database
```bash
# MongoDB Atlas has automatic backups
# Or manual backup:
mongodump --uri="<your-mongodb-uri>" --out=./backup
```

### Restart Server
```bash
pm2 restart nettech-api
# Or via hosting platform dashboard
```

---

## 📞 Support

If you encounter issues:
1. Check `PRODUCTION_READINESS.md` for known issues
2. Review server logs
3. Test endpoints with curl/Postman
4. Verify environment variables are set correctly

---

**Your site is now production-ready! 🎉**

hisald