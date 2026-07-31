const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const compression = require('compression');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');

const app = express();

// ==========================
// Security Middlewares
// ==========================

app.use(helmet());

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
  })
);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes.',
  },
});

app.use('/api', limiter);

app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

// Disable mongoSanitize while running tests
if (process.env.NODE_ENV !== 'test') {
  app.use(mongoSanitize());
}

app.use(hpp());
app.use(compression());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ==========================
// Swagger
// ==========================

try {
  const swaggerDocument = YAML.load(
    path.join(__dirname, '../swagger.yaml')
  );

  app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument)
  );
} catch (error) {
  console.log('Swagger file not found yet, skipping...');
}

// ==========================
// Static Files
// ==========================

app.use(express.static(path.join(__dirname, '../public')));

// ==========================
// Health Check
// ==========================

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// ==========================
// Routes
// ==========================

const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const taskRoutes = require('./routes/taskRoutes');
const userRoutes = require('./routes/userRoutes');
const statsRoutes = require('./routes/statsRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);
app.use('/api/stats', statsRoutes);
// ==========================
// 404 Handler
// ==========================

app.use((req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({
      success: false,
      message: `Can't find ${req.originalUrl} on this server.`,
    });
  }

  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// ==========================
// Global Error Handler
// ==========================

app.use((err, req, res, next) => {
  if (process.env.NODE_ENV !== 'test') {
    console.error(err);
  }

  res.status(err.statusCode || 500).json({
    success: false,
    message:
      process.env.NODE_ENV === 'production'
        ? 'Internal Server Error'
        : err.message,
  });
});

module.exports = app;