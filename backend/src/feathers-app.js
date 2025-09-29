const { feathers } = require('@feathersjs/feathers');
const express = require('@feathersjs/express');
const socketio = require('@feathersjs/socketio');
const authentication = require('@feathersjs/authentication');
const local = require('@feathersjs/authentication-local');
const configuration = require('@feathersjs/configuration');

require('dotenv').config();

const { MongoClient } = require('mongodb');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Create Express app
const app = express(feathers());

// Load app configuration
app.configure(configuration());

// CORS and security
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', process.env.CORS_ORIGINS || '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Parse JSON and form data
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Configure Feathers with Express
app.configure(express.rest());
app.configure(socketio());

// MongoDB connection - Use correct env variable name
let db;
MongoClient.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/jmon_studio')
  .then(client => {
    console.log('✅ Connected to MongoDB');
    db = client.db();
    app.set('db', db);
  })
  .catch(error => {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  });

// JWT Authentication middleware (simple approach for custom auth)
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'jmon-studio-secret');
    const user = await db.collection('users').findOne({ id: decoded.userId });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    req.user = user;
    next();
  } catch (error) {
    res.status(403).json({ error: 'Invalid token' });
  }
};

// Authentication hook for services
const authenticateService = async (context) => {
  const authHeader = context.params.headers?.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) throw new Error('Authentication required');
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'jmon-studio-secret');
    const user = await db.collection('users').findOne({ id: decoded.userId });
    
    if (!user) throw new Error('User not found');
    
    context.params.user = user;
  } catch (error) {
    throw new Error('Authentication failed');
  }
};

// Users service
class UsersService {
  constructor(db) {
    this.db = db;
    this.collection = db.collection('users');
  }

  async find(params) {
    const users = await this.collection.find({}).project({ password: 0 }).toArray();
    return { data: users, total: users.length };
  }

  async get(id, params) {
    const user = await this.collection.findOne({ id });
    if (!user) throw new Error('User not found');
    delete user.password;
    return user;
  }

  async create(data, params) {
    // Hash password using bcrypt
    const hashedPassword = await bcrypt.hash(data.password, 10);
    
    const user = {
      id: uuidv4(),
      username: data.username,
      email: data.email,
      password: hashedPassword,
      fullName: data.fullName,
      createdAt: new Date(),
      isActive: true
    };

    await this.collection.insertOne(user);
    
    // Create default folder
    await this.db.collection('folders').insertOne({
      id: uuidv4(),
      name: 'My Projects',
      description: 'Default folder for your compositions',
      userId: user.id,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Log analytics
    await this.db.collection('analytics').insertOne({
      id: uuidv4(),
      userId: user.id,
      eventType: 'user_register',
      timestamp: new Date(),
      metadata: { username: user.username }
    });

    delete user.password;
    return user;
  }

  async patch(id, data, params) {
    const updateData = { ...data, updatedAt: new Date() };
    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, 10);
    }

    await this.collection.updateOne({ id }, { $set: updateData });
    const user = await this.collection.findOne({ id });
    delete user.password;
    return user;
  }

  async remove(id, params) {
    const result = await this.collection.deleteOne({ id });
    return { id };
  }
}

// Projects service
class ProjectsService {
  constructor(db) {
    this.db = db;
    this.collection = db.collection('projects');
  }

  async find(params) {
    const userId = params.user?.id;
    if (!userId) throw new Error('Authentication required');
    
    let query = { userId };
    if (params.query?.folder_id) {
      query.folderId = params.query.folder_id;
    } else if (params.query?.folder_id === '') {
      query.folderId = { $exists: false };
    }

    const projects = await this.collection.find(query).toArray();
    return projects; // Return array directly, not wrapped in { data, total }
  }

  async get(id, params) {
    const userId = params.user?.id;
    if (!userId) throw new Error('Authentication required');
    
    const project = await this.collection.findOne({ id, userId });
    if (!project) throw new Error('Project not found');
    return project;
  }

  async create(data, params) {
    const userId = params.user?.id;
    if (!userId) throw new Error('Authentication required');

    const project = {
      id: uuidv4(),
      userId,
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
      playCount: 0
    };

    await this.collection.insertOne(project);
    
    // Log analytics
    await this.db.collection('analytics').insertOne({
      id: uuidv4(),
      userId,
      eventType: 'project_create',
      projectId: project.id,
      timestamp: new Date(),
      metadata: { projectName: project.name }
    });

    return project;
  }

  async patch(id, data, params) {
    const userId = params.user?.id;
    if (!userId) throw new Error('Authentication required');

    const updateData = { ...data, updatedAt: new Date() };
    const result = await this.collection.updateOne(
      { id, userId },
      { $set: updateData }
    );

    if (result.matchedCount === 0) throw new Error('Project not found');
    
    // Log analytics
    await this.db.collection('analytics').insertOne({
      id: uuidv4(),
      userId,
      eventType: 'project_update',
      projectId: id,
      timestamp: new Date()
    });
    
    const project = await this.collection.findOne({ id, userId });
    return project;
  }

