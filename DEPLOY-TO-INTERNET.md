# Deploy Math4052 to the Internet

## Option 1: DigitalOcean (Recommended for beginners)

### Step 1: Create a Droplet
1. Sign up at [DigitalOcean](https://www.digitalocean.com)
2. Create a Droplet:
   - Choose Ubuntu 22.04
   - Select at least 2GB RAM
   - Choose a datacenter near your users
   - Add SSH keys for security

### Step 2: Connect to Your Server
```bash
ssh root@your-server-ip
```

### Step 3: Install Docker
```bash
# Update system
apt update && apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Install Docker Compose
apt install docker-compose-plugin -y
```

### Step 4: Setup Your Domain
1. Buy a domain (e.g., from Namecheap, GoDaddy)
2. Point your domain to your server IP:
   - Add A record: `@` → `your-server-ip`
   - Add A record: `www` → `your-server-ip`
   - Add A record: `api` → `your-server-ip`

### Step 5: Deploy Your App
```bash
# Clone your repository
git clone https://github.com/yourusername/math4052.git
cd math4052

# Create production environment file
nano .env.production
```

Add to `.env.production`:
```env
# MongoDB
MONGO_ROOT_USERNAME=admin
MONGO_ROOT_PASSWORD=your_secure_password_here

# JWT
JWT_SECRET=generate_a_very_long_random_string_here

# URLs - Replace with your domain
FRONTEND_URL=https://math4052.com
BACKEND_URL=https://api.math4052.com

# Stripe (if using)
STRIPE_SECRET_KEY=your_stripe_key
```

### Step 6: Setup SSL with Let's Encrypt
```bash
# Install Certbot
apt install certbot python3-certbot-nginx -y

# Get SSL certificates
certbot certonly --standalone -d math4052.com -d www.math4052.com -d api.math4052.com
```

### Step 7: Deploy with Docker
```bash
# Use production docker-compose
docker-compose -f docker-compose.prod.yml up -d
```

---

## Option 2: AWS EC2

### Step 1: Launch EC2 Instance
1. Go to AWS Console → EC2
2. Launch Instance:
   - Choose Amazon Linux 2 or Ubuntu
   - Select t3.small or larger
   - Configure Security Group:
     - Port 22 (SSH)
     - Port 80 (HTTP)
     - Port 443 (HTTPS)

### Step 2: Connect and Install
```bash
# Connect
ssh -i your-key.pem ec2-user@your-instance-ip

# Install Docker
sudo yum update -y
sudo yum install docker -y
sudo service docker start
sudo usermod -a -G docker ec2-user

# Install Docker Compose
sudo curl -L https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m) -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### Step 3: Deploy (same as DigitalOcean steps 5-7)

---

## Option 3: Railway.app (Easiest - No Server Management)

1. Push your code to GitHub
2. Go to [Railway.app](https://railway.app)
3. Connect your GitHub repository
4. Railway will auto-detect Docker setup
5. Add environment variables in Railway dashboard
6. Deploy with one click!

---

## Option 4: Google Cloud Run (Serverless)

### Prepare for Cloud Run:
```bash
# Build and push to Google Container Registry
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/math4052-backend ./math4052-backend
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/math4052-frontend ./math4052-frontend

# Deploy
gcloud run deploy math4052-backend --image gcr.io/YOUR_PROJECT_ID/math4052-backend --platform managed
gcloud run deploy math4052-frontend --image gcr.io/YOUR_PROJECT_ID/math4052-frontend --platform managed
```

---

## Quick Deployment Script

Save this as `deploy.sh`:
```bash
#!/bin/bash
echo "Deploying Math4052..."

# Pull latest code
git pull origin main

# Load environment variables
export $(cat .env.production | xargs)

# Build and restart containers
docker-compose -f docker-compose.prod.yml build --no-cache
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d

echo "Deployment complete!"
echo "Frontend: https://math4052.com"
echo "Backend: https://api.math4052.com"
```

---

## Post-Deployment Checklist

- [ ] Domain DNS configured correctly
- [ ] SSL certificates installed
- [ ] Environment variables set
- [ ] MongoDB has strong password
- [ ] Firewall configured (only ports 80, 443, 22 open)
- [ ] Backups configured
- [ ] Monitoring setup (optional)

---

## Estimated Costs

- **DigitalOcean**: $12-24/month (2-4GB Droplet)
- **AWS EC2**: $10-30/month (t3.small/medium)
- **Railway**: $5-20/month (usage-based)
- **Google Cloud Run**: $0-50/month (pay per request)

---

## Need Help?

Common issues:
- **Port 80/443 already in use**: Stop any existing web servers
- **Permission denied**: Use `sudo` for Docker commands
- **Can't connect**: Check firewall/security group settings
- **SSL not working**: Make sure domain DNS is properly configured first