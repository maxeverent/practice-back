const Router = require('express');

const controller = require('./ordersController');

const router = new Router;

router.get('/get', controller.getAllOrders);                      //все заказы (архив)
router.get('/items_by_id/:id', controller.getOrderItemsById);     //продукты в заказе по id заказа

module.exports = router;