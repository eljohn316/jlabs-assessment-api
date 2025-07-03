import express from 'express';
import morgan from 'morgan';
import cors from 'cors';

import auth from './auth/router';
import errorHandler from './middlewares/error-handler';
import notFoundHandler from './middlewares/not-found-handler';

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/auth', auth);
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(3000, () => {
  console.log('Server ready at: http://localhost:3000');
});
