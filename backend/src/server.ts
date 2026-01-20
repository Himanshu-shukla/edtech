import express, { Request, Response, NextFunction } from 'express';
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

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Security
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));
app.use(cors(corsOptions));

// Rate limiting
app.use(
  createRateLimiter(
    Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
    Number(process.env.RATE_LIMIT_MAX_REQUESTS) || 100
  )
);

// Compression + logs
app.use(compression());
app.use(morgan('combined'));

// JSON body with rawBody support (for Razorpay webhook)
app.use(
  express.json({
    limit: '10mb',
    verify: (
      req: Request & { rawBody?: Buffer },
      _res: Response,
      buf: Buffer
    ) => {
      if (req.originalUrl.includes('/payments/webhook')) {
        req.rawBody = buf;
      }
    }
  })
);

app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static uploads
const uploadsPath = path.join(__dirname, '../../uploads');

app.use(
  `${process.env.API_PREFIX || '/api'}/uploads`,
  (req: Request, res: Response, next: NextFunction) => {
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
  },
  express.static(uploadsPath)
);

// API
app.use(process.env.API_PREFIX || '/api', routes);

// Root
app.get('/', (_req: Request, res: Response) => {
  res.json({
    message: 'EdTech Backend API',
    status: 'Running',
    timestamp: new Date().toISOString()
  });
});

// Errors
app.use(notFoundHandler);
app.use(errorHandler);

// Start
const startServer = async (): Promise<void> => {
  try {
    await connectDatabase();
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('❌ Failed to start server', err);
    process.exit(1);
  }
};

startServer();

export default app;