  async remove(id, params) {
    const userId = params.user?.id;
    if (!userId) throw new Error('Authentication required');

    const result = await this.collection.deleteOne({ id, userId });
    if (result.deletedCount === 0) throw new Error('Project not found');
    
    // Log analytics
    await this.db.collection('analytics').insertOne({
      id: uuidv4(),
      userId,
      eventType: 'project_delete',
      projectId: id,
      timestamp: new Date()
    });
    
    return { message: 'Project deleted successfully' };
  }
}

// Folders service
class FoldersService {
  constructor(db) {
    this.db = db;
    this.collection = db.collection('folders');
  }

  async find(params) {
    const userId = params.user?.id;
    if (!userId) throw new Error('Authentication required');
    
    const folders = await this.collection.find({ userId }).toArray();
    return folders; // Return array directly
  }

  async create(data, params) {
    const userId = params.user?.id;
    if (!userId) throw new Error('Authentication required');

    const folder = {
      id: uuidv4(),
      userId,
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await this.collection.insertOne(folder);
    
    // Log analytics
    await this.db.collection('analytics').insertOne({
      id: uuidv4(),
      userId,
      eventType: 'folder_create',
      timestamp: new Date(),
      metadata: { folderName: folder.name }
    });
    
    return folder;
  }

  async patch(id, data, params) {
    const userId = params.user?.id;
    if (!userId) throw new Error('Authentication required');

    const updateData = { ...data, updatedAt: new Date() };
    const result = await this.collection.updateOne(
      { id, userId },
      { $set: updateData }
    );

    if (result.matchedCount === 0) throw new Error('Folder not found');
    
    const folder = await this.collection.findOne({ id, userId });
    return folder;
  }

  async remove(id, params) {
    const userId = params.user?.id;
    if (!userId) throw new Error('Authentication required');

    // Move projects in this folder to root
    await this.db.collection('projects').updateMany(
      { folderId: id, userId },
      { $unset: { folderId: "" } }
    );

    const result = await this.collection.deleteOne({ id, userId });
    if (result.deletedCount === 0) throw new Error('Folder not found');
    
    return { message: 'Folder deleted successfully' };
  }
}

// Wait for MongoDB connection then configure services
setTimeout(() => {
  if (db) {
    // Register services
    app.use('/api/users', new UsersService(db));
    app.use('/api/projects', new ProjectsService(db));
    app.use('/api/folders', new FoldersService(db));
    
    // Add authentication hooks to services
    app.service('/api/projects').hooks({
      before: {
        all: [authenticateService]
      }
    });

    app.service('/api/folders').hooks({
      before: {
        all: [authenticateService]
      }
    });

    // Custom authentication endpoints
    app.post('/api/auth/register', async (req, res) => {
      try {
        const { username, email, password, full_name } = req.body;
        
        // Check if user exists
        const existingUser = await db.collection('users').findOne({
          $or: [{ username }, { email }]
        });
        
        if (existingUser) {
          return res.status(400).json({ detail: 'Username or email already registered' });
        }
        
        // Create user
        const usersService = app.service('/api/users');
        const user = await usersService.create({
          username,
          email,
          password,
          fullName: full_name
        });
        
        // Create JWT token
        const token = jwt.sign(
          { userId: user.id },
          process.env.JWT_SECRET || 'jmon-studio-secret',
          { expiresIn: '24h' }
        );
        
        res.json({
          access_token: token,
          token_type: 'bearer',
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            full_name: user.fullName
          }
        });
      } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ detail: 'Registration failed' });
      }
    });

    app.post('/api/auth/login', async (req, res) => {
      try {
        const { username, password } = req.body;
        
        // Find user
        const user = await db.collection('users').findOne({ username });
        
        if (!user || !await bcrypt.compare(password, user.password)) {
          return res.status(401).json({ detail: 'Incorrect username or password' });
        }
        
        // Update last login
        await db.collection('users').updateOne(
          { id: user.id },
          { $set: { lastLogin: new Date() } }
        );
        
        // Log analytics
        await db.collection('analytics').insertOne({
          id: uuidv4(),
          userId: user.id,
          eventType: 'user_login',
          timestamp: new Date()
        });
        
        // Create JWT token
        const token = jwt.sign(
          { userId: user.id },
          process.env.JWT_SECRET || 'jmon-studio-secret',
          { expiresIn: '24h' }
        );
        
        res.json({
          access_token: token,
          token_type: 'bearer',
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            full_name: user.fullName
          }
        });
      } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ detail: 'Login failed' });
      }
    });

    app.get('/api/auth/me', authenticateToken, (req, res) => {
      res.json({
        id: req.user.id,
        username: req.user.username,
        email: req.user.email,
        full_name: req.user.fullName,
        created_at: req.user.createdAt,
        last_login: req.user.lastLogin
      });
    });

    // Analytics endpoints
    app.get('/api/analytics/stats', authenticateToken, async (req, res) => {
      try {
        const userId = req.user.id;
        
        const [totalUsers, totalProjects, totalCompilations, totalPlays, popularProjects] = await Promise.all([
          db.collection('users').countDocuments({}),
          db.collection('projects').countDocuments({ userId }),
          db.collection('analytics').countDocuments({ userId, eventType: 'jmon_compile' }),
          db.collection('analytics').countDocuments({ userId, eventType: 'project_play' }),
          db.collection('projects')
            .find({ userId })
            .project({ name: 1, playCount: 1, lastPlayed: 1 })
            .sort({ playCount: -1 })
            .limit(5)
            .toArray()
        ]);
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const activeUsersToday = await db.collection('analytics').countDocuments({
          eventType: 'user_login',
          timestamp: { $gte: today }
        });
        
        res.json({
          total_users: totalUsers,
          total_projects: totalProjects,
          total_compilations: totalCompilations,
          total_plays: totalPlays,
          active_users_today: activeUsersToday,
          popular_projects: popularProjects
        });
      } catch (error) {
        console.error('Analytics stats error:', error);
        res.status(500).json({ detail: 'Failed to fetch analytics' });
      }
    });

    app.get('/api/analytics/activity', authenticateToken, async (req, res) => {
      try {
        const userId = req.user.id;
        const days = parseInt(req.query.days) || 7;
        
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        
        const activity = await db.collection('analytics')
          .find({
            userId,
            timestamp: { $gte: startDate }
          })
          .sort({ timestamp: -1 })
          .limit(100)
          .toArray();
        
        res.json(activity);
      } catch (error) {
        console.error('Analytics activity error:', error);
        res.status(500).json({ detail: 'Failed to fetch activity' });
      }
    });

    // JMON Compile Route
    app.post('/api/jmon/compile', authenticateToken, async (req, res) => {
      try {
        const { code, project_id } = req.body;
        
        if (!code) {
          return res.status(400).json({ detail: 'No code provided' });
        }
        
        // Mock compilation for now - can be enhanced with actual jmon-studio integration
        const compiledObject = {
          compiled: true,
          object: {
            tracks: [],
            tempo: 120,
            timeSignature: '4/4',
            duration: 0
          },
          errors: []
        };
        
        // Log analytics
        await db.collection('analytics').insertOne({
          id: uuidv4(),
          userId: req.user.id,
          eventType: 'jmon_compile',
          projectId: project_id,
          timestamp: new Date(),
          metadata: { codeLength: code.length }
        });
        
        res.json(compiledObject);
      } catch (error) {
        console.error('Compilation error:', error);
        res.json({
          compiled: false,
          object: null,
          errors: [error.message]
        });
      }
    });

    // Project play tracking
    app.post('/api/projects/:id/play', authenticateToken, async (req, res) => {
      try {
        const projectId = req.params.id;
        
        // Update play count
        await db.collection('projects').updateOne(
          { id: projectId, userId: req.user.id },
          { 
            $inc: { playCount: 1 },
            $set: { lastPlayed: new Date() }
          }
        );
        
        // Log analytics
        await db.collection('analytics').insertOne({
          id: uuidv4(),
          userId: req.user.id,
          eventType: 'project_play',
          projectId: projectId,
          timestamp: new Date()
        });
        
        res.json({ message: 'Play tracked' });
      } catch (error) {
        console.error('Play tracking error:', error);
        res.status(500).json({ detail: 'Failed to track play' });
      }
    });

    // Health check
    app.get('/api/', (req, res) => {
      res.json({
        message: 'JMON Studio - Multi-User Music Platform API',
        version: '2.0.0',
        framework: 'FeathersJS v5',
        features: [
          'User Authentication',
          'Project Folders', 
          'Usage Analytics',
          'JMON Compilation',
          'OpenDAW Integration',
          'Service-oriented Architecture'
        ],
        ethics: 'Built with inclusive practices in mind 🕊️'
      });
    });

    app.get('/api/health', (req, res) => {
      res.json({ 
        status: 'healthy', 
        timestamp: new Date(),
        database: db ? 'connected' : 'disconnected'
      });
    });
  }
}, 1000);

// Error handling
app.use(express.errorHandler());

// Start server
const port = process.env.PORT || 8001;
app.listen(port, () => {
  console.log(`🎵 JMON Studio API running on http://localhost:${port}`);
  console.log('🕊️ Built with FeathersJS v5: inclusive, accessible, and community-focused');
  console.log('🎼 Ready for algorithmic music creation and collaboration');
});

module.exports = app;