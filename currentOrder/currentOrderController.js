const db = require('../db/dbConfig');

getNowDate = () => {
    return new Date().toLocaleString().slice(0,10).split('-').reverse().join('.');
};

class currentOrderController {
    async getCurrentOrder (req, res) {
        try {
            const order = await db('order').where('date', '=', getNowDate());
            if (order.length == 0) {
                return res.status(200).json(order);
            }
            if (order[0].user_id == null) {
                return res.status(200).json(order[0]);
            }
            const result = await db('order')
                                    .join('user', 'order.user_id', 'user.id')
                                    .select('order.id', 'order.status', 'order.date', 'order.user_id', 'user.fname', 'user.sname', 'user.lname')
                                    .where('date', getNowDate());
            console.log(result);
            return res.status(200).json(result[0]);
        } catch(e) {
            console.log(e)
            return res.status(400).json("err");
        };
    };

    async getCurrentOrderItems (req, res) {
        try {
            const order = await db.select("*").from("order").where("date", "=", getNowDate());
            if (order.length == 0) {
                return res.status(200).json(order);
            };
            const orderItems = await db.raw('select order_item.id, order_item.name, order_item.count, order_item.price, order_item.user_id from order_item inner join order_to_item on order_item.id = order_to_item.order_item_id and order_to_item.order_id = ?', order[0].id);
            return res.status(200).json(orderItems);

        } catch(e) {
            console.log(e)
            return res.status(400).json("err")
        }
    };

    async createOrderItem (req, res) {
        try {
            const orderItem = req.body;
            await db("order_item").insert(orderItem);

            let order = await db.select("*").from("order").where("date", "=", getNowDate());
            if (order.length == 0) {
                await db("order").insert({
                    date: getNowDate(),
                    user_id: null,
                    status: false
                });
            }
            order = await db.select("*").from("order").where("date", "=", getNowDate());
            const items = await db.select("*").from("order_item");

            await db("order_to_item").insert({
                    order_id: order[0].id,
                    order_item_id: items[items.length - 1].id
                });
            const createdOrderItem = await db('order_item');                
            return res.status(200).json(createdOrderItem[createdOrderItem.length - 1]);
        } catch(e) {
            return res.status(400).json(e);
        }
    };

    async deleteOrderItem (req, res) {
        try {
            const { id } = req.params;
            await db("order_to_item").where("order_item_id", id).del();
            await db("order_item").where("id", id).del();
            return res.status(200).json("ok");
        } catch(e) {
            return res.status(400).json(e);
        }
    };

    async usersWhoOrdered (req, res) {
        try {
            const order = await db('order').where('date', '=', getNowDate());
            if (order.length == 0) return res.status(200).json([]);
            
            const users = await db('order_item')
                                    .distinct('user_id')
                                    .join('order_to_item', 'order_item.id', 'order_to_item.order_item_id')
                                    .join('user', 'user.id', 'order_item.user_id')
                                    .select('user.id', 'user.fname', 'user.sname', 'user.lname')
                                    .where('order_to_item.order_id', '=', order[0].id);

            return res.status(200).json(users);

        } catch(e) {
            console.log(e)
            return res.status(400).json("err")
        }
    };

    async updateResponsibleUser (req, res) {
        try {
            const { id } = req.params;
            const orderItem = {
                date: getNowDate(),
                user_id: id
            };
            const order = await db('order').where('date', getNowDate());
            if (order.length == 0) {
                await db("order").insert({
                    date: getNowDate(),
                    status: false
                })
            };
            await db('order').where('date', getNowDate()).update(orderItem);
            const result = await db('order')
                                    .join('user', 'order.user_id', 'user.id')
                                    .select('order.id', 'order.status', 'order.date', 'order.user_id', 'user.fname', 'user.sname', 'user.lname')
                                    .where('date', getNowDate());
            return res.status(200).json(result[0]);
        } catch(e) {
            console.log(e)
            return res.status(400).json("err");
        }
    };

    async makeOrder (req, res) {
        try {
            const order = await db('order').where('date', '=', getNowDate());
            if (order.length == 0) {
                await db('order').insert({
                    date: getNowDate(),
                    user_id: null,
                    status: true
                });
                const createdOrder = await db('order').where('date', '=', getNowDate());
                return res.status(200).json(createdOrder[0]);
            };
            await db('order').where('date', '=', getNowDate()).update('status', true);
            const updatedOrder = await db('order').where('date', '=', getNowDate());
            return res.status(200).json(updatedOrder[0]);
        } catch(e) {
            return res.status(400).json("err");
        };
    };
}

module.exports = new currentOrderController();