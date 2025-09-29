# JMON Studio - Algorithmic Music Composition Platform

A beautiful, multi-user music creation platform combining algorithmic composition (jmon-studio) with professional DAW integration (openDAW).

![JMON Studio Interface](https://via.placeholder.com/800x400/4d6a6d/eae0cc?text=JMON+Studio)

## 🎵 Features

- **Algorithmic Music Composition**: Create music with JavaScript using jmon-studio
- **Multi-User Support**: Secure authentication, user profiles, and data isolation
- **Project Organization**: Folders, tags, and project management
- **Real-time Audio Preview**: Immediate feedback with Tone.js integration
- **openDAW Integration**: Professional DAW capabilities for editing and mixing
- **Usage Analytics**: Track composition activity and popular projects
- **Beautiful UI**: Peaceful earth-tone palette for focused creativity

## 🏗️ Technical Stack

- **Frontend**: React 18 + Monaco Editor + Tone.js
- **Backend**: FeathersJS v5 + JWT Authentication + Service Architecture
- **Database**: MongoDB with UUID-based document storage
- **Styling**: CSS3 with peaceful earth-tone color palette
- **Audio**: Web Audio API + Tone.js

## 📋 Prerequisites

### System Requirements
- Ubuntu 18.04 LTS or later
- 2GB+ RAM
- 10GB+ available disk space
- Node.js 18+ and npm/yarn

## 🚀 Installation Guide

### Step 1: Update System
```bash
sudo apt update && sudo apt upgrade -y
```

### Step 2: Install Node.js 18+
```bash
# Install NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -

# Install Node.js
sudo apt-get install -y nodejs

# Verify installation
node --version
npm --version
```

### Step 3: Install MongoDB
```bash
# Import MongoDB GPG key
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -

# Add MongoDB repository
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu $(lsb_release -cs)/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Update package list
sudo apt update

# Install MongoDB
sudo apt-get install -y mongodb-org

# Start and enable MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# Verify MongoDB is running
sudo systemctl status mongod
```

### Step 4: Install Yarn (Optional but Recommended)
```bash
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
sudo apt update && sudo apt install yarn
```

### Step 5: Install Git and Clone Repository
```bash
# Install Git
sudo apt install -y git

# Clone the repository (replace with your actual repo URL)
git clone https://github.com/your-username/jmon-studio.git
cd jmon-studio
```

### Step 6: Install Dependencies

#### Backend Dependencies
```bash
cd backend
npm install
# or
yarn install
```

#### Frontend Dependencies
```bash
cd ../frontend
npm install
# or
yarn install
```

### Step 7: Configure Environment Variables

#### Backend Configuration
```bash
cd ../backend
cp .env.example .env
nano .env
```

Edit the `.env` file with your configuration:
```env
NODE_ENV=production
PORT=8001
MONGO_URL=mongodb://localhost:27017/jmon_studio
JWT_SECRET=your-super-secure-jwt-secret-key-change-this-in-production
CORS_ORIGINS=http://localhost:3000,https://yourdomain.com
```

**Note**: The FeathersJS implementation uses `MONGO_URL` instead of `MONGODB_URL`.

#### Frontend Configuration
```bash
cd ../frontend
cp .env.example .env
nano .env
```

Edit the frontend `.env` file:
```env
REACT_APP_BACKEND_URL=http://localhost:8001
# For production, use your actual domain:
# REACT_APP_BACKEND_URL=https://api.yourdomain.com
```

## 🔄 Running the Application

### Development Mode

#### Start Backend (Terminal 1)
```bash
cd backend
npm run dev
# or
yarn dev

# For direct execution with FeathersJS:
node src/feathers-app.js
```

#### Start Frontend (Terminal 2)
```bash
cd frontend
npm start
# or
yarn start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8001

## 🧪 Testing the Application

### Quick Health Check
```bash
# Test backend health
curl http://localhost:8001/api/health

# Test API info
curl http://localhost:8001/api/

# Expected response should show FeathersJS framework information
```

### Manual Testing Workflow
1. **Open the frontend** at http://localhost:3000
2. **Register a new user** - fill out the registration form
3. **Create a new project** - click "New Project" and save it
4. **Test the Monaco Editor** - write some JavaScript code
5. **Test JMON compilation** - click "Compile" to test code compilation
6. **Test audio preview** - use the play/stop controls
7. **Create folders** - organize your projects into folders
8. **Test navigation** - switch between folders and projects

### API Testing Examples
```bash
# Register a user
curl -X POST http://localhost:8001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123","full_name":"Test User"}'

# Login
curl -X POST http://localhost:8001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"password123"}'

# Create a project (replace YOUR_JWT_TOKEN with actual token from login response)
curl -X POST http://localhost:8001/api/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"name":"My First Project","description":"A test project","jmonCode":"// Your JMON code here"}'
```

### Production Mode

#### Build Frontend
```bash
cd frontend
npm run build
# or
yarn build
```

#### Start Backend
```bash
cd ../backend
NODE_ENV=production npm start
# or
NODE_ENV=production yarn start

# For direct FeathersJS execution:
NODE_ENV=production node src/feathers-app.js
```

## 🌐 Production Deployment

### Using PM2 (Recommended)

#### Install PM2
```bash
sudo npm install -g pm2
```

#### Create PM2 Ecosystem File
Create `ecosystem.config.js` in the project root:
```javascript
module.exports = {
  apps: [
    {
      name: 'jmon-studio-backend',
      script: './backend/src/feathers-app.js',
      cwd: '/path/to/jmon-studio',
      env: {
        NODE_ENV: 'production',
        PORT: 8001,
        MONGO_URL: 'mongodb://localhost:27017/jmon_studio'
      },
      instances: 1,
      exec_mode: 'cluster',
      max_memory_restart: '500M'
    }
  ]
};
```

#### Start with PM2
```bash
# Start the application
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
```

### Using Systemd Services

#### Create Backend Service
```bash
sudo nano /etc/systemd/system/jmon-studio.service
```

Add the following content:
```ini
[Unit]
Description=JMON Studio FeathersJS Backend
After=network.target mongod.service
Requires=mongod.service

[Service]
Type=simple
User=www-data
WorkingDirectory=/path/to/jmon-studio/backend
ExecStart=/usr/bin/node src/feathers-app.js
Restart=always
RestartSec=10
Environment=NODE_ENV=production
Environment=PORT=8001
Environment=MONGO_URL=mongodb://localhost:27017/jmon_studio
Environment=JWT_SECRET=your-secure-jwt-secret

[Install]
WantedBy=multi-user.target
```

#### Enable and Start Service
```bash
sudo systemctl daemon-reload
sudo systemctl enable jmon-studio
sudo systemctl start jmon-studio
sudo systemctl status jmon-studio
```

### Reverse Proxy with Nginx

#### Install Nginx
```bash
sudo apt install -y nginx
```

#### Configure Nginx
```bash
sudo nano /etc/nginx/sites-available/jmon-studio
```

Add the following configuration:
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Frontend (React build)
    location / {
        root /path/to/jmon-studio/frontend/build;
        try_files $uri $uri/ /index.html;
        
        # Enable gzip compression
        gzip on;
        gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:8001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### Enable Site
```bash
sudo ln -s /etc/nginx/sites-available/jmon-studio /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### SSL with Let's Encrypt (Recommended for Production)

#### Install Certbot
```bash
sudo apt install -y certbot python3-certbot-nginx
```

#### Get SSL Certificate
```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

## 🔧 Configuration Options

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | Backend server port | `8001` |
| `MONGO_URL` | MongoDB connection string | `mongodb://localhost:27017/jmon_studio` |
| `JWT_SECRET` | JWT signing secret | Required in production |
| `CORS_ORIGINS` | Allowed CORS origins | `*` |
| `REACT_APP_BACKEND_URL` | Frontend API endpoint | `http://localhost:8001` |

### Database Configuration

The application automatically creates the required collections in MongoDB:
- `users` - User accounts and profiles (UUID-based IDs)
- `projects` - Music projects and compositions
- `folders` - Project organization folders
- `analytics` - Usage tracking and statistics

### FeathersJS Service Architecture

The backend uses FeathersJS v5 service-oriented architecture:

#### Services
- **Users Service** (`/api/users`) - User management with bcrypt password hashing
- **Projects Service** (`/api/projects`) - Project CRUD operations with folder filtering
- **Folders Service** (`/api/folders`) - Folder management with automatic project relocation

#### Authentication
- Custom JWT authentication middleware
- Service-level authentication hooks
- Token-based API access control

#### Key Features
- Service hooks for authentication and validation
- MongoDB integration with UUID-based documents
- RESTful API endpoints with FeathersJS patterns
- Real-time capabilities (WebSocket support available)

## 🛡️ Security Considerations

1. **Change Default Secrets**: Always change JWT secrets in production
2. **Database Security**: Configure MongoDB authentication for production
3. **Firewall**: Configure UFW to only allow necessary ports
4. **SSL/TLS**: Use HTTPS in production with Let's Encrypt
5. **Regular Updates**: Keep dependencies and system packages updated

```bash
# Configure UFW firewall
sudo ufw allow ssh
sudo ufw allow http
sudo ufw allow https
sudo ufw enable
```

## 📊 Monitoring and Logs

### Application Logs
```bash
# PM2 logs
pm2 logs jmon-studio-backend

# Systemd logs
sudo journalctl -u jmon-studio -f

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### MongoDB Logs
```bash
sudo tail -f /var/log/mongodb/mongod.log
```

## 🔄 Updates and Maintenance

### Update Application
```bash
# Pull latest changes
git pull origin main

# Update backend dependencies
cd backend && npm install

# Update frontend dependencies
cd ../frontend && npm install

# Rebuild frontend
npm run build

# Restart services
pm2 restart jmon-studio-backend
# or
sudo systemctl restart jmon-studio
```

### Backup Database
```bash
# Create backup
mongodump --db jmon_studio --out /path/to/backups/$(date +%Y-%m-%d)

# Restore backup
mongorestore --db jmon_studio /path/to/backups/backup-date/jmon_studio
```

## 🆘 Troubleshooting

### Common Issues

#### Backend Won't Start
```bash
# Check logs
pm2 logs jmon-studio-backend
# or
sudo journalctl -u jmon-studio

# Check if MongoDB is running
sudo systemctl status mongod

# Check if port is in use
sudo netstat -tulpn | grep :8001
```

#### Frontend Build Fails
```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Check Node.js version
node --version  # Should be 16+
```

#### Database Connection Issues
```bash
# Check MongoDB status
sudo systemctl status mongod

# Check MongoDB logs
sudo tail -f /var/log/mongodb/mongod.log

# Test connection
mongo --eval "db.stats()"
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎵 Support

For support and questions:
- Create an issue on GitHub
- Join our Discord community
- Email: support@jmonstudio.com

---

**JMON Studio** - Where algorithms meet artistry 🎼✨
