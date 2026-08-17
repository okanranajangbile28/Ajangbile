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
import paymentRoutes from './routes/paymentRoutes';

import announcementRouter from './routes/announcementRoutes';

console.log('Ogboni router imported');

// ======================================================
// DOMPURIFY
// ======================================================

const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

// ======================================================
// START EXPRESS APP
// ======================================================

const app = express();

// ======================================================
// CORS
// ======================================================

app.use(
  cors({
    origin: [
      'https://ajangbileheritage.com',
      'https://www.ajangbileheritage.com',
      'https://ajangbile-frontend.onrender.com',
      'http://localhost:5173',
    ],

    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],

    credentials: true,
  }),
);

app.options('*', cors());

// ======================================================
// SESSION
// ======================================================

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

// ======================================================
// STATIC FILES
// ======================================================

app.use(
  express.static(path.join(__dirname, 'public'), {
    maxAge: 31557600000,
  }),
);

// ======================================================
// SECURITY HEADERS
// ======================================================

app.use(helmet());

// ======================================================
// DEVELOPMENT LOGGER
// ======================================================

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ======================================================
// STRIPE WEBHOOK
//
// IMPORTANT:
// Stripe requires the ORIGINAL RAW request body
// to verify the webhook signature.
//
// This MUST come BEFORE express.json().
// ======================================================

// SHOP STRIPE WEBHOOK
app.use(
  '/api/order/stripe/webhook',
  express.raw({
    type: 'application/json',
  }),
);

// MEMBERSHIP INITIATION STRIPE WEBHOOK
app.use(
  '/api/payments/stripe/webhook',
  express.raw({
    type: 'application/json',
  }),
);

// ======================================================
// BODY PARSERS
//
// These apply to all normal API requests.
// The Stripe webhook above has already been handled
// with express.raw().
// ======================================================

app.use(
  express.json({
    limit: '10kb',
  }),
);

app.use(
  express.urlencoded({
    extended: true,
    limit: '10kb',
  }),
);

// ======================================================
// COOKIE PARSER
// ======================================================

app.use(cookieParser());

// ======================================================
// PREVENT MONGO INJECTION
// ======================================================

app.use(mongoSanitize());

// ======================================================
// PREVENT HTTP PARAMETER POLLUTION
// ======================================================

app.use(
  hpp({
    whitelist: [],
  }),
);

// ======================================================
// COMPRESSION
// ======================================================

app.use(compression());

// ======================================================
// SANITIZE HTML INPUT
// ======================================================

app.use((req, res, next) => {
  if (req.body && typeof req.body === 'object') {
    Object.keys(req.body).forEach((key) => {
      if (typeof req.body[key] === 'string') {
        req.body[key] = DOMPurify.sanitize(req.body[key]);
      }
    });
  }

  next();
});

// ======================================================
// REQUEST TIMESTAMP
// ======================================================

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// ======================================================
// ROOT TEST ROUTE
// ======================================================

app.get('/', (req, res) => {
  console.log('Root route hit');

  res.status(200).send('Backend server is running successfully!');
});

// ======================================================
// ROUTES
// ======================================================

// Products
app.use('/api/products', productRouter);

// Users / Authentication
app.use('/api/user', userRouter);

// Blog
app.use('/api/blogs', blogRouter);

// Orders / Stripe / PayPal / Paystack
app.use('/api/order', orderRouter);

// Ogboni
app.use('/api/ogboni', ogboniRouter);

// Contact
app.use('/api/contact', contactRouter);

// Membership Applications
app.use('/api/membership-applications', membershipApplicationRouter);

// Announcements
app.use('/api/announcements', announcementRouter);

// Payments
app.use('/api/payments', paymentRoutes);

// Blog CMS
app.use('/api/blog-v2', blogV2Router);

// Member Signup
app.use('/api/member-signup', memberSignupRouter);

// ======================================================
// UNKNOWN ROUTES
// ======================================================

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// ======================================================
// GLOBAL ERROR HANDLER
// ======================================================

app.use(globalErrorHandler);

export default app;
