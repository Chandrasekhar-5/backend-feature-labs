import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import authRouter from '../routes/auth.route.js';
import { errorHandler } from '../middlewares/error.middleware.js';
import userRouter from '../routes/user.route.js';
import noteRouter from '../routes/note.route.js';
import adminRouter from '../routes/admin.route.js';

const app = express();

app.use(express.json());
app.use(morgan('dev'));
app.use(cookieParser());


app.use('/api/auth', authRouter);

app.use('/api/users', userRouter);

app.use('/api/notes', noteRouter);

app.use('/api/admin', adminRouter);

app.use(errorHandler);

export default app;