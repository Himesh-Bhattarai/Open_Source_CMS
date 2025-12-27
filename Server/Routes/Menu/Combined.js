import express from 'express';
import MenuItemRoute from './MenuItem.js';
import MenuRoute from './Menu.js';

const router = express.Router();

router.use('/menu-item', MenuItemRoute);
router.use('/menu', MenuRoute);

export default router