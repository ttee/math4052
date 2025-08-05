#!/bin/bash

# Server Setup Script for Math4052
# Run this on a fresh Ubuntu server

set -e

echo "======================================"
echo "Math4052 Server Setup"
echo "======================================"

# Update system
echo "Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install Docker
if ! command -v docker &> /dev/null; then
    echo "Installing Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    rm get-docker.sh
else
    echo "Docker already installed"
fi

# Install Docker Compose
if ! command -v docker-compose &> /dev/null; then
    echo "Installing Docker Compose..."
    sudo apt install docker-compose-plugin -y
else
    echo "Docker Compose already installed"
fi

# Install other utilities
echo "Installing utilities..."
sudo apt install -y git nginx certbot python3-certbot-nginx ufw

# Configure firewall
echo "Configuring firewall..."
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw --force enable

# Create application directory
APP_DIR="/opt/math4052"
if [ ! -d "$APP_DIR" ]; then
    echo "Creating application directory..."
    sudo mkdir -p $APP_DIR
    sudo chown $USER:$USER $APP_DIR
fi

# Clone repository (replace with your repo URL)
if [ ! -d "$APP_DIR/.git" ]; then
    echo "Cloning repository..."
    echo "Please enter your Git repository URL:"
    read -r GIT_REPO
    git clone $GIT_REPO $APP_DIR
else
    echo "Repository already exists"
fi

cd $APP_DIR

# Create environment file
if [ ! -f ".env.production" ]; then
    echo "Creating production environment file..."
    cat > .env.production << 'EOF'
# MongoDB
MONGO_ROOT_USERNAME=admin
MONGO_ROOT_PASSWORD=CHANGE_THIS_PASSWORD

# JWT
JWT_SECRET=CHANGE_THIS_TO_RANDOM_STRING

# URLs - Update with your domain
FRONTEND_URL=https://yourdomain.com
BACKEND_URL=https://api.yourdomain.com

# Stripe (optional)
STRIPE_SECRET_KEY=your_stripe_key_here
EOF
    echo ""
    echo "IMPORTANT: Edit .env.production with your values!"
    echo "nano $APP_DIR/.env.production"
fi

# Create SSL directory
sudo mkdir -p /etc/nginx/ssl

echo ""
echo "======================================"
echo "Setup complete!"
echo "======================================"
echo ""
echo "Next steps:"
echo "1. Edit .env.production with your values"
echo "2. Point your domain to this server's IP"
echo "3. Run: sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com -d api.yourdomain.com"
echo "4. Deploy: cd $APP_DIR && ./scripts/deploy.sh production"
echo ""
echo "Note: You may need to log out and back in for Docker permissions"