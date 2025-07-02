import express from 'express';
import auth from './auth';

const app = express();

app.use(express.json());

app.use('/api/auth', auth);

app.listen(3000, () => {
  console.log('Serving ready at: http://localhost:3000');
});
