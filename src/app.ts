import { errorHandler, NotFoundError } from '@pippip/pip-system-common';
import cookieSession from 'cookie-session';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import 'express-async-errors';
import morgan from 'morgan';
import agencyRoutes from './routes/agency.routes';
import authRoutes from './routes/auth.routes';
import carRoutes from './routes/car.routes';
import driverRoutes from './routes/driver.routes';
import registerRoutes from './routes/register.routes';
import userRoutes from './routes/user.routes';

dotenv.config();

const app = express();
app.set('trust proxy', true);

const WEB_ADMIN_URL = process.env.WEB_ADMIN_URL ?? false;
const DEV_WEB_ADMIN_URL = process.env.DEV_WEB_ADMIN_URL ?? false;
const WEB_PARTNER_URL = process.env.WEB_PARTNER_URL ?? false;
const corsURLs = [WEB_ADMIN_URL, WEB_PARTNER_URL, DEV_WEB_ADMIN_URL].filter((v) => v);
app.use(
  cors({
    credentials: true,
    origin: corsURLs.length > 0 ? corsURLs : '*',
    methods: ['POST', 'GET', 'PUT', 'DELETE'],
    optionsSuccessStatus: 200,
    preflightContinue: true,
  }),
);
// app.use(compression({ level: 6, threshold: 100 * 1000 }));
app.use(morgan('tiny'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cookieSession({
    name: 'session',
    secure: process.env.NODE_ENV === 'product',
    keys: [process.env.COOKIE_SECRET!],
    maxAge: parseInt(process.env.COOKIE_EXP!),
    signed: true,
    httpOnly: true,
  }),
);

app.get('/', (req, res) => res.send('Hello from PIPCAR!'));
app.get('/api', (req, res) => res.send('Hello from PIPCAR API!'));
// readdirSync("./routes").map((r) => app.use("/api", require("./routes/" + r)));
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', agencyRoutes);
app.use('/api', registerRoutes);
app.use('/api', carRoutes);
app.use('/api', driverRoutes);

console.log(process.env.NODE_ENV);
console.log('corsURLs', corsURLs);

app.all('*', () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export default app;
