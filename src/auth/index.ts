import { Router } from 'express';
import * as handlers from './handlers';

const router = Router();

router.get('/current-user', handlers.getCurrentUser);
router.post('/login', handlers.login);
router.post('/register', handlers.register);

export default router;
