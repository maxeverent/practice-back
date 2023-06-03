const Router = require('express');

const controller = require('./orderController');

const router = new Router;

router.get('/current', controller.getCurrentOrder);     //текущий заказ

router.get('/items', controller.getCurrentOrderItems);    //все продукты в текущем заказе
router.get('/items/:id', controller.getOrderItemsById);      //все продукты в любом заказе по id
router.post('/createitem', controller.createOrderItem);         //добавить продукт в заказ
router.delete('/deleteitem/:id', controller.deleteOrderItem);     //удалить продукт из заказа
router.get('/users', controller.usersWhoOrdered);                      //пользователи которые выбрали товары в текущем заказе
router.post('/selectrespuser/:id', controller.updateResponseUser);   //выбрать ответственного за заказ

router.post('/make', controller.makeOrder);       //оформить заказ

router.get('/orders', controller.getAllOrders);   //архив заказов

module.exports = router;