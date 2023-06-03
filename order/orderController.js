const db = require('../db/dbConfig');

class orderController {
    getNowDate = () => {
        return new Date().toISOString().slice(0,10).split('-').reverse().join('.');
    };

    createOrderItem = async (req, res) => {
        try {
            const orderItem = req.body;
            await db("order_item").insert(orderItem);

            let order = await db.select("*").from("order").where("date", "=", this.getNowDate());
            if (order.length == 0) {
                await db("order").insert({
                    date: this.getNowDate(),
                    user_id: null,
                    status: false
                });
            }
            order = await db.select("*").from("order").where("date", "=", this.getNowDate());
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

    deleteOrderItem = async (req, res) => {
        try {
            const { id } = req.params;
            await db("order_to_item").where("order_item_id", id).del();
            await db("order_item").where("id", id).del();
            return res.status(200).json("ok");
        } catch(e) {
            return res.status(400).json(e);
        }
    };

    getCurrentOrderItems = async (req, res) => {
        try {
            const order = await db.select("*").from("order").where("date", "=", this.getNowDate());
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

    getAllOrders = async (req, res) => {
        try {
            const result = await db.select('*').from('order');
            // const result = await db('order')
            //                         .join('user', 'order.user_id', 'user.id')
            //                         .select('order.id', 'order.date', 'order.user_id', 'user.fname', 'user.sname', 'user.lname');
            console.log(result);
            return res.status(200).json(result.reverse());
        } catch(e) {
            console.log(e)
            return res.status(400).json("err");
        };
    };

    updateResponseUser = async (req, res) => {
        try {
            const { id } = req.params;
            console.log(id)
            const orderItem = {
                date: this.getNowDate(),
                user_id: id
            };
            const order = await db('order').where('date', this.getNowDate());
            if (order.length == 0) {
                await db("order").insert({
                    date: this.getNowDate(),
                    status: false
                })
            };
            await db('order').where('date', this.getNowDate()).update(orderItem);
            const result = await db('order')
                                    .join('user', 'order.user_id', 'user.id')
                                    .select('order.id', 'order.status', 'order.date', 'order.user_id', 'user.fname', 'user.sname', 'user.lname')
                                    .where('date', this.getNowDate());
            return res.status(200).json(result[0]);
        } catch(e) {
            console.log(e)
            return res.status(400).json("err");
        }
    };

    getCurrentOrder = async (req, res) => {
        try {
            const order = await db('order').where('date', '=', this.getNowDate());
            if (order.length == 0) {
                return res.status(200).json(order);
            }
            if (order[0].user_id == null) {
                return res.status(200).json(order[0]);
            }
            const result = await db('order')
                                    .join('user', 'order.user_id', 'user.id')
                                    .select('order.id', 'order.status', 'order.date', 'order.user_id', 'user.fname', 'user.sname', 'user.lname')
                                    .where('date', this.getNowDate());
            console.log(result);
            return res.status(200).json(result[0]);
        } catch(e) {
            return res.status(400).json("err");
        };
    };

    makeOrder = async (req, res) => {
        try {
            const order = await db('order').where('date', '=', this.getNowDate());
            if (order.length == 0) {
                await db('order').insert({
                    date: this.getNowDate(),
                    user_id: null,
                    status: true
                });
                const createdOrder = await db('order').where('date', '=', this.getNowDate());
                return res.status(200).json(createdOrder[0]);
            };
            await db('order').where('date', '=', this.getNowDate()).update('status', true);
            const updatedOrder = await db('order').where('date', '=', this.getNowDate());
            return res.status(200).json(updatedOrder[0]);
        } catch(e) {
            return res.status(400).json("err");
        };
    };

    usersWhoOrdered = async (req, res) => {
        try {
            const order = await db('order').where('date', '=', this.getNowDate());
            if (order.length == 0) return res.status(200).json([]);
            const orderItems = await db.raw('select order_item.id, order_item.name, order_item.count, order_item.price, order_item.user_id from order_item inner join order_to_item on order_item.id = order_to_item.order_item_id and order_to_item.order_id = ?', order[0].id);
            
            const usersId = [];
            orderItems.forEach(element => {
                usersId.push(element.user_id)
            });

            let uniqueUsersId = [...new Set(usersId)];

            const users = await db("user");

            const usersWhoOrdered = [];

            uniqueUsersId.forEach((el) => {
                users.forEach((el2) => {
                    if (el == el2.id) {
                        usersWhoOrdered.push(el2)
                    }
                })
            });

            return res.status(200).json(usersWhoOrdered);

        } catch(e) {
            console.log(e)
            return res.status(400).json("err")
        }
    }
};

module.exports = new orderController();