import { Router } from 'express';
import { protect } from '../middlewares/protect';
import * as handlers from './handlers';

const router = Router();

router.get('/current-user', protect, handlers.getCurrentUser);
router.post('/login', handlers.login);
router.post('/register', handlers.register);

export default router;
