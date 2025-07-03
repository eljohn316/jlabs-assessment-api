import express from 'express';
import morgan from 'morgan';
import auth from './auth/router';
import errorHandler from './middlewares/error-handler';

const app = express();

app.use(express.json());
app.use(morgan('dev'));

app.use('/api/auth', auth);
app.use(errorHandler);

app.listen(3000, () => {
  console.log('Server ready at: http://localhost:3000');
});
