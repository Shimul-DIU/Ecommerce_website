import express from 'express';
import { createOrder } from '../../controller/orderController.js';
import ordersDetails from '../../controller/orders/ordersDetails.js';
import passport from 'passport';

const orderRouter = express.Router();

orderRouter.post('/', passport.authenticate("jwt", { session: false }), createOrder);
orderRouter.get('/order-details', passport.authenticate('jwt', { session: false }), ordersDetails);

export default orderRouter;