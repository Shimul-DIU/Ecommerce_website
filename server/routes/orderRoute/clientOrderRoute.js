import express from 'express'
import { createOrder } from '../../controller/orderController'
const orderRouter=express.Router()
orderRouter.post('/', createOrder)

export default orderRouter