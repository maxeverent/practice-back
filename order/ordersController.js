const db = require('../db/dbConfig');

getNowDate = () => {
    return new Date().toLocaleString().slice(0,10).split('-').reverse().join('.');
};

class ordersController {
    getAllOrders = async (req, res) => {
        try {
            const result = await db.select('*').from('order');
            return res.status(200).json(result.reverse());
        } catch(e) {
            console.log(e)
            return res.status(400).json("err");
        };
    };

    getOrderItemsById = async (req, res) => {
        try {
            const { id } = req.params;
            const orderItems = await db.raw('select order_item.id, order_item.name, order_item.count, order_item.price, order_item.user_id from order_item inner join order_to_item on order_item.id = order_to_item.order_item_id and order_to_item.order_id = ?', id);
            return res.status(200).json(orderItems);
        } catch(e) {
            console.log(e)
            return res.status(400).json("err")
        }
    };
};

module.exports = new ordersController();