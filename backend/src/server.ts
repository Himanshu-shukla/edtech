import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';

import { connectDatabase } from './utils/database';
import routes from './routes';
import { 
  errorHandler, 
  notFoundHandler, 
  createRateLimiter, 
  corsOptions 
} from './middleware';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Security middleware
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(cors(corsOptions));

// Rate limiting
const limiter = createRateLimiter(
  Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  Number(process.env.RATE_LIMIT_MAX_REQUESTS) || 100 // 100 requests per window
);
app.use(limiter);

// Compression and logging
app.use(compression());
app.use(morgan('combined'));

// Body parsing
app.use(
  express.json({
    limit: '10mb',
    verify: (req: any, _res, buf) => {
      if (req.originalUrl.includes('/payments/webhook')) {
        req.rawBody = buf.toString();
      }
    }
  })
);

app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static file serving for uploads with CORS headers - INSIDE the API prefix
const uploadsPath = path.join(__dirname, '../../uploads');
app.use(`${process.env.API_PREFIX || '/api'}/uploads`, (req, res, next) => {
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
}, express.static(uploadsPath));

// API routes
app.use(process.env.API_PREFIX || '/api', routes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'EdTech Backend API',
    version: '1.0.0',
    status: 'Running',
    timestamp: new Date().toISOString()
  });
});

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
const startServer = async (): Promise<void> => {
  try {
    // Connect to database
    await connectDatabase();
    
    // Start listening
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📱 API Base URL: http://localhost:${PORT}${process.env.API_PREFIX || '/api'}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('📴 SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('📴 SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Start the server
startServer();

export default app;
