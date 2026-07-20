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
import blogV2Router from './routes/blogV2Routes';
import membershipApplicationRouter from './routes/membershipApplicationRoutes';
import memberSignupRouter from './routes/memberSignupRoutes';
import orderRouter from './routes/orderRoute';
import ogboniRouter from './routes/ogboniRoutes';
import contactRouter from './routes/contactRoutes';

console.log('Ogboni router imported');

// Create a DOMPurify instance
const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

// Start express app
const app = express();

// ======================================================
// GLOBAL MIDDLEWARES
// ======================================================

// CORS
app.use(
  cors({
    origin: [
      'https://ajangbileheritage.com',
      'https://www.ajangbileheritage.com',
      'https://ajangbile-frontend.onrender.com',
      'http://localhost:5173',
    ],
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
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

// Serve static files
app.use(
  express.static(path.join(__dirname, 'public'), {
    maxAge: 31557600000,
  }),
);

// Security headers
app.use(helmet());

// Development logger
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Body parser
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Cookie parser
app.use(cookieParser());

// Prevent Mongo injection
app.use(mongoSanitize());

// Prevent HTTP Parameter Pollution
app.use(
  hpp({
    whitelist: [],
  }),
);

// Compression
app.use(compression());

// Sanitize HTML input
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

// Request timestamp
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// Root test route
app.get('/', (req, res) => {
  console.log('Root route hit');
  res.status(200).send('Backend server is running successfully!');
});

// ======================================================
// ROUTES
// ======================================================

// Existing APIs
app.use('/api/products', productRouter);
app.use('/api/user', userRouter);
app.use('/api/blogs', blogRouter);
app.use('/api/order', orderRouter);
app.use('/api/ogboni', ogboniRouter);
app.use('/api/contact', contactRouter);

// Blog CMS
app.use('/api/blog-v2', blogV2Router);

// Membership Applications
app.use('/api/membership-applications', membershipApplicationRouter);

// Existing Member Online Login Requests
app.use('/api/member-signup', memberSignupRouter);

// ======================================================
// UNKNOWN ROUTES
// ======================================================

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global error handler
app.use(globalErrorHandler);

export default app;
