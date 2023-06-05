const Router = require('express');

const controller = require('./currentOrderController');

const router = new Router;

router.get('/info', controller.getCurrentOrder);                            //инфо о текущем заказе
router.get('/items', controller.getCurrentOrderItems);                      //продукты в текущем заказе
router.post('/create_item', controller.createOrderItem);                    //добавить продукт в заказ
router.delete('/delete_item/:id', controller.deleteOrderItem);              //удалить
router.get('/users', controller.usersWhoOrdered);                           //пользователи которые добавили продукты в заказ
router.post('/responsible_user/:id', controller.updateResponsibleUser)      //выбрать ответственного
router.post('/create', controller.makeOrder);                               //создать заказ

module.exports = router;