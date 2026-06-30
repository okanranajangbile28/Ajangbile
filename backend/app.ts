import path from 'path';
import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import { JSDOM } from 'jsdom';
import createDOMPurify from 'dompurify';
import hpp from 'hpp';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import compression from 'compression';
import cors from 'cors';

import AppError from './utils/appError';
import globalErrorHandler from './controllers/errorController';

import productRouter from './routes/productRoutes';
import userRouter from './routes/userRoutes';
import blogRouter from './routes/blogRoute';
import orderRouter from './routes/orderRoute';
import ogboniRouter from './routes/ogboniRoutes'; // <-- ADD THIS
console.log('Ogboni router imported');
// Create a DOMPurify instance
const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

// Start express app
const app = express();

// ==================== GLOBAL MIDDLEWARES ====================

// Implement CORS
app.use(
  cors({
    origin: ['http://localhost:5173', 'https://okanran-ajangbile.vercel.app'],
    methods: 'GET,POST,PATCH,DELETE,PUT',
    credentials: true,
  }),
);

app.options('*', cors());

// Session
app.use(
  session({
    secret: 'keyboard time',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 360000,
    },
  }),
);

// Serving static files
app.use(
  express.static(path.join(__dirname, 'public'), {
    maxAge: 31557600000,
  }),
);

// Set security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Body parser
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Cookie parser
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [],
  }),
);

// Compression
app.use(compression());

// Global DOMPurify Middleware
app.use((req, res, next) => {
  if (req.body) {
    Object.keys(req.body).forEach((key) => {
      if (typeof req.body[key] === 'string') {
        req.body[key] = DOMPurify.sanitize(req.body[key]);
      }
    });
  }

  next();
});

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// Test route
app.get('/', (req, res) => {
  console.log('Root route hit');
  res.status(200).send('Backend server is running successfully!');
});

// ==================== ROUTES ====================

app.use('/api/products', productRouter);
app.use('/api/user', userRouter);
app.use('/api/blogs', blogRouter);
app.use('/api/order', orderRouter);
app.use('/api/ogboni', ogboniRouter); // <-- ADD THIS

// Handle undefined routes
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global error handler
app.use(globalErrorHandler);

export default app;
