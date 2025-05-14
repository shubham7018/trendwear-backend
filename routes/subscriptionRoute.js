import express from 'express';
import { subscribe } from '../controllers/subscriptionController.js';

const subscriptionRouter = express.Router();

subscriptionRouter.post('/subscribe', subscribe);

export default subscriptionRouter; 